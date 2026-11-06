package com.resumeai.service;

import com.resumeai.dto.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    private static final Logger log = LoggerFactory.getLogger(ResumeParserService.class);

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+?\\d{1,3}[-.\s]?)?\\(?\\d{3}\\)?[-.\s]?\\d{3}[-.\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?linkedin\\.com/in/[a-zA-Z0-9_-]+", Pattern.CASE_INSENSITIVE);
    private static final Pattern GITHUB_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?github\\.com/[a-zA-Z0-9_-]+", Pattern.CASE_INSENSITIVE);

    public static class ParseResult {
        public String rawText;
        public ResumeUpdateRequest resume;

        public ParseResult(String rawText, ResumeUpdateRequest resume) {
            this.rawText = rawText;
            this.resume = resume;
        }
    }

    public ParseResult parseUploadedResume(MultipartFile file) {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "UploadedResume.pdf";
        String text = extractText(file);

        ResumeUpdateRequest resume = new ResumeUpdateRequest();
        resume.setTitle(cleanTitle(filename));
        resume.setTemplateKey("modern");

        PersonalInfoDto personalInfo = new PersonalInfoDto();
        extractContactInfo(text, personalInfo);
        resume.setPersonalInfo(personalInfo);

        // Section segmentation
        Map<String, String> sections = segmentSections(text);

        // Extract Summary
        if (sections.containsKey("summary")) {
            resume.setSummary(sections.get("summary").trim());
        } else if (text.length() > 200) {
            resume.setSummary(extractFallbackSummary(text));
        }

        // Extract Experiences
        if (sections.containsKey("experience")) {
            resume.setExperiences(parseExperiences(sections.get("experience")));
        }

        // Extract Education
        if (sections.containsKey("education")) {
            resume.setEducations(parseEducations(sections.get("education")));
        }

        // Extract Skills
        if (sections.containsKey("skills")) {
            resume.setSkills(parseSkills(sections.get("skills")));
        }

        // Extract Projects
        if (sections.containsKey("projects")) {
            resume.setProjects(parseProjects(sections.get("projects")));
        }

        // Extract Certifications
        if (sections.containsKey("certifications")) {
            resume.setCertifications(parseCertifications(sections.get("certifications")));
        }

        return new ParseResult(text, resume);
    }

    public String extractText(MultipartFile file) {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";

        try (InputStream is = file.getInputStream()) {
            if (filename.endsWith(".pdf") || contentType.contains("pdf")) {
                try (PDDocument document = PDDocument.load(is)) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    stripper.setSortByPosition(true);
                    return stripper.getText(document).trim();
                }
            } else {
                return new String(file.getBytes(), StandardCharsets.UTF_8).trim();
            }
        } catch (Exception e) {
            log.error("Failed to extract text from file: {}", filename, e);
            throw new RuntimeException("Could not extract readable text from " + filename + ". Please ensure the file is an unencrypted PDF or plain text document.");
        }
    }

    private String cleanTitle(String filename) {
        String name = filename.replaceFirst("\\.[^.]+$", "");
        return name.replaceAll("[_-]", " ").trim();
    }

    private void extractContactInfo(String text, PersonalInfoDto info) {
        String[] lines = text.split("\\r?\\n");

        for (int i = 0; i < Math.min(lines.length, 6); i++) {
            String line = lines[i].trim();
            if (line.isEmpty() || line.length() > 50 || line.contains("@") || line.contains("http") || line.contains("Curriculum Vitae") || line.equalsIgnoreCase("resume")) {
                continue;
            }
            if (info.getFullName() == null || info.getFullName().isEmpty()) {
                info.setFullName(line);
            } else if (info.getJobTitle() == null || info.getJobTitle().isEmpty()) {
                if (!line.matches(".*\\d.*")) {
                    info.setJobTitle(line);
                }
            }
        }

        Matcher emailMatcher = EMAIL_PATTERN.matcher(text);
        if (emailMatcher.find()) {
            info.setEmail(emailMatcher.group());
        }

        Matcher phoneMatcher = PHONE_PATTERN.matcher(text);
        if (phoneMatcher.find()) {
            info.setPhone(phoneMatcher.group());
        }

        Matcher liMatcher = LINKEDIN_PATTERN.matcher(text);
        if (liMatcher.find()) {
            info.setLinkedinUrl(liMatcher.group());
        }

        Matcher ghMatcher = GITHUB_PATTERN.matcher(text);
        if (ghMatcher.find()) {
            info.setGithubUrl(ghMatcher.group());
        }
    }

    private Map<String, String> segmentSections(String text) {
        Map<String, String> sections = new LinkedHashMap<>();
        String[] lines = text.split("\\r?\\n");

        String currentSection = null;
        StringBuilder currentBuffer = new StringBuilder();

        for (String line : lines) {
            String trimmed = line.trim();
            String detected = detectSectionHeader(trimmed);

            if (detected != null) {
                if (currentSection != null) {
                    sections.put(currentSection, currentBuffer.toString().trim());
                }
                currentSection = detected;
                currentBuffer = new StringBuilder();
            } else if (currentSection != null) {
                currentBuffer.append(line).append("\n");
            }
        }

        if (currentSection != null && currentBuffer.length() > 0) {
            sections.put(currentSection, currentBuffer.toString().trim());
        }

        return sections;
    }

    private String detectSectionHeader(String line) {
        String upper = line.toUpperCase().replaceAll("[^A-Z ]", "").trim();
        if (upper.length() < 3 || upper.length() > 35) return null;

        if (upper.matches("^(PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|SUMMARY|PROFILE|ABOUT ME|CAREER OBJECTIVE|OBJECTIVE)$")) {
            return "summary";
        }
        if (upper.matches("^(WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|CAREER HISTORY)$")) {
            return "experience";
        }
        if (upper.matches("^(EDUCATION|ACADEMIC BACKGROUND|ACADEMIC HISTORY|QUALIFICATIONS)$")) {
            return "education";
        }
        if (upper.matches("^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|AREAS OF EXPERTISE|TECHNOLOGIES)$")) {
            return "skills";
        }
        if (upper.matches("^(PROJECTS|PERSONAL PROJECTS|KEY PROJECTS|ACADEMIC PROJECTS)$")) {
            return "projects";
        }
        if (upper.matches("^(CERTIFICATIONS|CERTIFICATES|LICENSES & CERTIFICATIONS|COURSES)$")) {
            return "certifications";
        }

        return null;
    }

    private String extractFallbackSummary(String text) {
        String[] lines = text.split("\\r?\\n");
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (int i = 2; i < Math.min(lines.length, 10); i++) {
            String line = lines[i].trim();
            if (line.isEmpty() || line.contains("@") || line.contains("http") || detectSectionHeader(line) != null) continue;
            sb.append(line).append(" ");
            count++;
            if (count >= 3) break;
        }
        return sb.toString().trim();
    }

    private List<ExperienceDto> parseExperiences(String block) {
        List<ExperienceDto> list = new ArrayList<>();
        String[] chunks = block.split("(?m)(?=^(?:[A-Z0-9][A-Za-z0-9 ,.-]{3,50}\\s*(?:\\||-|,)\\s*.*\\b(?:19|20)\\d{2}\\b|\\b(?:19|20)\\d{2}\\b.*\\n))");

        if (chunks.length <= 1) {
            chunks = block.split("\\n\\s*\\n");
        }

        for (String chunk : chunks) {
            String trimmed = chunk.trim();
            if (trimmed.isEmpty()) continue;

            ExperienceDto exp = new ExperienceDto();
            String[] lines = trimmed.split("\\r?\\n");
            StringBuilder bullets = new StringBuilder();

            boolean headerFound = false;
            for (String line : lines) {
                String l = line.trim();
                if (l.isEmpty()) continue;

                if (!headerFound) {
                    if (l.contains("|") || l.contains(" - ") || l.contains(",")) {
                        String[] parts = l.split("[|,-]");
                        if (parts.length >= 2) {
                            exp.setPosition(parts[0].trim());
                            exp.setCompany(parts[1].trim());
                        } else {
                            exp.setCompany(l);
                        }
                    } else {
                        exp.setCompany(l);
                    }
                    headerFound = true;
                } else if (exp.getStartDate() == null && (l.matches(".*\\b(?:19|20)\\d{2}\\b.*") || l.toLowerCase().contains("present"))) {
                    String[] dateParts = l.split("[-–toTO]+");
                    exp.setStartDate(dateParts[0].trim());
                    if (dateParts.length > 1) {
                        exp.setEndDate(dateParts[1].trim());
                    } else {
                        exp.setEndDate("Present");
                    }
                } else {
                    if (l.startsWith("•") || l.startsWith("-") || l.startsWith("*")) {
                        bullets.append(l).append("\n");
                    } else {
                        bullets.append("• ").append(l).append("\n");
                    }
                }
            }

            if (exp.getPosition() == null || exp.getPosition().isEmpty()) {
                exp.setPosition("Role / Position");
            }
            if (exp.getCompany() == null || exp.getCompany().isEmpty()) {
                exp.setCompany("Company Name");
            }
            exp.setBulletPoints(bullets.toString().trim());
            exp.setDescription(bullets.toString().trim());
            list.add(exp);
        }

        return list;
    }

    private List<EducationDto> parseEducations(String block) {
        List<EducationDto> list = new ArrayList<>();
        String[] lines = block.split("\\r?\\n");

        EducationDto current = null;
        for (String line : lines) {
            String l = line.trim();
            if (l.isEmpty()) continue;

            if (current == null || (l.matches(".*\\b(University|College|Institute|School|Academy)\\b.*") && current.getInstitution() != null)) {
                if (current != null) list.add(current);
                current = new EducationDto();
            }

            if (current.getInstitution() == null && l.matches(".*\\b(University|College|Institute|School|Academy)\\b.*")) {
                current.setInstitution(l);
            } else if (current.getDegree() == null && (l.matches(".*\\b(Bachelor|Master|B\\.S|B\\.A|B\\.Tech|M\\.S|PhD|Associate|Diploma)\\b.*") || current.getInstitution() != null)) {
                current.setDegree(l);
            } else if (current.getEndDate() == null && l.matches(".*\\b(?:19|20)\\d{2}\\b.*")) {
                Matcher m = Pattern.compile("\\b(?:19|20)\\d{2}\\b").matcher(l);
                if (m.find()) {
                    current.setEndDate(m.group());
                }
            } else if (l.toLowerCase().contains("gpa") || l.contains("%")) {
                current.setGradeOrGpa(l);
            }
        }

        if (current != null && (current.getInstitution() != null || current.getDegree() != null)) {
            list.add(current);
        }

        return list;
    }

    private List<SkillDto> parseSkills(String block) {
        List<SkillDto> skills = new ArrayList<>();
        String[] lines = block.split("\\r?\\n");

        for (String line : lines) {
            String l = line.trim();
            if (l.isEmpty()) continue;

            String category = "Technical Skills";
            String content = l;

            if (l.contains(":")) {
                String[] parts = l.split(":", 2);
                category = parts[0].replaceAll("[^A-Za-z0-9 ]", "").trim();
                content = parts[1].trim();
            }

            String[] skillItems = content.split("[,•;|]");
            for (String item : skillItems) {
                String clean = item.trim().replaceAll("^[-*•]", "").trim();
                if (!clean.isEmpty() && clean.length() < 50) {
                    skills.add(new SkillDto(clean, category, "Intermediate"));
                }
            }
        }

        return skills;
    }

    private List<ProjectDto> parseProjects(String block) {
        List<ProjectDto> list = new ArrayList<>();
        String[] lines = block.split("\\r?\\n");

        ProjectDto current = null;
        StringBuilder desc = new StringBuilder();

        for (String line : lines) {
            String l = line.trim();
            if (l.isEmpty()) continue;

            if (l.startsWith("•") || l.startsWith("-") || l.startsWith("*")) {
                desc.append(l).append("\n");
            } else {
                if (current != null) {
                    current.setDescription(desc.toString().trim());
                    current.setBulletPoints(desc.toString().trim());
                    list.add(current);
                    desc = new StringBuilder();
                }
                current = new ProjectDto();
                current.setTitle(l);
            }
        }

        if (current != null) {
            current.setDescription(desc.toString().trim());
            current.setBulletPoints(desc.toString().trim());
            list.add(current);
        }

        return list;
    }

    private List<CertificationDto> parseCertifications(String block) {
        List<CertificationDto> list = new ArrayList<>();
        String[] lines = block.split("\\r?\\n");

        for (String line : lines) {
            String l = line.trim().replaceAll("^[-*•]", "").trim();
            if (!l.isEmpty()) {
                CertificationDto cert = new CertificationDto();
                if (l.contains("-") || l.contains("|") || l.contains("by")) {
                    String[] parts = l.split("[-|]|\\bby\\b");
                    cert.setName(parts[0].trim());
                    if (parts.length > 1) cert.setIssuer(parts[1].trim());
                } else {
                    cert.setName(l);
                    cert.setIssuer("Accredited Organization");
                }
                list.add(cert);
            }
        }

        return list;
    }
}
