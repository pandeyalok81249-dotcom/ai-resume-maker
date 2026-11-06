package com.resumeai.dto;

import com.resumeai.entity.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ResumeResponse {
    private Long id;
    private Long userId;
    private String title;
    private String targetRole;
    private String templateKey;
    private String themeColor;
    private String fontFamily;
    private String fontSize;
    private String lineSpacing;
    private String summary;
    private String sectionOrder;
    private Integer atsScore;
    private Integer completionPercentage;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private PersonalInfoDto personalInfo;
    private List<EducationDto> educations = new ArrayList<>();
    private List<ExperienceDto> experiences = new ArrayList<>();
    private List<SkillDto> skills = new ArrayList<>();
    private List<ProjectDto> projects = new ArrayList<>();
    private List<CertificationDto> certifications = new ArrayList<>();
    private List<AdditionalSectionDto> additionalSections = new ArrayList<>();

    public ResumeResponse() {}

    public static ResumeResponse fromEntity(Resume resume) {
        ResumeResponse res = new ResumeResponse();
        res.setId(resume.getId());
        if (resume.getUser() != null) {
            res.setUserId(resume.getUser().getId());
        }
        res.setTitle(resume.getTitle());
        res.setTargetRole(resume.getTargetRole());
        res.setTemplateKey(resume.getTemplateKey());
        res.setThemeColor(resume.getThemeColor());
        res.setFontFamily(resume.getFontFamily());
        res.setFontSize(resume.getFontSize());
        res.setLineSpacing(resume.getLineSpacing());
        res.setSummary(resume.getSummary());
        res.setSectionOrder(resume.getSectionOrder());
        res.setAtsScore(resume.getAtsScore());
        res.setCompletionPercentage(resume.getCompletionPercentage());
        res.setIsPublic(resume.getIsPublic());
        res.setCreatedAt(resume.getCreatedAt());
        res.setUpdatedAt(resume.getUpdatedAt());

        if (resume.getPersonalInfo() != null) {
            PersonalInfoDto p = new PersonalInfoDto();
            p.setFullName(resume.getPersonalInfo().getFullName());
            p.setJobTitle(resume.getPersonalInfo().getJobTitle());
            p.setEmail(resume.getPersonalInfo().getEmail());
            p.setPhone(resume.getPersonalInfo().getPhone());
            p.setLocation(resume.getPersonalInfo().getLocation());
            p.setLinkedinUrl(resume.getPersonalInfo().getLinkedinUrl());
            p.setGithubUrl(resume.getPersonalInfo().getGithubUrl());
            p.setPortfolioUrl(resume.getPersonalInfo().getPortfolioUrl());
            res.setPersonalInfo(p);
        }

        if (resume.getEducations() != null) {
            for (Education e : resume.getEducations()) {
                EducationDto ed = new EducationDto();
                ed.setId(e.getId());
                ed.setInstitution(e.getInstitution());
                ed.setDegree(e.getDegree());
                ed.setFieldOfStudy(e.getFieldOfStudy());
                ed.setStartDate(e.getStartDate());
                ed.setEndDate(e.getEndDate());
                ed.setCurrent(e.getCurrent());
                ed.setGradeOrGpa(e.getGradeOrGpa());
                ed.setAchievements(e.getAchievements());
                ed.setSortOrder(e.getSortOrder());
                res.getEducations().add(ed);
            }
        }

        if (resume.getExperiences() != null) {
            for (Experience ex : resume.getExperiences()) {
                ExperienceDto exd = new ExperienceDto();
                exd.setId(ex.getId());
                exd.setCompany(ex.getCompany());
                exd.setPosition(ex.getPosition());
                exd.setLocation(ex.getLocation());
                exd.setStartDate(ex.getStartDate());
                exd.setEndDate(ex.getEndDate());
                exd.setCurrent(ex.getCurrent());
                exd.setDescription(ex.getDescription());
                exd.setBulletPoints(ex.getBulletPoints());
                exd.setSortOrder(ex.getSortOrder());
                res.getExperiences().add(exd);
            }
        }

        if (resume.getSkills() != null) {
            for (SkillItem s : resume.getSkills()) {
                SkillDto sd = new SkillDto();
                sd.setId(s.getId());
                sd.setName(s.getName());
                sd.setCategory(s.getCategory());
                sd.setProficiency(s.getProficiency());
                sd.setSortOrder(s.getSortOrder());
                res.getSkills().add(sd);
            }
        }

        if (resume.getProjects() != null) {
            for (Project p : resume.getProjects()) {
                ProjectDto pd = new ProjectDto();
                pd.setId(p.getId());
                pd.setTitle(p.getTitle());
                pd.setDescription(p.getDescription());
                pd.setTechnologies(p.getTechnologies());
                pd.setProjectUrl(p.getProjectUrl());
                pd.setGithubUrl(p.getGithubUrl());
                pd.setBulletPoints(p.getBulletPoints());
                pd.setSortOrder(p.getSortOrder());
                res.getProjects().add(pd);
            }
        }

        if (resume.getCertifications() != null) {
            for (Certification c : resume.getCertifications()) {
                CertificationDto cd = new CertificationDto();
                cd.setId(c.getId());
                cd.setName(c.getName());
                cd.setIssuer(c.getIssuer());
                cd.setIssueDate(c.getIssueDate());
                cd.setExpiryDate(c.getExpiryDate());
                cd.setCredentialId(c.getCredentialId());
                cd.setCredentialUrl(c.getCredentialUrl());
                cd.setAchievements(c.getAchievements());
                cd.setSortOrder(c.getSortOrder());
                res.getCertifications().add(cd);
            }
        }

        if (resume.getAdditionalSections() != null) {
            for (AdditionalSection a : resume.getAdditionalSections()) {
                AdditionalSectionDto ad = new AdditionalSectionDto();
                ad.setId(a.getId());
                ad.setSectionKey(a.getSectionKey());
                ad.setTitle(a.getTitle());
                ad.setContent(a.getContent());
                ad.setIsEnabled(a.getIsEnabled());
                ad.setSortOrder(a.getSortOrder());
                res.getAdditionalSections().add(ad);
            }
        }

        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public Integer getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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

