package com.resumeai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_templates")
public class ResumeTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String templateKey;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String category; // e.g. "Professional", "Technical", "Creative", "Academic"

    private Boolean atsFriendly = true;

    private String defaultColor = "#4F46E5";

    private String defaultFont = "Inter";

    private String layoutType = "single-column"; // single-column, two-column, modern-grid

    public ResumeTemplate() {}

    public ResumeTemplate(String templateKey, String name, String description, String category, Boolean atsFriendly, String defaultColor, String defaultFont, String layoutType) {
        this.templateKey = templateKey;
        this.name = name;
        this.description = description;
        this.category = category;
        this.atsFriendly = atsFriendly;
        this.defaultColor = defaultColor;
        this.defaultFont = defaultFont;
        this.layoutType = layoutType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTemplateKey() {
        return templateKey;
    }

    public void setTemplateKey(String templateKey) {
        this.templateKey = templateKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getAtsFriendly() {
        return atsFriendly;
    }

    public void setAtsFriendly(Boolean atsFriendly) {
        this.atsFriendly = atsFriendly;
    }

    public String getDefaultColor() {
        return defaultColor;
    }

    public void setDefaultColor(String defaultColor) {
        this.defaultColor = defaultColor;
    }

    public String getDefaultFont() {
        return defaultFont;
    }

    public void setDefaultFont(String defaultFont) {
        this.defaultFont = defaultFont;
    }

    public String getLayoutType() {
        return layoutType;
    }

    public void setLayoutType(String layoutType) {
        this.layoutType = layoutType;
    }
}

