package com.resumeai.dto;

import com.resumeai.entity.ResumeTemplate;

public class TemplateDto {
    private Long id;
    private String templateKey;
    private String name;
    private String description;
    private String category;
    private Boolean atsFriendly;
    private String defaultColor;
    private String defaultFont;
    private String layoutType;

    public TemplateDto() {}

    public TemplateDto(String templateKey, String name, String description, String category, Boolean atsFriendly, String defaultColor, String defaultFont, String layoutType) {
        this.templateKey = templateKey;
        this.name = name;
        this.description = description;
        this.category = category;
        this.atsFriendly = atsFriendly;
        this.defaultColor = defaultColor;
        this.defaultFont = defaultFont;
        this.layoutType = layoutType;
    }

    public static TemplateDto fromEntity(ResumeTemplate entity) {
        TemplateDto dto = new TemplateDto();
        dto.setId(entity.getId());
        dto.setTemplateKey(entity.getTemplateKey());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setAtsFriendly(entity.getAtsFriendly());
        dto.setDefaultColor(entity.getDefaultColor());
        dto.setDefaultFont(entity.getDefaultFont());
        dto.setLayoutType(entity.getLayoutType());
        return dto;
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

