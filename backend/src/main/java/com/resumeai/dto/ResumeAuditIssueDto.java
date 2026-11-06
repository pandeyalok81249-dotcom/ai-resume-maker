package com.resumeai.dto;

public class ResumeAuditIssueDto {
    private String id;
    private String category; // ATS_READABILITY, WEAK_LANGUAGE, MISSING_METRICS, SECTION_STRUCTURE, CLICHE_BUZZWORDS
    private String severity; // CRITICAL, WARNING, INFO
    private String title;
    private String description;
    private String quoteSnippet;
    private String recommendedFix;

    public ResumeAuditIssueDto() {}

    public ResumeAuditIssueDto(String id, String category, String severity, String title, String description, String quoteSnippet, String recommendedFix) {
        this.id = id;
        this.category = category;
        this.severity = severity;
        this.title = title;
        this.description = description;
        this.quoteSnippet = quoteSnippet;
        this.recommendedFix = recommendedFix;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getQuoteSnippet() { return quoteSnippet; }
    public void setQuoteSnippet(String quoteSnippet) { this.quoteSnippet = quoteSnippet; }

    public String getRecommendedFix() { return recommendedFix; }
    public void setRecommendedFix(String recommendedFix) { this.recommendedFix = recommendedFix; }
}

