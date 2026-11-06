package com.resumeai.dto;

public class ResumeImprovementSuggestionDto {
    private String section;
    private String originalText;
    private String improvedText;
    private String reason;

    public ResumeImprovementSuggestionDto() {}

    public ResumeImprovementSuggestionDto(String section, String originalText, String improvedText, String reason) {
        this.section = section;
        this.originalText = originalText;
        this.improvedText = improvedText;
        this.reason = reason;
    }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }

    public String getImprovedText() { return improvedText; }
    public void setImprovedText(String improvedText) { this.improvedText = improvedText; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

