package com.resumeai.dto;

import java.util.List;

public class ImproveContentResponse {
    private String improvedContent;
    private String originalContent;
    private List<String> improvementsMade;
    private String source;

    public ImproveContentResponse() {}

    public ImproveContentResponse(String improvedContent, String originalContent, List<String> improvementsMade, String source) {
        this.improvedContent = improvedContent;
        this.originalContent = originalContent;
        this.improvementsMade = improvementsMade;
        this.source = source;
    }

    public String getImprovedContent() {
        return improvedContent;
    }

    public void setImprovedContent(String improvedContent) {
        this.improvedContent = improvedContent;
    }

    public String getOriginalContent() {
        return originalContent;
    }

    public void setOriginalContent(String originalContent) {
        this.originalContent = originalContent;
    }

    public List<String> getImprovementsMade() {
        return improvementsMade;
    }

    public void setImprovementsMade(List<String> improvementsMade) {
        this.improvementsMade = improvementsMade;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

