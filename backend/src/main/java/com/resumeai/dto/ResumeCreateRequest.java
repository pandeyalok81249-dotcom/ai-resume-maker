package com.resumeai.dto;

import jakarta.validation.constraints.NotBlank;

public class ResumeCreateRequest {

    @NotBlank(message = "Resume title is required")
    private String title = "My Professional Resume";

    private String targetRole;
    private String templateKey = "modern-professional";
    private String themeColor = "#4F46E5";
    private String fontFamily = "Inter";

    public ResumeCreateRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getTemplateKey() {
        return templateKey;
    }

    public void setTemplateKey(String templateKey) {
        this.templateKey = templateKey;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public String getFontFamily() {
        return fontFamily;
    }

    public void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
    }
}

