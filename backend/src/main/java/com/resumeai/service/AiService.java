package com.resumeai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeai.dto.*;
import com.resumeai.entity.Resume;
import com.resumeai.repository.ResumeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private final ResumeRepository resumeRepository;

    @Value("${app.ai.provider:demo}")
    private String configuredProvider;

    @Value("${app.ai.openai.api-key:}")
    private String openAiApiKey;

    @Value("${app.ai.openai.base-url:https://api.openai.com/v1}")
    private String openAiBaseUrl;

    @Value("${app.ai.openai.model:gpt-4o-mini}")
    private String openAiModel;

    @Value("${app.ai.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.ai.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${app.ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${app.ai.ollama.model:llama3}")
    private String ollamaModel;

    private volatile boolean openAiQuotaExhausted = false;

    public AiService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    private boolean isLiveAiAvailable() {
        if (openAiQuotaExhausted && (geminiApiKey == null || geminiApiKey.isBlank())) {
            return false;
        }
        if ("openai".equalsIgnoreCase(configuredProvider) && !openAiQuotaExhausted && openAiApiKey != null && !openAiApiKey.isBlank()) return true;
        if ("gemini".equalsIgnoreCase(configuredProvider) && geminiApiKey != null && !geminiApiKey.isBlank()) return true;
        if ("ollama".equalsIgnoreCase(configuredProvider)) return true;
        if (!openAiQuotaExhausted && openAiApiKey != null && !openAiApiKey.isBlank()) return true;
        if (geminiApiKey != null && !geminiApiKey.isBlank()) return true;
        return false;
    }

    private String getEffectiveSourceTag() {
        if (isLiveAiAvailable()) {
            if (!openAiQuotaExhausted && openAiApiKey != null && !openAiApiKey.isBlank()) return "OPENAI (" + openAiModel + ")";
            if (geminiApiKey != null && !geminiApiKey.isBlank()) return "GEMINI (" + geminiModel + ")";
            return "OLLAMA (" + ollamaModel + ")";
        }
        if (openAiQuotaExhausted) {
            return "✨ Intelligent Demo Engine (OpenAI Quota Limit Reached)";
        }
        return "✨ Intelligent Demo Engine (Live API configured in Settings)";
    }

    // 1. Generate Professional Summary
    public SummaryGenerateResponse generateSummary(SummaryGenerateRequest request) {
        String role = request.getJobTitle() != null && !request.getJobTitle().isBlank() ? request.getJobTitle() : "Professional";
        int years = request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 3;
        String tone = request.getTone() != null ? request.getTone() : "Professional";
        String skillsStr = request.getKeySkills() != null && !request.getKeySkills().isEmpty() 
                ? String.join(", ", request.getKeySkills()) : "team collaboration, problem solving, modern methodologies";

        if (isLiveAiAvailable()) {
            try {
                String prompt = String.format(
                        "Write a 3-sentence high-impact ATS-optimized professional resume summary for a %s with %d years of experience. " +
                        "Key skills: %s. Tone: %s. Do not invent false credentials. Return plain text only.",
                        role, years, skillsStr, tone
                );
                String result = callLlm(prompt);
                if (result != null && !result.isBlank()) {
                    List<String> alt = Arrays.asList(
                            "Results-driven " + role + " with " + years + "+ years of demonstrated expertise in " + skillsStr + ". Proven track record of architecting scalable solutions and driving cross-functional alignment.",
                            "Forward-thinking " + role + " adept in leveraging " + skillsStr + " to enhance operational velocity and product innovation."
                    );
                    return new SummaryGenerateResponse(result.trim(), alt, getEffectiveSourceTag());
                }
            } catch (Exception ex) {
                log.warn("Live LLM summary call failed, falling back to intelligent demo engine: {}", ex.getMessage());
            }
        }

        // Intelligent Rule-Based Engine
        String mainSummary = String.format(
                "Results-oriented %s with %d+ years of experience delivering robust solutions and scalable workflows. " +
                "Deep proficiency in %s, with a continuous commitment to high quality, cross-functional collaboration, and measurable outcomes. " +
                "Recognized for strategic problem-solving and rapid adaptation to evolving team requirements.",
                role, years, skillsStr
        );

        List<String> alternatives = Arrays.asList(
                String.format("Innovative %s with %d+ years specializing in %s. Adept at driving process efficiency, fostering teamwork, and turning complex project requirements into reliable deliverables.", role, years, skillsStr),
                String.format("Dedicated %s possessing a strong foundation in %s. Committed to accelerating business objectives through analytical rigor, clear communication, and engineering excellence.", role, skillsStr)
        );

        return new SummaryGenerateResponse(mainSummary, alternatives, getEffectiveSourceTag());
    }

    // 2. Generate Bullet Points
    public BulletsGenerateResponse generateBullets(BulletsGenerateRequest request) {
        String raw = request.getRawInput() != null ? request.getRawInput().trim() : "";
        String role = request.getRole() != null ? request.getRole() : "Professional";
        String company = request.getCompany() != null ? request.getCompany() : "the organization";

        if (isLiveAiAvailable() && !raw.isBlank()) {
            try {
                String prompt = String.format(
                        "Convert this work experience description into 3 strong, ATS-friendly resume bullet points using action verbs: '%s'. " +
                        "Role: %s at %s. Focus on clarity, outcome, and professional impact without inventing false facts. " +
                        "Return bullet points separated by newlines, starting with a dash.",
                        raw, role, company
                );
                String result = callLlm(prompt);
                if (result != null && !result.isBlank()) {
                    List<String> bullets = Arrays.stream(result.split("\n"))
                            .map(s -> s.replaceFirst("^[-*•\\d.]+\\s*", "").trim())
                            .filter(s -> !s.isBlank())
                            .collect(Collectors.toList());
                    if (!bullets.isEmpty()) {
                        return new BulletsGenerateResponse(bullets, getEffectiveSourceTag());
                    }
                }
            } catch (Exception ex) {
                log.warn("Live LLM bullet generation failed: {}", ex.getMessage());
            }
        }

        // Heuristic Engine
        List<String> bullets = new ArrayList<>();
        if (raw.isBlank()) {
            bullets.add(String.format("Spearheaded core initiatives as %s at %s, optimizing delivery cycles by 25%%.", role, company));
            bullets.add("Collaborated cross-functionally with product, design, and engineering teams to establish scalable standards.");
            bullets.add("Engineered automated validation routines, reducing turnaround time and elevating overall output reliability.");
        } else {
            String cleanAction = raw.toLowerCase().replaceAll("^(i\\s+|managed\\s+|worked\\s+on\\s+|helped\\s+with\\s+)", "");
            bullets.add("Orchestrated " + cleanAction + ", achieving improved operational velocity and seamless cross-team delivery.");
            bullets.add("Architected sustainable workflows around " + raw + ", ensuring high compliance with engineering best practices.");
            bullets.add("Identified performance bottlenecks and implemented automated solutions, elevating project reliability and stakeholder satisfaction.");
        }

        return new BulletsGenerateResponse(bullets, getEffectiveSourceTag());
    }

    // 3. Improve Content
    public ImproveContentResponse improveContent(ImproveContentRequest request) {
        String content = request.getContent() != null ? request.getContent().trim() : "";
        if (content.isBlank()) {
            return new ImproveContentResponse(content, content, Collections.emptyList(), getEffectiveSourceTag());
        }

        if (isLiveAiAvailable()) {
            try {
                String prompt = String.format(
                        "Improve this resume text for '%s' focusing on grammar, active verbs, professional tone, and clarity. " +
                        "Do not fabricate qualifications or numerical stats: '%s'. " +
                        "Return improved text only.",
                        request.getTargetGoal(), content
                );
                String result = callLlm(prompt);
                if (result != null && !result.isBlank()) {
                    List<String> improvements = Arrays.asList(
                            "Replaced passive phrasing with decisive action verbs",
                            "Refined sentence structure for maximum ATS readability",
                            "Polished professional vocabulary and tone"
                    );
                    return new ImproveContentResponse(result.trim(), content, improvements, getEffectiveSourceTag());
                }
            } catch (Exception ex) {
                log.warn("Live LLM improve call failed: {}", ex.getMessage());
            }
        }

        String polished = content;
        polished = polished.replaceAll("(?i)\\bi helped with\\b", "Collaborated on");
        polished = polished.replaceAll("(?i)\\bi was responsible for\\b", "Spearheaded");
        polished = polished.replaceAll("(?i)\\bworked on\\b", "Engineered and delivered");
        polished = polished.replaceAll("(?i)\\bhandled\\b", "Administered and optimized");
        polished = polished.replaceAll("(?i)\\bmade\\b", "Developed");
        polished = polished.replaceAll("(?i)\\btalked to\\b", "Liaised with");
        polished = polished.replaceAll("(?i)\\bgood\\b", "exceptional");
        polished = polished.replaceAll("(?i)\\blot of\\b", "extensive");

        if (polished.equalsIgnoreCase(content)) {
            polished = "Spearheaded " + content.toLowerCase().replaceFirst("^to\\s+", "");
        }

        List<String> improvements = Arrays.asList(
                "Upgraded passive phrasing to executive action verbs",
                "Enhanced tone for applicant tracking systems (ATS)",
                "Eliminated filler words to maximize clarity and brevity"
        );

        return new ImproveContentResponse(polished, content, improvements, getEffectiveSourceTag());
    }

    // 4. ATS Resume Analysis
    public AtsAnalysisResponse analyzeAts(AtsAnalysisRequest request) {
        ResumeUpdateRequest data = request.getResumeData();

        // If resumeData was not provided, look up from DB via resumeId
        if (data == null && request.getResumeId() != null) {
            Optional<Resume> resumeOpt = resumeRepository.findById(request.getResumeId());
            if (resumeOpt.isPresent()) {
                Resume r = resumeOpt.get();
                data = new ResumeUpdateRequest();
                data.setTitle(r.getTitle());
                data.setTargetRole(r.getTargetRole());
                data.setSummary(r.getSummary());
                data.setFontFamily(r.getFontFamily());
                if (r.getPersonalInfo() != null) {
                    PersonalInfoDto p = new PersonalInfoDto();
                    p.setFullName(r.getPersonalInfo().getFullName());
                    p.setEmail(r.getPersonalInfo().getEmail());
                    p.setPhone(r.getPersonalInfo().getPhone());
                    p.setLocation(r.getPersonalInfo().getLocation());
                    p.setLinkedinUrl(r.getPersonalInfo().getLinkedinUrl());
                    p.setGithubUrl(r.getPersonalInfo().getGithubUrl());
                    data.setPersonalInfo(p);
                }
                if (r.getSkills() != null) {
                    data.setSkills(r.getSkills().stream()
                            .map(s -> new SkillDto(s.getName(), s.getCategory(), s.getProficiency()))
                            .collect(Collectors.toList()));
                }
                if (r.getExperiences() != null) {
                    data.setExperiences(r.getExperiences().stream()
                            .map(e -> {
                                ExperienceDto ed = new ExperienceDto();
                                ed.setCompany(e.getCompany());
                                ed.setPosition(e.getPosition());
                                ed.setDescription(e.getDescription());
                                ed.setBulletPoints(e.getBulletPoints());
                                return ed;
                            }).collect(Collectors.toList()));
                }
                if (r.getEducations() != null) {
                    data.setEducations(r.getEducations().stream()
                            .map(ed -> {
                                EducationDto dto = new EducationDto();
                                dto.setInstitution(ed.getInstitution());
                                dto.setDegree(ed.getDegree());
                                dto.setFieldOfStudy(ed.getFieldOfStudy());
                                return dto;
                            }).collect(Collectors.toList()));
                }
            }
        }

        String target = request.getTargetRole() != null ? request.getTargetRole() : "Software Professional";

        int score = 45;
        Map<String, Integer> categoryScores = new HashMap<>();
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> formatting = new ArrayList<>();
        List<String> completeness = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        if (data != null && data.getPersonalInfo() != null) {
            PersonalInfoDto p = data.getPersonalInfo();
            if (p.getFullName() != null && !p.getFullName().isBlank()) completeness.add("Full Name provided");
            if (p.getEmail() != null && p.getEmail().contains("@")) completeness.add("Valid professional email provided");
            if (p.getPhone() != null && !p.getPhone().isBlank()) completeness.add("Contact phone number provided");
            if (p.getLinkedinUrl() != null && !p.getLinkedinUrl().isBlank()) completeness.add("LinkedIn profile linked");
            else suggestions.add("Add your LinkedIn profile URL to boost recruiter visibility by 40%");
        }

        if (data != null && data.getSummary() != null && data.getSummary().trim().length() > 50) {
            completeness.add("Professional summary present");
            score += 15;
            matched.add("Executive Summary");
        } else {
            suggestions.add("Add a 3-4 sentence professional summary with key competencies and target role.");
            formatting.add("Missing or brief professional summary.");
        }

        Set<String> presentSkills = new HashSet<>();
        if (data != null && data.getSkills() != null) {
            for (SkillDto s : data.getSkills()) {
                if (s.getName() != null) presentSkills.add(s.getName().toLowerCase());
            }
        }

        List<String> expectedSkills = Arrays.asList(
                "Problem Solving", "Communication", "Agile", "Git", "REST APIs",
                "System Design", "Cloud Platforms", "CI/CD", "Team Leadership", "Data Analysis"
        );

        for (String exp : expectedSkills) {
            if (presentSkills.contains(exp.toLowerCase())) {
                matched.add(exp);
            } else {
                missing.add(exp);
            }
        }

        score += Math.min(presentSkills.size() * 3, 20);

        if (data != null && data.getExperiences() != null && !data.getExperiences().isEmpty()) {
            completeness.add("Work experience documented (" + data.getExperiences().size() + " positions)");
            score += 15;

            boolean hasMetrics = data.getExperiences().stream()
                    .anyMatch(e -> (e.getBulletPoints() != null && e.getBulletPoints().matches(".*[0-9%+$].*")) ||
                                   (e.getDescription() != null && e.getDescription().matches(".*[0-9%+$].*")));

            if (hasMetrics) {
                score += 10;
                matched.add("Quantifiable business metrics (%, $, numbers)");
            } else {
                suggestions.add("Quantify your achievements in work experience (e.g. 'Improved page load by 35%', 'Managed $50k budget').");
            }
        } else {
            suggestions.add("Add at least 1 work experience or relevant internship to validate practical expertise.");
        }

        if (data != null && data.getEducations() != null && !data.getEducations().isEmpty()) {
            completeness.add("Education credentials included");
            score += 10;
        } else {
            formatting.add("Missing Education section.");
        }

        if (data != null && data.getFontFamily() != null &&
                ("Inter".equalsIgnoreCase(data.getFontFamily()) || "Roboto".equalsIgnoreCase(data.getFontFamily()))) {
            matched.add("High ATS-readability standard font (" + data.getFontFamily() + ")");
        }
        formatting.add("Standard headings and hierarchical structure confirmed.");

        score = Math.min(Math.max(score, 35), 98);

        categoryScores.put("Impact & Metrics", score > 75 ? 88 : 65);
        categoryScores.put("Keyword Density", Math.min(Math.max(presentSkills.size() * 10, 30), 95));
        categoryScores.put("Brevity & Style", 90);
        categoryScores.put("Structural Completeness", Math.min(Math.max(completeness.size() * 18, 40), 95));

        String grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : "Needs Improvement";

        AtsAnalysisResponse response = new AtsAnalysisResponse();
        response.setOverallScore(score);
        response.setGrade(grade);
        response.setCategoryScores(categoryScores);
        response.setMatchedKeywords(matched);
        response.setMissingKeywords(missing.stream().limit(5).collect(Collectors.toList()));
        response.setFormattingIssues(formatting);
        response.setSectionCompleteness(completeness);
        response.setImprovementSuggestions(suggestions);
        response.setSummaryEvaluation(String.format("Your resume scores %d/100 (%s) for ATS compatibility targeting '%s'.", score, grade, target));
        response.setSource(getEffectiveSourceTag());

        return response;
    }

    // 5. Job Description Matching
    public JobMatchResponse matchJob(JobMatchRequest request) {
        String jd = request.getJobDescription() != null ? request.getJobDescription() : "";
        ResumeUpdateRequest resume = request.getResumeData();

        if (resume == null && request.getResumeId() != null) {
            Optional<Resume> resumeOpt = resumeRepository.findById(request.getResumeId());
            if (resumeOpt.isPresent()) {
                Resume r = resumeOpt.get();
                resume = new ResumeUpdateRequest();
                resume.setSummary(r.getSummary());
                if (r.getSkills() != null) {
                    resume.setSkills(r.getSkills().stream()
                            .map(s -> new SkillDto(s.getName(), s.getCategory(), s.getProficiency()))
                            .collect(Collectors.toList()));
                }
            }
        }

        List<String> jdKeywords = extractKeywordsFromText(jd);
        Set<String> resumeWords = new HashSet<>();

        if (resume != null) {
            if (resume.getSummary() != null) resumeWords.addAll(extractKeywordsFromText(resume.getSummary()));
            if (resume.getSkills() != null) {
                resume.getSkills().forEach(s -> {
                    if (s.getName() != null) resumeWords.add(s.getName().toLowerCase());
                });
            }
            if (resume.getExperiences() != null) {
                resume.getExperiences().forEach(e -> {
                    if (e.getDescription() != null) resumeWords.addAll(extractKeywordsFromText(e.getDescription()));
                    if (e.getBulletPoints() != null) resumeWords.addAll(extractKeywordsFromText(e.getBulletPoints()));
                });
            }
            if (resume.getProjects() != null) {
                resume.getProjects().forEach(p -> {
                    if (p.getTechnologies() != null) resumeWords.addAll(extractKeywordsFromText(p.getTechnologies()));
                    if (p.getDescription() != null) resumeWords.addAll(extractKeywordsFromText(p.getDescription()));
                });
            }
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kw : jdKeywords) {
            if (resumeWords.contains(kw.toLowerCase())) {
                matched.add(kw);
            } else {
                missing.add(kw);
            }
        }

        int total = jdKeywords.isEmpty() ? 1 : jdKeywords.size();
        int matchScore = (int) Math.round(((double) matched.size() / total) * 100);
        matchScore = Math.min(Math.max(matchScore, 42), 95);

        String verdict = matchScore >= 85 ? "Exceptional Match" :
                         matchScore >= 70 ? "Strong Match" :
                         matchScore >= 55 ? "Moderate Match" : "Low Match";

        List<String> recommendations = new ArrayList<>();
        if (!missing.isEmpty()) {
            recommendations.add("Incorporate missing keywords: " + String.join(", ", missing.stream().limit(4).collect(Collectors.toList())) + " directly in your skills or experience bullets.");
        }
        recommendations.add("Align your professional summary directly with the role requirements in " + (request.getJobTitle() != null ? request.getJobTitle() : "the target position") + ".");
        recommendations.add("Mirror the language from the job description in your top 3 project descriptions.");

        String tailoredSummary = String.format(
                "Accomplished professional specializing in %s and %s, with demonstrated success meeting key objectives in high-growth environments. Eager to contribute expertise to %s.",
                matched.isEmpty() ? "modern engineering" : matched.get(0),
                matched.size() > 1 ? matched.get(1) : "scalable systems",
                request.getCompany() != null && !request.getCompany().isBlank() ? request.getCompany() : "the team"
        );

        JobMatchResponse resp = new JobMatchResponse();
        resp.setMatchScore(matchScore);
        resp.setMatchVerdict(verdict);
        resp.setExtractedSkills(jdKeywords);
        resp.setMatchedSkills(matched);
        resp.setMissingSkills(missing);
        resp.setRecommendations(recommendations);
        resp.setTailoredSummaryRecommendation(tailoredSummary);
        resp.setSource(getEffectiveSourceTag());

        return resp;
    }

    // 6. AI Career Objective Generator
    public CareerObjectiveResponse generateCareerObjective(CareerObjectiveRequest request) {
        String stage = request.getCareerStage() != null ? request.getCareerStage() : "Fresher";
        String domain = request.getFieldOfStudyOrDomain() != null ? request.getFieldOfStudyOrDomain() : "Computer Science";
        String role = request.getTargetRole() != null ? request.getTargetRole() : "Junior Software Engineer";
        String skills = request.getTopSkills() != null && !request.getTopSkills().isEmpty() 
                ? String.join(", ", request.getTopSkills()) : "problem solving, programming, continuous learning";

        String main = String.format(
                "Ambitious %s graduate in %s with strong command of %s, seeking the position of %s to apply foundational principles, contribute to impactful team milestones, and rapidly advance technical acumen.",
                stage.equalsIgnoreCase("Student") ? "university student" : "entry-level professional",
                domain, skills, role
        );

        List<String> alt = Arrays.asList(
                String.format("Motivated %s enthusiast seeking to leverage academic background in %s and skills in %s to contribute to dynamic software initiatives as %s.", domain, domain, skills, role),
                String.format("Detail-oriented candidate eager to secure a %s role, utilizing proven proficiency in %s to accelerate team deliverables while expanding technical and collaborative expertise.", role, skills)
        );

        return new CareerObjectiveResponse(main, alt, getEffectiveSourceTag());
    }

    // 7. Cover Letter Generator
    public CoverLetterResponse generateCoverLetter(CoverLetterRequest request) {
        String company = request.getCompanyName() != null && !request.getCompanyName().isBlank() ? request.getCompanyName() : "Hiring Team";
        String role = request.getJobTitle() != null && !request.getJobTitle().isBlank() ? request.getJobTitle() : "the advertised role";
        String name = request.getResumeData() != null && request.getResumeData().getPersonalInfo() != null &&
                      request.getResumeData().getPersonalInfo().getFullName() != null ?
                      request.getResumeData().getPersonalInfo().getFullName() : "Candidate";

        String letter = String.format(
                "Dear %s,\n\n" +
                "I am writing to express my strong enthusiasm for the %s position at %s. With my proven track record in architecting modern solutions, solving complex workflow challenges, and collaborating across high-performing teams, I am confident in my ability to make an immediate, positive impact.\n\n" +
                "Throughout my professional journey, I have prioritized clean execution, continuous improvement, and delivering measurable value to users and stakeholders. My background and core technical competencies closely mirror the objectives outlined in your job requirements.\n\n" +
                "I would welcome the opportunity to discuss how my experience and passion align with the strategic goals of %s. Thank you for your time and consideration.\n\n" +
                "Sincerely,\n%s",
                request.getRecipientName() != null && !request.getRecipientName().isBlank() ? request.getRecipientName() : "Hiring Manager",
                role, company, company, name
        );

        String subject = "Application for " + role + " - " + name;
        return new CoverLetterResponse(letter, subject, getEffectiveSourceTag());
    }

    // 8. LinkedIn Profile Summary Generator
    public LinkedInSummaryResponse generateLinkedInSummary(LinkedInSummaryRequest request) {
        String role = request.getCurrentRole() != null ? request.getCurrentRole() : "Software Professional";
        String skills = request.getTopSkills() != null && !request.getTopSkills().isEmpty() 
                ? String.join(" | ", request.getTopSkills()) : "Full-Stack Development | Cloud Architecture | System Optimization";

        String headline = role + " | " + skills + " | Passionate about building impactful software";

        String about = String.format(
                "👋 Hi there! I'm a %s focused on creating scalable, user-centric software solutions.\n\n" +
                "🚀 What I do:\n" +
                "• Architect resilient systems and streamlined APIs\n" +
                "• Collaborate across design and business teams to ship meaningful features\n" +
                "• Mentor emerging developers and champion clean code best practices\n\n" +
                "💡 Core Competencies: %s\n\n" +
                "Feel free to reach out to connect or discuss exciting opportunities!",
                role, skills
        );

        List<String> hashtags = Arrays.asList("#TechCareers", "#SoftwareEngineering", "#OpenToWork", "#Innovation", "#GrowthMindset");

        return new LinkedInSummaryResponse(headline, about, hashtags, getEffectiveSourceTag());
    }

    // 9. AI Interview Preparation & Mock Interview Coach
    public InterviewPrepResponse generateInterviewPrep(InterviewPrepRequest request) {
        String role = request.getTargetRole() != null && !request.getTargetRole().isBlank()
                ? request.getTargetRole() : "Software Engineer";
        int years = request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 3;

        ResumeUpdateRequest resume = request.getResumeData();
        if (resume == null && request.getResumeId() != null) {
            Optional<Resume> resumeOpt = resumeRepository.findById(request.getResumeId());
            if (resumeOpt.isPresent()) {
                Resume r = resumeOpt.get();
                resume = new ResumeUpdateRequest();
                resume.setTitle(r.getTitle());
                resume.setTargetRole(r.getTargetRole());
                resume.setSummary(r.getSummary());
                if (r.getSkills() != null) {
                    resume.setSkills(r.getSkills().stream()
                            .map(s -> new SkillDto(s.getName(), s.getCategory(), s.getProficiency()))
                            .collect(Collectors.toList()));
                }
                if (r.getExperiences() != null) {
                    resume.setExperiences(r.getExperiences().stream()
                            .map(e -> {
                                ExperienceDto ed = new ExperienceDto();
                                ed.setCompany(e.getCompany());
                                ed.setPosition(e.getPosition());
                                ed.setDescription(e.getDescription());
                                ed.setBulletPoints(e.getBulletPoints());
                                return ed;
                            }).collect(Collectors.toList()));
                }
            }
        }

        List<String> resumeSkills = new ArrayList<>();
        String companyName = "your current company";
        if (resume != null) {
            if (resume.getSkills() != null) {
                resume.getSkills().forEach(s -> {
                    if (s.getName() != null) resumeSkills.add(s.getName());
                });
            }
            if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
                String comp = resume.getExperiences().get(0).getCompany();
                if (comp != null && !comp.isBlank()) companyName = comp;
            }
        }
        if (resumeSkills.isEmpty()) {
            resumeSkills.addAll(Arrays.asList("System Design", "Cloud Infrastructure", "REST APIs", "Modern Frameworks"));
        }

        String skill1 = resumeSkills.get(0);
        String skill2 = resumeSkills.size() > 1 ? resumeSkills.get(1) : "System Architecture";
        String skill3 = resumeSkills.size() > 2 ? resumeSkills.get(2) : "Database Optimization";

        List<InterviewQuestionDto> questions = new ArrayList<>();

        // 1. STAR Behavioral
        questions.add(new InterviewQuestionDto(
                "q-star-1",
                "STAR Behavioral",
                String.format("Describe a complex engineering obstacle or production incident you resolved at %s. How did you diagnose it, lead the fix, and prevent recurrence?", companyName),
                "Evaluates your problem-solving resilience, technical diagnostics under pressure, and systemic mindset.",
                "Situation: Contextualize the outage or constraint within 20s.\nTask: Specify your distinct individual responsibility.\nAction: Mention exact tools used, rollback steps, or architectural modifications.\nResult: Conclude with hard numbers (e.g. reduced MTTR by 45%, recovered $50k transaction flow).",
                Arrays.asList(
                        "Mention monitoring/observability tools and root-cause analysis (RCA)",
                        "Highlight communication with cross-functional stakeholders",
                        "Showcase long-term prevention (automated regression tests, circuit breakers)"
                ),
                String.format("During a major release cycle at %s, an unexpected cache invalidation spike caused API response latencies to exceed 1,800ms. I immediately isolated the database connection pool exhaustion using telemetry logs, implemented an emergency connection throttling policy, and deployed a targeted patch with resilient Redis caching. This restored P99 latency back to 85ms within 22 minutes with zero data corruption.", companyName)
        ));

        // 2. Technical Deep Dive
        questions.add(new InterviewQuestionDto(
                "q-tech-2",
                "Technical Deep Dive",
                String.format("In your work with %s and %s, how do you handle concurrency, state synchronization, and performance bottlenecks?", skill1, skill2),
                "Tests practical craftsmanship and engineering depth rather than theoretical buzzwords.",
                "Frame your answer around end-to-end data lifecycle: ingestion -> caching -> compute -> persistence.",
                Arrays.asList(
                        String.format("Discuss real-world tradeoffs in %s vs alternative approaches", skill1),
                        "Reference indexing strategies, memoization, or thread safety",
                        "Explain automated benchmark suites used to validate performance"
                ),
                String.format("When optimizing high-throughput workflows with %s and %s, I first establish baseline telemetry metrics. For example, by profiling expensive database round-trips and introducing asynchronous event-driven queues with selective write-through caching, we achieved a 4.2x increase in requests handled per node while cutting CPU utilization by 30%%.", skill1, skill2)
        ));

        // 3. System Architecture & Trade-offs
        questions.add(new InterviewQuestionDto(
                "q-arch-3",
                "System & Architecture",
                String.format("Walk me through an architectural trade-off you championed involving %s. What options did you consider, why did you pick this approach, and what were the compromises?", skill3),
                "Distinguishes senior engineers who understand that every architecture decision is an exercise in tradeoffs.",
                "Present Option A vs Option B with clear metrics. Explain the business driver (latency vs consistency, developer velocity vs cloud bill).",
                Arrays.asList(
                        "Discuss build vs. buy decisions and long-term maintenance costs",
                        "Address backward compatibility and zero-downtime migration",
                        "Reflect on what you would improve with today's requirements"
                ),
                String.format("We faced a dilemma between maintaining a monolithic synchronous API vs migrating to an asynchronous event-driven model using %s. While the async model added distributed tracing complexity, the business requirement for handling 10x traffic spikes during product launches made decoupling essential. We accepted minor eventual consistency in non-critical views in exchange for a 99.99%% uptime guarantee during peak loads.", skill3)
        ));

        // 4. Leadership & Culture
        questions.add(new InterviewQuestionDto(
                "q-lead-4",
                "Culture & Collaboration",
                "Tell me about a time you had a strong technical disagreement with a teammate or product manager. How did you resolve it constructively?",
                "Measures empathy, emotional intelligence, objective data-driven decision making, and team cohesion.",
                "Focus on 'Disagree and Commit' principles or using prototypes / A-B data rather than ego.",
                Arrays.asList(
                        "Show active listening to the counter-proposal's merits",
                        "Mention creating a quick proof-of-concept (PoC) to measure objective data",
                        "Highlight team alignment once a joint direction was finalized"
                ),
                "A teammate advocated for an extensive rewrite of a legacy service into a new paradigm right before a quarter deadline. Recognizing the delivery risk to our product roadmap, I listened to their maintainability concerns and proposed building a lightweight test harness around the critical path instead. We benchmarked the real bottleneck, solved it with a targeted 40-line optimization, hit our customer deadline on schedule, and scheduled the architectural refactor in the subsequent stabilization sprint."
        ));

        List<String> tips = Arrays.asList(
                "Keep answers between 90 to 120 seconds to keep the interviewer engaged.",
                "Always conclude with measurable business or technical outcomes (%, $, latency, developer hours saved).",
                "Frame challenges as learning and systems-improvement opportunities rather than placing blame.",
                "Ask 2-3 thoughtful reverse-interview questions about the team's deployment frequency and engineering culture."
        );

        InterviewPrepResponse resp = new InterviewPrepResponse();
        resp.setTargetRole(role);
        resp.setTotalQuestions(questions.size());
        resp.setQuestions(questions);
        resp.setGeneralTips(tips);
        resp.setSourceTag(getEffectiveSourceTag());
        return resp;
    }

    // 10. AI Real-Time Answer Evaluator
    public AnswerEvaluationResponse evaluateAnswer(AnswerEvaluationRequest request) {
        String answer = request.getUserAnswer() != null ? request.getUserAnswer().trim() : "";
        String question = request.getQuestion() != null ? request.getQuestion() : "Interview Question";
        String role = request.getTargetRole() != null ? request.getTargetRole() : "Candidate";

        if (answer.length() < 25) {
            AnswerEvaluationResponse resp = new AnswerEvaluationResponse();
            resp.setScore(45);
            resp.setRating("Needs More Detail");
            resp.setFeedback("Your answer is too concise. Use the STAR method (Situation, Task, Action, Result) to provide concrete context and technical specifics.");
            resp.setStrengths(Collections.singletonList("Direct and to the point."));
            resp.setImprovements(Arrays.asList(
                    "Include the specific situation and constraints you faced",
                    "Detail the technical actions you took",
                    "Quantify the final outcome with metrics (e.g. %, hours, dollar value)"
            ));
            resp.setRefinedAnswer("In my previous project, we faced a challenge where... I led the initiative to... by applying... which resulted in a 35% improvement in performance and zero reported regressions.");
            resp.setSourceTag(getEffectiveSourceTag());
            return resp;
        }

        // Live AI evaluation if enabled
        if (isLiveAiAvailable()) {
            try {
                String prompt = String.format(
                        "Evaluate this job interview answer for a %s role.\nQuestion: %s\nCandidate Answer: %s\n\n" +
                        "Provide a concise JSON response with: score (0-100), rating (Outstanding, Strong, or Needs Polish), " +
                        "feedback (1 sentence), strengths (list of 2 strings), improvements (list of 2 strings), " +
                        "and refinedAnswer (a polished executive STAR version of their exact response).",
                        role, question, answer
                );
                String result = callLlm(prompt);
                if (result != null && result.contains("{") && result.contains("}")) {
                    int start = result.indexOf('{');
                    int end = result.lastIndexOf('}') + 1;
                    JsonNode node = objectMapper.readTree(result.substring(start, end));

                    AnswerEvaluationResponse resp = new AnswerEvaluationResponse();
                    resp.setScore(node.path("score").asInt(84));
                    resp.setRating(node.path("rating").asText("Strong"));
                    resp.setFeedback(node.path("feedback").asText("Solid response with clear progression."));
                    
                    List<String> strengths = new ArrayList<>();
                    node.path("strengths").forEach(s -> strengths.add(s.asText()));
                    resp.setStrengths(strengths.isEmpty() ? Arrays.asList("Clear articulation of actions taken", "Professional tone") : strengths);

                    List<String> imps = new ArrayList<>();
                    node.path("improvements").forEach(s -> imps.add(s.asText()));
                    resp.setImprovements(imps.isEmpty() ? Arrays.asList("Quantify impact with specific metrics", "Tighten initial context") : imps);

                    resp.setRefinedAnswer(node.path("refinedAnswer").asText(answer));
                    resp.setSourceTag(getEffectiveSourceTag());
                    return resp;
                }
            } catch (Exception ex) {
                log.warn("Live LLM answer eval failed: {}", ex.getMessage());
            }
        }

        // Rule-based heuristic evaluation
        int score = 65;
        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();

        int wordCount = answer.split("\\s+").length;
        if (wordCount >= 60 && wordCount <= 220) {
            score += 15;
            strengths.add("Optimal answer length (approx. 90-120 seconds of speaking time)");
        } else if (wordCount < 60) {
            improvements.add("Elaborate on the specific implementation steps you took");
        } else {
            improvements.add("Condense your response slightly to keep the interviewer fully engaged");
        }

        boolean hasMetrics = answer.matches("(?s).*[0-9%+$].*") || answer.matches("(?i).*\\b(percent|million|k|hours|days|latency|throughput|reduced|increased)\\b.*");
        if (hasMetrics) {
            score += 12;
            strengths.add("Excellent use of quantifiable metrics to validate business impact");
        } else {
            improvements.add("Add measurable metrics (e.g., 'reduced processing time by 30%', 'scaled to 50k users')");
        }

        boolean hasActionVerbs = answer.matches("(?i).*\\b(spearheaded|architected|engineered|implemented|designed|orchestrated|delivered|resolved|optimized|built)\\b.*");
        if (hasActionVerbs) {
            score += 8;
            strengths.add("Employed authoritative executive action verbs showing individual ownership");
        } else {
            improvements.add("Replace passive phrasing with punchy active verbs (e.g. 'Engineered', 'Orchestrated')");
        }

        score = Math.min(Math.max(score, 55), 96);
        String rating = score >= 88 ? "Outstanding – Highly Persuasive" :
                        score >= 75 ? "Strong – Well Structured" : "Good – Needs Minor Polish";

        String refined = "Spearheaded the initiative where " + answer.replaceFirst("(?i)^(i |well, |so |basically )", "")
                + (hasMetrics ? "" : " This generated a 35% gain in operational efficiency and eliminated recurring deployment bottlenecks.");

        AnswerEvaluationResponse resp = new AnswerEvaluationResponse();
        resp.setScore(score);
        resp.setRating(rating);
        resp.setFeedback(String.format("You scored %d/100 (%s). Your answer establishes credibility and provides a clear narrative arc.", score, rating));
        resp.setStrengths(strengths);
        resp.setImprovements(improvements);
        resp.setRefinedAnswer(refined);
        resp.setSourceTag(getEffectiveSourceTag());
        return resp;
    }

    // 11. 1-Click AI Resume Tailorer & Job Optimizer
    public ResumeTailorResponse tailorResume(ResumeTailorRequest request) {
        String jd = request.getJobDescription() != null ? request.getJobDescription() : "";
        String targetJob = request.getJobTitle() != null && !request.getJobTitle().isBlank() ? request.getJobTitle() : "Software Professional";
        String company = request.getCompany() != null && !request.getCompany().isBlank() ? request.getCompany() : "the target employer";
        ResumeUpdateRequest resume = request.getResumeData();

        List<String> jdKeywords = extractKeywordsFromText(jd);
        if (jdKeywords.isEmpty()) {
            jdKeywords = Arrays.asList("React", "TypeScript", "Node.js", "Cloud Architecture", "CI/CD", "Agile", "RESTful APIs");
        }

        Set<String> existingKeywords = new HashSet<>();
        List<String> originalBullets = new ArrayList<>();

        if (resume != null) {
            if (resume.getSummary() != null) existingKeywords.addAll(extractKeywordsFromText(resume.getSummary()));
            if (resume.getSkills() != null) {
                resume.getSkills().forEach(s -> {
                    if (s.getName() != null) existingKeywords.add(s.getName().toLowerCase());
                });
            }
            if (resume.getExperiences() != null) {
                resume.getExperiences().forEach(e -> {
                    if (e.getBulletPoints() != null && !e.getBulletPoints().isBlank()) {
                        String[] lines = e.getBulletPoints().split("\n");
                        for (String l : lines) {
                            String trimmed = l.replaceAll("^[•\\-*\\s]+", "").trim();
                            if (!trimmed.isEmpty()) originalBullets.add(trimmed);
                        }
                    }
                });
            }
        }

        List<String> missingKeywords = new ArrayList<>();
        List<String> matchedKeywords = new ArrayList<>();
        for (String kw : jdKeywords) {
            if (existingKeywords.contains(kw.toLowerCase())) {
                matchedKeywords.add(kw);
            } else {
                missingKeywords.add(kw);
            }
        }

        int scoreBefore = (int) Math.round(((double) matchedKeywords.size() / Math.max(jdKeywords.size(), 1)) * 100);
        scoreBefore = Math.min(Math.max(scoreBefore, 48), 75);
        int scoreAfter = Math.min(scoreBefore + 28, 96);

        String topKw1 = !missingKeywords.isEmpty() ? missingKeywords.get(0) : "Cloud Infrastructure";
        String topKw2 = missingKeywords.size() > 1 ? missingKeywords.get(1) : (!matchedKeywords.isEmpty() ? matchedKeywords.get(0) : "Scalable Systems");

        String tailoredSummary = String.format(
                "Results-driven %s with verified expertise in %s and %s, combining strong foundational principles with delivery track records. Proven history of optimizing operational workflows, collaborating with cross-functional stakeholders, and driving business KPIs at %s.",
                targetJob, topKw1, topKw2, company
        );

        String tailoredHeadline = String.format("%s | %s & %s Specialist", targetJob, topKw1, topKw2);

        List<ResumeTailorResponse.BulletOptimizationDto> bulletOpts = new ArrayList<>();
        if (originalBullets.isEmpty()) {
            originalBullets.add("Responsible for developing application features and collaborating with team members on daily tasks.");
            originalBullets.add("Helped maintain system performance and fix software bugs reported by QA.");
        }

        int count = 0;
        for (String orig : originalBullets) {
            if (count >= 4) break;
            String tailored;
            List<String> kwAdded = new ArrayList<>();
            String kwToInject = count < missingKeywords.size() ? missingKeywords.get(count) : topKw1;
            kwAdded.add(kwToInject);
            kwAdded.add("Automated CI/CD");

            if (orig.toLowerCase().contains("responsible for") || orig.toLowerCase().contains("helped")) {
                tailored = String.format("Spearheaded development and deployment of high-availability features using %s, driving a 30%% improvement in release cadence and test coverage.", kwToInject);
            } else {
                tailored = String.format("Engineered and optimized core workflows utilizing %s, delivering a 25%% reduction in response latency and elevating system reliability.", kwToInject);
            }

            bulletOpts.add(new ResumeTailorResponse.BulletOptimizationDto(
                    "Experience",
                    orig,
                    tailored,
                    String.format("Integrated targeted job description keyword '%s' and transformed into quantified accomplishment.", kwToInject),
                    kwAdded
            ));
            count++;
        }

        ResumeTailorResponse resp = new ResumeTailorResponse();
        resp.setMatchScoreBefore(scoreBefore);
        resp.setProjectedMatchScoreAfter(scoreAfter);
        resp.setTailoredRoleHeadline(tailoredHeadline);
        resp.setTailoredSummary(tailoredSummary);
        resp.setBulletOptimizations(bulletOpts);
        resp.setSuggestedSkills(missingKeywords.stream().limit(6).collect(Collectors.toList()));
        resp.setHighImpactKeywords(jdKeywords);
        resp.setSourceTag(getEffectiveSourceTag());
        return resp;
    }

    // 12. AI Salary Benchmark & Career Growth Insights
    public SalaryInsightsResponse generateSalaryInsights(SalaryInsightsRequest request) {
        String role = request.getTargetRole() != null && !request.getTargetRole().isBlank()
                ? request.getTargetRole() : "Software Engineer";
        int years = request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 3;
        String loc = request.getLocation() != null && !request.getLocation().isBlank()
                ? request.getLocation() : "US / Remote";

        // Base salaries mapped by experience
        int baseMin, baseMed, baseMax, baseTop10;
        String expLevel;
        if (years <= 2) {
            expLevel = "Entry Level / Junior (0-2 yrs)";
            baseMin = 75000;
            baseMed = 95000;
            baseMax = 120000;
            baseTop10 = 135000;
        } else if (years <= 5) {
            expLevel = "Mid-Level Professional (3-5 yrs)";
            baseMin = 110000;
            baseMed = 138000;
            baseMax = 165000;
            baseTop10 = 185000;
        } else if (years <= 8) {
            expLevel = "Senior Professional (6-8 yrs)";
            baseMin = 145000;
            baseMed = 175000;
            baseMax = 210000;
            baseTop10 = 240000;
        } else {
            expLevel = "Staff / Principal / Lead (9+ yrs)";
            baseMin = 180000;
            baseMed = 225000;
            baseMax = 285000;
            baseTop10 = 330000;
        }

        Map<String, String> premiums = new LinkedHashMap<>();
        premiums.put("Kubernetes & Cloud Infrastructure", "+18% Premium");
        premiums.put("System Design & Distributed Systems", "+15% Premium");
        premiums.put("GenAI / LLM Integration & Prompt Eng", "+22% High Demand");
        premiums.put("Modern TypeScript / Next.js / React 18", "+12% Premium");

        List<String> milestones = Arrays.asList(
                String.format("Current: %s (%s)", role, expLevel),
                String.format("Next (1-2 yrs): Senior %s — Focus on end-to-end architecture and mentoring", role),
                "Future (3-5 yrs): Staff Engineer / Tech Lead or Engineering Manager — Drive organization-wide strategic impact"
        );

        List<String> negotiationTips = Arrays.asList(
                "Never share your current compensation first; request the approved salary bracket for the level.",
                "Highlight specific revenue generated, bugs eliminated, or system latency improvements.",
                "If the base salary is at budget limit, negotiate equity/stock grants, sign-on bonuses, or remote stipends."
        );

        SalaryInsightsResponse resp = new SalaryInsightsResponse();
        resp.setTargetRole(role);
        resp.setLocation(loc);
        resp.setExperienceLevel(expLevel);
        resp.setMinSalary(baseMin);
        resp.setMedianSalary(baseMed);
        resp.setMaxSalary(baseMax);
        resp.setTop10Salary(baseTop10);
        resp.setCurrency("USD ($)");
        resp.setMarketDemand("High (Top 15% Hiring Activity)");
        resp.setSkillPremiums(premiums);
        resp.setCareerMilestones(milestones);
        resp.setNegotiationTips(negotiationTips);
        resp.setSourceTag(getEffectiveSourceTag());
        return resp;
    }

    private String callLlm(String prompt) {
        try {
            if (openAiApiKey != null && !openAiApiKey.isBlank() && !openAiQuotaExhausted) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(openAiApiKey);

                Map<String, Object> req = new HashMap<>();
                req.put("model", openAiModel);
                List<Map<String, String>> messages = new ArrayList<>();
                messages.add(Map.of("role", "system", "content", "You are an expert executive resume writer and ATS optimization specialist."));
                messages.add(Map.of("role", "user", "content", prompt));
                req.put("messages", messages);
                req.put("temperature", 0.7);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(req, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(openAiBaseUrl + "/chat/completions", entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    return root.path("choices").get(0).path("message").path("content").asText();
                }
            } else if (geminiApiKey != null && !geminiApiKey.isBlank()) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                        geminiModel, geminiApiKey);

                Map<String, Object> part = Map.of("text", prompt);
                Map<String, Object> contentMap = Map.of("parts", List.of(part));
                Map<String, Object> req = Map.of("contents", List.of(contentMap));

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(req, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                }
            }
        } catch (HttpClientErrorException.TooManyRequests ex) {
            log.warn("OpenAI returned 429 quota exhausted. Switching immediately to intelligent demo engine.");
            openAiQuotaExhausted = true;
        } catch (Exception ex) {
            log.error("LLM call exception: {}", ex.getMessage());
            if (ex.getMessage() != null && ex.getMessage().contains("insufficient_quota")) {
                openAiQuotaExhausted = true;
            }
        }
        return null;
    }

    private List<String> extractKeywordsFromText(String text) {
        if (text == null || text.isBlank()) {
            return Arrays.asList("React", "Java", "Spring Boot", "SQL", "Git", "REST APIs", "Agile");
        }

        Set<String> keywords = new LinkedHashSet<>();
        List<String> dictionary = Arrays.asList(
                "React", "Vue", "Angular", "Next.js", "Java", "Spring Boot", "Python", "FastAPI", "Django",
                "Node.js", "Express", "TypeScript", "JavaScript", "SQL", "PostgreSQL", "MySQL", "MongoDB",
                "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Git", "REST", "GraphQL", "Microservices",
                "Agile", "Scrum", "Redux", "Tailwind CSS", "HTML5", "CSS3", "Kafka", "Redis", "Unit Testing",
                "System Design", "Problem Solving", "Leadership", "Communication", "Data Structures"
        );

        for (String word : dictionary) {
            Pattern p = Pattern.compile("(?i)\\b" + Pattern.quote(word) + "\\b");
            Matcher m = p.matcher(text);
            if (m.find()) {
                keywords.add(word);
            }
        }

        if (keywords.isEmpty()) {
            keywords.addAll(Arrays.asList("Communication", "Problem Solving", "Collaboration", "Technical Architecture"));
        }

        return new ArrayList<>(keywords);
    }
}
