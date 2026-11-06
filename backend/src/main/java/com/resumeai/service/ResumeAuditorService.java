package com.resumeai.service;

import com.resumeai.dto.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeAuditorService {

    private static final String[] BUZZWORDS = {
            "hard worker", "team player", "go-getter", "results-driven", "detail-oriented",
            "self-starter", "synergy", "think outside the box", "dynamic", "motivated",
            "passionate", "responsible for", "duties included", "worked on", "helped with",
            "assisted in", "strategic thinker", "fast learner", "people person"
    };

    private static final String[] STRONG_ACTION_VERBS = {
            "Spearheaded", "Architected", "Engineered", "Orchestrated", "Accelerated",
            "Automated", "Pioneered", "Optimized", "Scaled", "Streamlined",
            "Delivered", "Transformed", "Formulated", "Championed", "Negotiated"
    };

    private static final Pattern METRICS_PATTERN = Pattern.compile(
            "(\\d+[%kKmM]?|\\$\\d+[kKmM]?|\\b\\d+\\+?\\s*(?:users|clients|customers|projects|leads|percent|hours|dollars|teams|engineers|stores)\\b)",
            Pattern.CASE_INSENSITIVE
    );

    public ResumeUploadAnalysisResponse auditResume(String rawText, ResumeUpdateRequest parsedResume, String fileName, String fileType) {
        ResumeUploadAnalysisResponse response = new ResumeUploadAnalysisResponse();
        response.setFileName(fileName);
        response.setFileType(fileType);
        response.setExtractedText(rawText);
        response.setParsedResume(parsedResume);

        int charCount = rawText.length();
        int wordCount = rawText.trim().isEmpty() ? 0 : rawText.trim().split("\\s+").length;
        int estimatedPages = Math.max(1, (int) Math.ceil(wordCount / 450.0));

        response.setCharacterCount(charCount);
        response.setWordCount(wordCount);
        response.setEstimatedPageCount(estimatedPages);

        int score = 100;
        List<ResumeAuditIssueDto> issues = new ArrayList<>();
        List<ResumeImprovementSuggestionDto> improvements = new ArrayList<>();
        Map<String, Integer> sectionScores = new HashMap<>();

        // 1. Contact & Header Audit
        int contactScore = 100;
        PersonalInfoDto info = parsedResume.getPersonalInfo();
        if (info == null || info.getFullName() == null || info.getFullName().trim().isEmpty()) {
            contactScore -= 30;
            score -= 15;
            issues.add(new ResumeAuditIssueDto(
                    "C-01", "ATS_READABILITY", "CRITICAL",
                    "Missing or Unparseable Full Name",
                    "Applicant Tracking Systems failed to locate a distinct candidate name at the top of your resume.",
                    null,
                    "Place your full name as the very first line in large, distinct typography (18-24pt)."
            ));
        }

        if (info == null || info.getEmail() == null || info.getEmail().trim().isEmpty()) {
            contactScore -= 40;
            score -= 15;
            issues.add(new ResumeAuditIssueDto(
                    "C-02", "ATS_READABILITY", "CRITICAL",
                    "Missing Email Address",
                    "No valid email address was detected. ATS parsers discard candidates without verifiable contact info.",
                    null,
                    "Provide a professional email address (e.g. firstname.lastname@gmail.com) directly below your name."
            ));
        }

        if (info == null || info.getPhone() == null || info.getPhone().trim().isEmpty()) {
            contactScore -= 20;
            score -= 10;
            issues.add(new ResumeAuditIssueDto(
                    "C-03", "ATS_READABILITY", "WARNING",
                    "Missing Contact Phone Number",
                    "Recruiters frequently perform quick phone screenings before interview invites.",
                    null,
                    "Add an active mobile phone number with international country code if applicable."
            ));
        }

        if (info == null || info.getLinkedinUrl() == null || info.getLinkedinUrl().trim().isEmpty()) {
            contactScore -= 10;
            score -= 5;
            issues.add(new ResumeAuditIssueDto(
                    "C-04", "ATS_READABILITY", "INFO",
                    "No LinkedIn Profile Link Found",
                    "Over 85% of technical and corporate recruiters check LinkedIn to cross-reference recommendations and career milestones.",
                    null,
                    "Add a customized LinkedIn URL (e.g. linkedin.com/in/yourname)."
            ));
        }
        sectionScores.put("Contact Information", Math.max(0, contactScore));

        // 2. Summary Audit
        int summaryScore = 100;
        String summary = parsedResume.getSummary();
        if (summary == null || summary.trim().length() < 30) {
            summaryScore -= 40;
            score -= 10;
            issues.add(new ResumeAuditIssueDto(
                    "S-01", "SECTION_STRUCTURE", "WARNING",
                    "Missing or Too Brief Professional Summary",
                    "Your resume lacks a concise 2-3 sentence elevator pitch highlighting your core value proposition and key domains.",
                    summary,
                    "Write a 3-sentence summary highlighting your years of experience, core technical specialties, and biggest career win."
            ));
            improvements.add(new ResumeImprovementSuggestionDto(
                    "Summary",
                    summary != null && !summary.isEmpty() ? summary : "(Empty summary)",
                    (info != null && info.getJobTitle() != null ? info.getJobTitle() : "Results-driven Professional") +
                            " with strong expertise in architecting scalable solutions, cross-functional collaboration, and continuous delivery. Proven track record of improving operational efficiency by 30% and leading high-impact initiatives.",
                    "Provides an immediate, high-impact hook for hiring managers within the first 6 seconds of scanning."
            ));
        } else {
            String lowerSummary = summary.toLowerCase();
            for (String bw : BUZZWORDS) {
                if (lowerSummary.contains(bw)) {
                    summaryScore -= 10;
                    score -= 3;
                    issues.add(new ResumeAuditIssueDto(
                            "S-02", "CLICHE_BUZZWORDS", "WARNING",
                            "Overused Cliché in Summary: \"" + bw + "\"",
                            "Vague claims like \"" + bw + "\" offer no proof of capability and weaken your professional authority.",
                            findSnippet(summary, bw),
                            "Replace subjective claims with tangible credentials and measurable outcomes."
                    ));
                    break;
                }
            }
        }
        sectionScores.put("Professional Summary", Math.max(0, summaryScore));

        // 3. Experience & Bullet Points Audit
        int expScore = 100;
        List<ExperienceDto> experiences = parsedResume.getExperiences();
        if (experiences == null || experiences.isEmpty()) {
            expScore -= 50;
            score -= 25;
            issues.add(new ResumeAuditIssueDto(
                    "E-01", "SECTION_STRUCTURE", "CRITICAL",
                    "Missing Work Experience Section",
                    "No structured work experience or employment history section was detected.",
                    null,
                    "Add detailed employment entries with Job Title, Company, Date Range, and 3-5 achievement bullets."
            ));
        } else {
            int totalBullets = 0;
            int metricBullets = 0;
            List<String> metricsFoundList = new ArrayList<>();
            List<String> weakPhrasesFound = new ArrayList<>();

            for (ExperienceDto exp : experiences) {
                String bullets = exp.getBulletPoints() != null ? exp.getBulletPoints() : exp.getDescription();
                if (bullets == null || bullets.trim().isEmpty()) {
                    expScore -= 15;
                    continue;
                }

                String[] lines = bullets.split("\\r?\\n");
                for (String line : lines) {
                    String clean = line.trim();
                    if (clean.isEmpty()) continue;
                    totalBullets++;

                    Matcher m = METRICS_PATTERN.matcher(clean);
                    if (m.find()) {
                        metricBullets++;
                        metricsFoundList.add(m.group());
                    }

                    String lower = clean.toLowerCase();
                    if (lower.startsWith("• responsible for") || lower.startsWith("- responsible for") || lower.startsWith("responsible for")
                            || lower.startsWith("• duties included") || lower.startsWith("worked on") || lower.startsWith("helped with")) {
                        weakPhrasesFound.add(clean);
                    }
                }
            }

            response.setMetricsFound(metricsFoundList);

            if (totalBullets > 0 && metricBullets == 0) {
                expScore -= 25;
                score -= 15;
                issues.add(new ResumeAuditIssueDto(
                        "E-02", "MISSING_METRICS", "CRITICAL",
                        "Zero Measurable Outcomes or KPIs Detected",
                        "None of your work experience bullets contain numbers, percentages, dollar figures, or quantifiable metrics. Resumes with numbers receive 40% more interview requests.",
                        null,
                        "Apply the Google 'XYZ Formula': Accomplished [X] as measured by [Y], by doing [Z]. Example: 'Optimized API response time by 42% by introducing Redis caching'."
                ));
            } else if (totalBullets > 0 && ((double) metricBullets / totalBullets) < 0.4) {
                expScore -= 10;
                score -= 5;
                issues.add(new ResumeAuditIssueDto(
                        "E-03", "MISSING_METRICS", "WARNING",
                        "Low Density of Quantifiable Achievements (" + metricBullets + "/" + totalBullets + " bullets)",
                        "Only " + metricBullets + " of your " + totalBullets + " bullet points include verifiable metrics.",
                        null,
                        "Include metrics such as team size, budget, volume, latency reduction, customer satisfaction, or percentage growth in at least 50% of bullets."
                ));
            }

            if (!weakPhrasesFound.isEmpty()) {
                expScore -= 15;
                score -= 8;
                String firstWeak = weakPhrasesFound.get(0);
                issues.add(new ResumeAuditIssueDto(
                        "E-04", "WEAK_LANGUAGE", "WARNING",
                        "Passive Responsibility Descriptions",
                        "Using passive phrases like 'Responsible for' or 'Helped with' describes job duties instead of your personal impact.",
                        firstWeak,
                        "Start every bullet with an aggressive action verb: Led, Engineered, Spearheaded, Accelerated, Automated."
                ));

                improvements.add(new ResumeImprovementSuggestionDto(
                        "Work Experience Bullet",
                        firstWeak,
                        "Spearheaded end-to-end delivery of core modules, collaborating across 4 teams and improving system throughput by 28%.",
                        "Replaces passive duty description with assertive leadership verb and quantifiable business outcome."
                ));
            }
        }
        sectionScores.put("Work Experience", Math.max(0, expScore));

        // 4. Skills Section Audit
        int skillsScore = 100;
        List<SkillDto> skills = parsedResume.getSkills();
        if (skills == null || skills.isEmpty()) {
            skillsScore -= 40;
            score -= 15;
            issues.add(new ResumeAuditIssueDto(
                    "SK-01", "SECTION_STRUCTURE", "CRITICAL",
                    "Missing Skills Section",
                    "ATS scanners search for specific technical and domain keywords. Missing a dedicated skills section severely degrades automated ranking.",
                    null,
                    "Create a structured Skills section categorizing Technical Skills, Frameworks, Tools, and Methodologies."
            ));
        } else if (skills.size() < 5) {
            skillsScore -= 20;
            score -= 5;
            issues.add(new ResumeAuditIssueDto(
                    "SK-02", "ATS_READABILITY", "WARNING",
                    "Sparse Skills Profile (" + skills.size() + " skills detected)",
                    "Your resume lists very few keywords. Target at least 8-15 industry-standard skills relevant to your target role.",
                    null,
                    "Add relevant frameworks, cloud platforms, libraries, testing tools, and domain proficiencies."
            ));
        }
        sectionScores.put("Skills & Keywords", Math.max(0, skillsScore));

        // 5. Cliché Buzzwords across full text
        String lowerAll = rawText.toLowerCase();
        List<String> buzzwordsDetected = new ArrayList<>();
        for (String bw : BUZZWORDS) {
            if (lowerAll.contains(bw)) {
                buzzwordsDetected.add(bw);
            }
        }
        response.setBuzzwordsFound(buzzwordsDetected);
        if (buzzwordsDetected.size() >= 3) {
            score -= 6;
            issues.add(new ResumeAuditIssueDto(
                    "CL-01", "CLICHE_BUZZWORDS", "WARNING",
                    "High Frequency of Generic Resume Clichés (" + buzzwordsDetected.size() + " found)",
                    "Detected clichés: " + String.join(", ", buzzwordsDetected.subList(0, Math.min(5, buzzwordsDetected.size()))),
                    null,
                    "Replace clichés with concrete evidence of achievements (e.g. replace 'team player' with 'partnered with 6 product managers across 3 time zones')."
            ));
        }

        // 6. Action Verbs detection
        List<String> actionsFound = new ArrayList<>();
        for (String verb : STRONG_ACTION_VERBS) {
            if (rawText.contains(verb) || lowerAll.contains(verb.toLowerCase())) {
                actionsFound.add(verb);
            }
        }
        response.setActionVerbsFound(actionsFound);

        // Clamp final score
        score = Math.max(25, Math.min(100, score));
        response.setAuditScore(score);

        // Determine grade & summary
        if (score >= 88) {
            response.setAuditGrade("Outstanding / ATS-Ready");
            response.setSummaryAssessment("Excellent resume structure! High keyword density, strong action verbs, and clear sections ensure top-tier ATS compliance.");
        } else if (score >= 72) {
            response.setAuditGrade("Good / Minor Polishing Needed");
            response.setSummaryAssessment("Solid foundation with great potential. Address the identified weak verbs and missing quantifiable metrics to maximize recruiter callbacks.");
        } else if (score >= 55) {
            response.setAuditGrade("Needs Improvement / ATS Parser Risks");
            response.setSummaryAssessment("Contains several ATS red flags such as missing contact elements, passive language, or unquantified achievements. Use ResumeAI's 1-click import to fix these automatically.");
        } else {
            response.setAuditGrade("Critical Issues / High Rejection Risk");
            response.setSummaryAssessment("Significant formatting and structural issues detected that may cause automated ATS rejection. We recommend importing your content into a clean ResumeAI template.");
        }

        response.setDetectedIssues(issues);
        response.setSuggestedImprovements(improvements);
        response.setSectionScores(sectionScores);

        return response;
    }

    private String findSnippet(String text, String phrase) {
        int idx = text.toLowerCase().indexOf(phrase.toLowerCase());
        if (idx == -1) return null;
        int start = Math.max(0, idx - 30);
        int end = Math.min(text.length(), idx + phrase.length() + 30);
        return "..." + text.substring(start, end).replace("\n", " ").trim() + "...";
    }
}
