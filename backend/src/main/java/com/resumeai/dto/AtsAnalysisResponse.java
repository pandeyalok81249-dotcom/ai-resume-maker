package com.resumeai.dto;

import java.util.List;
import java.util.Map;

public class AtsAnalysisResponse {
    private Integer overallScore; // 0 - 100
    private String grade; // "A+", "A", "B", "C", "Needs Improvement"
    private Map<String, Integer> categoryScores; // "Impact", "Brevity", "Style", "Keywords", "Structure"
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> formattingIssues;
    private List<String> sectionCompleteness;
    private List<String> improvementSuggestions;
    private String summaryEvaluation;
    private String source;

    public AtsAnalysisResponse() {}

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Map<String, Integer> getCategoryScores() {
        return categoryScores;
    }

    public void setCategoryScores(Map<String, Integer> categoryScores) {
        this.categoryScores = categoryScores;
    }

    public List<String> getMatchedKeywords() {
        return matchedKeywords;
    }

    public void setMatchedKeywords(List<String> matchedKeywords) {
        this.matchedKeywords = matchedKeywords;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public List<String> getFormattingIssues() {
        return formattingIssues;
    }

    public void setFormattingIssues(List<String> formattingIssues) {
        this.formattingIssues = formattingIssues;
    }

    public List<String> getSectionCompleteness() {
        return sectionCompleteness;
    }

    public void setSectionCompleteness(List<String> sectionCompleteness) {
        this.sectionCompleteness = sectionCompleteness;
    }

    public List<String> getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public void setImprovementSuggestions(List<String> improvementSuggestions) {
        this.improvementSuggestions = improvementSuggestions;
    }

    public String getSummaryEvaluation() {
        return summaryEvaluation;
    }

    public void setSummaryEvaluation(String summaryEvaluation) {
        this.summaryEvaluation = summaryEvaluation;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

