package com.resumeai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String title = "Untitled Resume";

    private String targetRole;

    @Column(nullable = false)
    private String templateKey = "modern-professional";

    private String themeColor = "#4F46E5";
    private String fontFamily = "Inter";
    private String fontSize = "medium"; // small, medium, large
    private String lineSpacing = "normal"; // compact, normal, relaxed

    @Column(length = 4000)
    private String summary;

    @Column(length = 1000)
    private String sectionOrder = "personal,summary,experience,education,skills,projects,certifications,additional";

    @Embedded
    private PersonalInfo personalInfo = new PersonalInfo();

    private Integer atsScore = 0;
    private Integer completionPercentage = 0;
    private Boolean isPublic = false;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<SkillItem> skills = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<AdditionalSection> additionalSections = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Resume() {}

    public Resume(User user, String title, String templateKey) {
        this.user = user;
        this.title = title;
        this.templateKey = templateKey != null ? templateKey : "modern-professional";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper methods to keep bi-directional references in sync
    public void addEducation(Education education) {
        educations.add(education);
        education.setResume(this);
    }

    public void removeEducation(Education education) {
        educations.remove(education);
        education.setResume(null);
    }

    public void addExperience(Experience experience) {
        experiences.add(experience);
        experience.setResume(this);
    }

    public void removeExperience(Experience experience) {
        experiences.remove(experience);
        experience.setResume(null);
    }

    public void addSkill(SkillItem skill) {
        skills.add(skill);
        skill.setResume(this);
    }

    public void removeSkill(SkillItem skill) {
        skills.remove(skill);
        skill.setResume(null);
    }

    public void addProject(Project project) {
        projects.add(project);
        project.setResume(this);
    }

    public void removeProject(Project project) {
        projects.remove(project);
        project.setResume(null);
    }

    public void addCertification(Certification cert) {
        certifications.add(cert);
        cert.setResume(this);
    }

    public void removeCertification(Certification cert) {
        certifications.remove(cert);
        cert.setResume(null);
    }

    public void addAdditionalSection(AdditionalSection section) {
        additionalSections.add(section);
        section.setResume(this);
    }

    public void removeAdditionalSection(AdditionalSection section) {
        additionalSections.remove(section);
        section.setResume(null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
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

    public List<Education> getEducations() {
        return educations;
    }

    public void setEducations(List<Education> educations) {
        this.educations = educations;
    }

    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }

    public List<SkillItem> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillItem> skills) {
        this.skills = skills;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Certification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    public List<AdditionalSection> getAdditionalSections() {
        return additionalSections;
    }

    public void setAdditionalSections(List<AdditionalSection> additionalSections) {
        this.additionalSections = additionalSections;
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
}

