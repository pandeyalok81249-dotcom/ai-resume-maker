package com.resumeai.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResumeUploadAnalysisResponse {
    private String fileName;
    private String fileType;
    private String extractedText;
    private int characterCount;
    private int wordCount;
    private int estimatedPageCount;

    private int auditScore; // 0 - 100
    private String auditGrade; // Critical Issues, Needs Improvement, Good, Strong, Outstanding
    private String summaryAssessment;

    private List<ResumeAuditIssueDto> detectedIssues = new ArrayList<>();
    private List<ResumeImprovementSuggestionDto> suggestedImprovements = new ArrayList<>();
    private List<String> buzzwordsFound = new ArrayList<>();
    private List<String> actionVerbsFound = new ArrayList<>();
    private List<String> metricsFound = new ArrayList<>();
    private Map<String, Integer> sectionScores = new HashMap<>();

    private ResumeUpdateRequest parsedResume;

    public ResumeUploadAnalysisResponse() {}

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public int getCharacterCount() { return characterCount; }
    public void setCharacterCount(int characterCount) { this.characterCount = characterCount; }

    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }

    public int getEstimatedPageCount() { return estimatedPageCount; }
    public void setEstimatedPageCount(int estimatedPageCount) { this.estimatedPageCount = estimatedPageCount; }

    public int getAuditScore() { return auditScore; }
    public void setAuditScore(int auditScore) { this.auditScore = auditScore; }

    public String getAuditGrade() { return auditGrade; }
    public void setAuditGrade(String auditGrade) { this.auditGrade = auditGrade; }

    public String getSummaryAssessment() { return summaryAssessment; }
    public void setSummaryAssessment(String summaryAssessment) { this.summaryAssessment = summaryAssessment; }

    public List<ResumeAuditIssueDto> getDetectedIssues() { return detectedIssues; }
    public void setDetectedIssues(List<ResumeAuditIssueDto> detectedIssues) { this.detectedIssues = detectedIssues; }

    public List<ResumeImprovementSuggestionDto> getSuggestedImprovements() { return suggestedImprovements; }
    public void setSuggestedImprovements(List<ResumeImprovementSuggestionDto> suggestedImprovements) { this.suggestedImprovements = suggestedImprovements; }

    public List<String> getBuzzwordsFound() { return buzzwordsFound; }
    public void setBuzzwordsFound(List<String> buzzwordsFound) { this.buzzwordsFound = buzzwordsFound; }

    public List<String> getActionVerbsFound() { return actionVerbsFound; }
    public void setActionVerbsFound(List<String> actionVerbsFound) { this.actionVerbsFound = actionVerbsFound; }

    public List<String> getMetricsFound() { return metricsFound; }
    public void setMetricsFound(List<String> metricsFound) { this.metricsFound = metricsFound; }

    public Map<String, Integer> getSectionScores() { return sectionScores; }
    public void setSectionScores(Map<String, Integer> sectionScores) { this.sectionScores = sectionScores; }

    public ResumeUpdateRequest getParsedResume() { return parsedResume; }
    public void setParsedResume(ResumeUpdateRequest parsedResume) { this.parsedResume = parsedResume; }
}

