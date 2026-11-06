package com.resumeai.service;

import com.resumeai.dto.TemplateDto;
import com.resumeai.entity.ResumeTemplate;
import com.resumeai.repository.ResumeTemplateRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    private final ResumeTemplateRepository templateRepository;

    public TemplateService(ResumeTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @PostConstruct
    public void initDefaultTemplates() {
        if (templateRepository.count() == 0) {
            List<ResumeTemplate> templates = new ArrayList<>();

            templates.add(new ResumeTemplate(
                    "modern-professional",
                    "Modern Professional",
                    "Clean, balanced layout with a subtle colored header band, optimal typography hierarchy, and high ATS readability.",
                    "Professional",
                    true,
                    "#4F46E5",
                    "Inter",
                    "single-column"
            ));

            templates.add(new ResumeTemplate(
                    "classic-corporate",
                    "Classic Corporate",
                    "Time-tested traditional single-column format with elegant serif typography, clean section dividing rules, and corporate pedigree.",
                    "Corporate",
                    true,
                    "#1E293B",
                    "Merriweather",
                    "single-column"
            ));

            templates.add(new ResumeTemplate(
                    "minimalist",
                    "Minimalist",
                    "Understated, modern Swiss-style grid with ample white space, razor-sharp focus on content, and zero distraction.",
                    "Modern",
                    true,
                    "#334155",
                    "Inter",
                    "single-column"
            ));

            templates.add(new ResumeTemplate(
                    "software-developer",
                    "Software Developer",
                    "Engineered for tech professionals with prominent tech stack chips, GitHub and repository highlights, and system architecture bullet points.",
                    "Technical",
                    true,
                    "#06B6D4",
                    "Fira Code",
                    "two-column"
            ));

            templates.add(new ResumeTemplate(
                    "fresher",
                    "Fresher Resume",
                    "Tailored for students and new graduates, emphasizing university education, academic projects, coursework, and campus leadership.",
                    "Entry-Level",
                    true,
                    "#10B981",
                    "Poppins",
                    "single-column"
            ));

            templates.add(new ResumeTemplate(
                    "creative",
                    "Creative Resume",
                    "Eye-catching layout with modern indigo and purple gradients, dynamic project showcases, and stylized section indicators.",
                    "Creative",
                    false,
                    "#7C3AED",
                    "Poppins",
                    "two-column"
            ));

            templates.add(new ResumeTemplate(
                    "executive",
                    "Executive Resume",
                    "Sophisticated executive layout highlighting leadership milestones, core competencies matrix, board memberships, and business impact metrics.",
                    "Executive",
                    true,
                    "#0F172A",
                    "Roboto",
                    "single-column"
            ));

            templates.add(new ResumeTemplate(
                    "academic",
                    "Academic Resume",
                    "Comprehensive Curriculum Vitae (CV) style focusing on peer-reviewed publications, research grants, teaching appointments, and academic honors.",
                    "Academic",
                    true,
                    "#475569",
                    "Merriweather",
                    "single-column"
            ));

            templateRepository.saveAll(templates);
        }
    }

    public List<TemplateDto> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(TemplateDto::fromEntity)
                .collect(Collectors.toList());
    }

    public TemplateDto getTemplateByKey(String key) {
        return templateRepository.findByTemplateKey(key)
                .map(TemplateDto::fromEntity)
                .orElse(null);
    }
}

