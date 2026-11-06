package com.resumeai.dto;

import java.util.ArrayList;
import java.util.List;

public class ResumeUpdateRequest {
    private String title;
    private String targetRole;
    private String templateKey;
    private String themeColor;
    private String fontFamily;
    private String fontSize;
    private String lineSpacing;
    private String summary;
    private String sectionOrder;
    private Boolean isPublic;

    private PersonalInfoDto personalInfo;
    private List<EducationDto> educations = new ArrayList<>();
    private List<ExperienceDto> experiences = new ArrayList<>();
    private List<SkillDto> skills = new ArrayList<>();
    private List<ProjectDto> projects = new ArrayList<>();
    private List<CertificationDto> certifications = new ArrayList<>();
    private List<AdditionalSectionDto> additionalSections = new ArrayList<>();

    public ResumeUpdateRequest() {}

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

    public String getFontSize() {
        return fontSize;
    }

    public void setFontSize(String fontSize) {
        this.fontSize = fontSize;
    }

    public String getLineSpacing() {
        return lineSpacing;
    }

    public void setLineSpacing(String lineSpacing) {
        this.lineSpacing = lineSpacing;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSectionOrder() {
        return sectionOrder;
    }

    public void setSectionOrder(String sectionOrder) {
        this.sectionOrder = sectionOrder;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public PersonalInfoDto getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfoDto personalInfo) {
        this.personalInfo = personalInfo;
    }

    public List<EducationDto> getEducations() {
        return educations;
    }

    public void setEducations(List<EducationDto> educations) {
        this.educations = educations;
    }

    public List<ExperienceDto> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<ExperienceDto> experiences) {
        this.experiences = experiences;
    }

    public List<SkillDto> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillDto> skills) {
        this.skills = skills;
    }

    public List<ProjectDto> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDto> projects) {
        this.projects = projects;
    }

    public List<CertificationDto> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationDto> certifications) {
        this.certifications = certifications;
    }

    public List<AdditionalSectionDto> getAdditionalSections() {
        return additionalSections;
    }

    public void setAdditionalSections(List<AdditionalSectionDto> additionalSections) {
        this.additionalSections = additionalSections;
    }
}

