package com.resumeai.service;

import com.resumeai.dto.*;
import com.resumeai.entity.*;
import com.resumeai.exception.ResourceNotFoundException;
import com.resumeai.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public ResumeResponse createResume(ResumeCreateRequest request, User user) {
        Resume resume = new Resume(user, request.getTitle(), request.getTemplateKey());
        resume.setTargetRole(request.getTargetRole());
        resume.setThemeColor(request.getThemeColor() != null ? request.getThemeColor() : "#4F46E5");
        resume.setFontFamily(request.getFontFamily() != null ? request.getFontFamily() : "Inter");

        // Pre-fill user name and email from account
        PersonalInfo personalInfo = new PersonalInfo();
        personalInfo.setFullName((user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "")).trim());
        personalInfo.setEmail(user.getEmail());
        personalInfo.setJobTitle(request.getTargetRole() != null ? request.getTargetRole() : "");
        resume.setPersonalInfo(personalInfo);

        // Calculate initial completion percentage
        resume.setCompletionPercentage(calculateCompletionPercentage(resume));
        resume.setAtsScore(calculateAtsScore(resume));

        Resume saved = resumeRepository.save(resume);
        return ResumeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> getUserResumes(User user) {
        return resumeRepository.findAllByUserOrderByUpdatedAtDesc(user).stream()
                .map(ResumeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeResponse getResumeById(Long id, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));
        return ResumeResponse.fromEntity(resume);
    }

    @Transactional
    public ResumeResponse updateResume(Long id, ResumeUpdateRequest request, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));

        if (request.getTitle() != null) resume.setTitle(request.getTitle());
        if (request.getTargetRole() != null) resume.setTargetRole(request.getTargetRole());
        if (request.getTemplateKey() != null) resume.setTemplateKey(request.getTemplateKey());
        if (request.getThemeColor() != null) resume.setThemeColor(request.getThemeColor());
        if (request.getFontFamily() != null) resume.setFontFamily(request.getFontFamily());
        if (request.getFontSize() != null) resume.setFontSize(request.getFontSize());
        if (request.getLineSpacing() != null) resume.setLineSpacing(request.getLineSpacing());
        if (request.getSummary() != null) resume.setSummary(request.getSummary());
        if (request.getSectionOrder() != null) resume.setSectionOrder(request.getSectionOrder());
        if (request.getIsPublic() != null) resume.setIsPublic(request.getIsPublic());

        // Update Personal Info
        if (request.getPersonalInfo() != null) {
            PersonalInfo p = resume.getPersonalInfo();
            if (p == null) p = new PersonalInfo();
            PersonalInfoDto dto = request.getPersonalInfo();
            p.setFullName(dto.getFullName());
            p.setJobTitle(dto.getJobTitle());
            p.setEmail(dto.getEmail());
            p.setPhone(dto.getPhone());
            p.setLocation(dto.getLocation());
            p.setLinkedinUrl(dto.getLinkedinUrl());
            p.setGithubUrl(dto.getGithubUrl());
            p.setPortfolioUrl(dto.getPortfolioUrl());
            resume.setPersonalInfo(p);
        }

        // Update Educations
        if (request.getEducations() != null) {
            resume.getEducations().clear();
            int order = 0;
            for (EducationDto ed : request.getEducations()) {
                Education e = new Education();
                e.setInstitution(ed.getInstitution());
                e.setDegree(ed.getDegree());
                e.setFieldOfStudy(ed.getFieldOfStudy());
                e.setStartDate(ed.getStartDate());
                e.setEndDate(ed.getEndDate());
                e.setCurrent(ed.getCurrent() != null && ed.getCurrent());
                e.setGradeOrGpa(ed.getGradeOrGpa());
                e.setAchievements(ed.getAchievements());
                e.setSortOrder(ed.getSortOrder() != null ? ed.getSortOrder() : order++);
                resume.addEducation(e);
            }
        }

        // Update Experiences
        if (request.getExperiences() != null) {
            resume.getExperiences().clear();
            int order = 0;
            for (ExperienceDto exd : request.getExperiences()) {
                Experience ex = new Experience();
                ex.setCompany(exd.getCompany());
                ex.setPosition(exd.getPosition());
                ex.setLocation(exd.getLocation());
                ex.setStartDate(exd.getStartDate());
                ex.setEndDate(exd.getEndDate());
                ex.setCurrent(exd.getCurrent() != null && exd.getCurrent());
                ex.setDescription(exd.getDescription());
                ex.setBulletPoints(exd.getBulletPoints());
                ex.setSortOrder(exd.getSortOrder() != null ? exd.getSortOrder() : order++);
                resume.addExperience(ex);
            }
        }

        // Update Skills
        if (request.getSkills() != null) {
            resume.getSkills().clear();
            int order = 0;
            for (SkillDto sd : request.getSkills()) {
                SkillItem s = new SkillItem();
                s.setName(sd.getName());
                s.setCategory(sd.getCategory() != null ? sd.getCategory() : "TECHNICAL");
                s.setProficiency(sd.getProficiency());
                s.setSortOrder(sd.getSortOrder() != null ? sd.getSortOrder() : order++);
                resume.addSkill(s);
            }
        }

        // Update Projects
        if (request.getProjects() != null) {
            resume.getProjects().clear();
            int order = 0;
            for (ProjectDto pd : request.getProjects()) {
                Project p = new Project();
                p.setTitle(pd.getTitle());
                p.setDescription(pd.getDescription());
                p.setTechnologies(pd.getTechnologies());
                p.setProjectUrl(pd.getProjectUrl());
                p.setGithubUrl(pd.getGithubUrl());
                p.setBulletPoints(pd.getBulletPoints());
                p.setSortOrder(pd.getSortOrder() != null ? pd.getSortOrder() : order++);
                resume.addProject(p);
            }
        }

        // Update Certifications
        if (request.getCertifications() != null) {
            resume.getCertifications().clear();
            int order = 0;
            for (CertificationDto cd : request.getCertifications()) {
                Certification c = new Certification();
                c.setName(cd.getName());
                c.setIssuer(cd.getIssuer());
                c.setIssueDate(cd.getIssueDate());
                c.setExpiryDate(cd.getExpiryDate());
                c.setCredentialId(cd.getCredentialId());
                c.setCredentialUrl(cd.getCredentialUrl());
                c.setAchievements(cd.getAchievements());
                c.setSortOrder(cd.getSortOrder() != null ? cd.getSortOrder() : order++);
                resume.addCertification(c);
            }
        }

        // Update Additional Sections
        if (request.getAdditionalSections() != null) {
            resume.getAdditionalSections().clear();
            int order = 0;
            for (AdditionalSectionDto ad : request.getAdditionalSections()) {
                AdditionalSection a = new AdditionalSection();
                a.setSectionKey(ad.getSectionKey());
                a.setTitle(ad.getTitle());
                a.setContent(ad.getContent());
                a.setIsEnabled(ad.getIsEnabled() != null ? ad.getIsEnabled() : true);
                a.setSortOrder(ad.getSortOrder() != null ? ad.getSortOrder() : order++);
                resume.addAdditionalSection(a);
            }
        }

        // Recalculate metrics
        resume.setCompletionPercentage(calculateCompletionPercentage(resume));
        resume.setAtsScore(calculateAtsScore(resume));

        Resume saved = resumeRepository.save(resume);
        return ResumeResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteResume(Long id, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));
        resumeRepository.delete(resume);
    }

    @Transactional
    public ResumeResponse duplicateResume(Long id, User user) {
        Resume source = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));

        Resume copy = new Resume(user, source.getTitle() + " (Copy)", source.getTemplateKey());
        copy.setTargetRole(source.getTargetRole());
        copy.setThemeColor(source.getThemeColor());
        copy.setFontFamily(source.getFontFamily());
        copy.setFontSize(source.getFontSize());
        copy.setLineSpacing(source.getLineSpacing());
        copy.setSummary(source.getSummary());
        copy.setSectionOrder(source.getSectionOrder());

        if (source.getPersonalInfo() != null) {
            PersonalInfo p = new PersonalInfo();
            p.setFullName(source.getPersonalInfo().getFullName());
            p.setJobTitle(source.getPersonalInfo().getJobTitle());
            p.setEmail(source.getPersonalInfo().getEmail());
            p.setPhone(source.getPersonalInfo().getPhone());
            p.setLocation(source.getPersonalInfo().getLocation());
            p.setLinkedinUrl(source.getPersonalInfo().getLinkedinUrl());
            p.setGithubUrl(source.getPersonalInfo().getGithubUrl());
            p.setPortfolioUrl(source.getPersonalInfo().getPortfolioUrl());
            copy.setPersonalInfo(p);
        }

        for (Education e : source.getEducations()) {
            Education ed = new Education();
            ed.setInstitution(e.getInstitution());
            ed.setDegree(e.getDegree());
            ed.setFieldOfStudy(e.getFieldOfStudy());
            ed.setStartDate(e.getStartDate());
            ed.setEndDate(e.getEndDate());
            ed.setCurrent(e.getCurrent());
            ed.setGradeOrGpa(e.getGradeOrGpa());
            ed.setAchievements(e.getAchievements());
            ed.setSortOrder(e.getSortOrder());
            copy.addEducation(ed);
        }

        for (Experience ex : source.getExperiences()) {
            Experience exp = new Experience();
            exp.setCompany(ex.getCompany());
            exp.setPosition(ex.getPosition());
            exp.setLocation(ex.getLocation());
            exp.setStartDate(ex.getStartDate());
            exp.setEndDate(ex.getEndDate());
            exp.setCurrent(ex.getCurrent());
            exp.setDescription(ex.getDescription());
            exp.setBulletPoints(ex.getBulletPoints());
            exp.setSortOrder(ex.getSortOrder());
            copy.addExperience(exp);
        }

        for (SkillItem s : source.getSkills()) {
            SkillItem sk = new SkillItem();
            sk.setName(s.getName());
            sk.setCategory(s.getCategory());
            sk.setProficiency(s.getProficiency());
            sk.setSortOrder(s.getSortOrder());
            copy.addSkill(sk);
        }

        for (Project p : source.getProjects()) {
            Project pr = new Project();
            pr.setTitle(p.getTitle());
            pr.setDescription(p.getDescription());
            pr.setTechnologies(p.getTechnologies());
            pr.setProjectUrl(p.getProjectUrl());
            pr.setGithubUrl(p.getGithubUrl());
            pr.setBulletPoints(p.getBulletPoints());
            pr.setSortOrder(p.getSortOrder());
            copy.addProject(pr);
        }

        for (Certification c : source.getCertifications()) {
            Certification ce = new Certification();
            ce.setName(c.getName());
            ce.setIssuer(c.getIssuer());
            ce.setIssueDate(c.getIssueDate());
            ce.setExpiryDate(c.getExpiryDate());
            ce.setCredentialId(c.getCredentialId());
            ce.setCredentialUrl(c.getCredentialUrl());
            ce.setAchievements(c.getAchievements());
            ce.setSortOrder(c.getSortOrder());
            copy.addCertification(ce);
        }

        for (AdditionalSection a : source.getAdditionalSections()) {
            AdditionalSection ad = new AdditionalSection();
            ad.setSectionKey(a.getSectionKey());
            ad.setTitle(a.getTitle());
            ad.setContent(a.getContent());
            ad.setIsEnabled(a.getIsEnabled());
            ad.setSortOrder(a.getSortOrder());
            copy.addAdditionalSection(ad);
        }

        copy.setCompletionPercentage(source.getCompletionPercentage());
        copy.setAtsScore(source.getAtsScore());

        Resume saved = resumeRepository.save(copy);
        return ResumeResponse.fromEntity(saved);
    }

    @Transactional
    public ResumeResponse importParsedResume(ResumeUpdateRequest request, User user) {
        Resume resume = new Resume();
        resume.setUser(user);
        resume.setTitle(request.getTitle() != null && !request.getTitle().isEmpty() ? request.getTitle() : "Imported Resume");
        resume.setTargetRole(request.getTargetRole() != null ? request.getTargetRole() :
                (request.getPersonalInfo() != null && request.getPersonalInfo().getJobTitle() != null ?
                        request.getPersonalInfo().getJobTitle() : "Software Professional"));
        resume.setTemplateKey(request.getTemplateKey() != null ? request.getTemplateKey() : "modern");
        resume.setThemeColor(request.getThemeColor() != null ? request.getThemeColor() : "#4F46E5");
        resume.setFontFamily("Inter");
        resume.setFontSize("medium");
        resume.setLineSpacing("normal");
        resume.setSummary(request.getSummary());

        Resume saved = resumeRepository.save(resume);
        return updateResume(saved.getId(), request, user);
    }

    public int calculateCompletionPercentage(Resume resume) {
        int score = 0;
        PersonalInfo p = resume.getPersonalInfo();
        if (p != null) {
            if (p.getFullName() != null && !p.getFullName().isBlank()) score += 10;
            if (p.getEmail() != null && !p.getEmail().isBlank()) score += 5;
            if (p.getPhone() != null && !p.getPhone().isBlank()) score += 5;
        }
        if (resume.getSummary() != null && resume.getSummary().trim().length() > 30) {
            score += 15;
        }
        if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
            score += 25;
        }
        if (resume.getEducations() != null && !resume.getEducations().isEmpty()) {
            score += 15;
        }
        if (resume.getSkills() != null && resume.getSkills().size() >= 3) {
            score += 15;
        }
        if ((resume.getProjects() != null && !resume.getProjects().isEmpty()) ||
            (resume.getCertifications() != null && !resume.getCertifications().isEmpty())) {
            score += 10;
        }
        return Math.min(score, 100);
    }

    public int calculateAtsScore(Resume resume) {
        int ats = 30; // base score for standard formatting
        if (resume.getSummary() != null && resume.getSummary().length() > 80) ats += 15;
        if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
            ats += 20;
            // Check for metric / active verb signals
            boolean hasMetrics = resume.getExperiences().stream()
                    .anyMatch(e -> (e.getBulletPoints() != null && e.getBulletPoints().matches(".*[0-9%+$].*")) ||
                                   (e.getDescription() != null && e.getDescription().matches(".*[0-9%+$].*")));
            if (hasMetrics) ats += 10;
        }
        if (resume.getSkills() != null && resume.getSkills().size() >= 5) ats += 15;
        if (resume.getEducations() != null && !resume.getEducations().isEmpty()) ats += 10;
        return Math.min(ats, 100);
    }

    @Transactional(readOnly = true)
    public ResumeResponse getPublicResumeById(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Public resume not found"));
        if (!Boolean.TRUE.equals(resume.getIsPublic())) {
            throw new ResourceNotFoundException("This resume has not been made publicly accessible by the author.");
        }
        return ResumeResponse.fromEntity(resume);
    }

    @Transactional
    public ResumeResponse togglePublic(Long id, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or access denied"));
        boolean current = Boolean.TRUE.equals(resume.getIsPublic());
        resume.setIsPublic(!current);
        Resume saved = resumeRepository.save(resume);
        return ResumeResponse.fromEntity(saved);
    }
}

