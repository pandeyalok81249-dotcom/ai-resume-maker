package com.resumeai.dto;

import java.util.List;

public class JobMatchResponse {
    private Integer matchScore; // 0 - 100
    private String matchVerdict; // "Exceptional Match", "Strong Match", "Moderate Match", "Low Match"
    private List<String> extractedSkills;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> recommendations;
    private String tailoredSummaryRecommendation;
    private String source;

    public JobMatchResponse() {}

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchVerdict() {
        return matchVerdict;
    }

    public void setMatchVerdict(String matchVerdict) {
        this.matchVerdict = matchVerdict;
    }

    public List<String> getExtractedSkills() {
        return extractedSkills;
    }

    public void setExtractedSkills(List<String> extractedSkills) {
        this.extractedSkills = extractedSkills;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public String getTailoredSummaryRecommendation() {
        return tailoredSummaryRecommendation;
    }

    public void setTailoredSummaryRecommendation(String tailoredSummaryRecommendation) {
        this.tailoredSummaryRecommendation = tailoredSummaryRecommendation;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

