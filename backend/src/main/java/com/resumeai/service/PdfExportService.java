package com.resumeai.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.resumeai.dto.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
public class PdfExportService {

    public byte[] generatePdf(ResumeResponse resume) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPdfVersion(PdfWriter.VERSION_1_7);

            document.open();

            // Accent color resolution
            Color primaryColor = resolveColor(resume.getThemeColor());
            Color darkColor = new Color(15, 23, 42); // #0F172A
            Color mutedColor = new Color(100, 116, 139); // #64748B

            // Fonts
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryColor);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, darkColor);
            Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, primaryColor);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9.5f, darkColor);
            Font boldBodyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9.5f, darkColor);
            Font subTextFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8.5f, mutedColor);
            Font contactFont = FontFactory.getFont(FontFactory.HELVETICA, 8.5f, mutedColor);

            // Header Section: Name & Title
            PersonalInfoDto p = resume.getPersonalInfo();
            String name = (p != null && p.getFullName() != null && !p.getFullName().isBlank()) ? p.getFullName() : resume.getTitle();
            Paragraph namePara = new Paragraph(name, nameFont);
            namePara.setAlignment(Element.ALIGN_LEFT);
            namePara.setSpacingAfter(2);
            document.add(namePara);

            String jobTitle = (p != null && p.getJobTitle() != null) ? p.getJobTitle() : (resume.getTargetRole() != null ? resume.getTargetRole() : "");
            if (!jobTitle.isBlank()) {
                Paragraph titlePara = new Paragraph(jobTitle, titleFont);
                titlePara.setAlignment(Element.ALIGN_LEFT);
                titlePara.setSpacingAfter(4);
                document.add(titlePara);
            }

            // Contact Bar
            if (p != null) {
                StringBuilder contactBar = new StringBuilder();
                if (p.getEmail() != null && !p.getEmail().isBlank()) contactBar.append(p.getEmail());
                if (p.getPhone() != null && !p.getPhone().isBlank()) {
                    if (contactBar.length() > 0) contactBar.append("  |  ");
                    contactBar.append(p.getPhone());
                }
                if (p.getLocation() != null && !p.getLocation().isBlank()) {
                    if (contactBar.length() > 0) contactBar.append("  |  ");
                    contactBar.append(p.getLocation());
                }
                if (p.getLinkedinUrl() != null && !p.getLinkedinUrl().isBlank()) {
                    if (contactBar.length() > 0) contactBar.append("  |  ");
                    contactBar.append(p.getLinkedinUrl());
                }
                if (contactBar.length() > 0) {
                    Paragraph contactPara = new Paragraph(contactBar.toString(), contactFont);
                    contactPara.setSpacingAfter(10);
                    document.add(contactPara);
                }
            }

            // Professional Summary
            if (resume.getSummary() != null && !resume.getSummary().isBlank()) {
                addSectionHeading(document, "PROFESSIONAL SUMMARY", sectionHeaderFont, primaryColor);
                Paragraph sumPara = new Paragraph(resume.getSummary(), bodyFont);
                sumPara.setSpacingAfter(10);
                sumPara.setLeading(13f);
                document.add(sumPara);
            }

            // Work Experience
            if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
                addSectionHeading(document, "WORK EXPERIENCE", sectionHeaderFont, primaryColor);
                for (ExperienceDto exp : resume.getExperiences()) {
                    PdfPTable expTable = new PdfPTable(2);
                    expTable.setWidthPercentage(100);
                    expTable.setWidths(new float[]{75f, 25f});

                    PdfPCell leftCell = new PdfPCell();
                    leftCell.setBorder(Rectangle.NO_BORDER);
                    Paragraph posTitle = new Paragraph();
                    posTitle.add(new Chunk(exp.getPosition() != null ? exp.getPosition() : "", boldBodyFont));
                    if (exp.getCompany() != null && !exp.getCompany().isBlank()) {
                        posTitle.add(new Chunk("  —  " + exp.getCompany(), bodyFont));
                    }
                    leftCell.addElement(posTitle);

                    PdfPCell rightCell = new PdfPCell();
                    rightCell.setBorder(Rectangle.NO_BORDER);
                    rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    String dates = (exp.getStartDate() != null ? exp.getStartDate() : "") +
                            (exp.getCurrent() != null && exp.getCurrent() ? " - Present" : (exp.getEndDate() != null ? " - " + exp.getEndDate() : ""));
                    Paragraph datePara = new Paragraph(dates, subTextFont);
                    datePara.setAlignment(Element.ALIGN_RIGHT);
                    rightCell.addElement(datePara);

                    expTable.addCell(leftCell);
                    expTable.addCell(rightCell);
                    expTable.setSpacingAfter(3);
                    document.add(expTable);

                    if (exp.getDescription() != null && !exp.getDescription().isBlank()) {
                        Paragraph desc = new Paragraph(exp.getDescription(), bodyFont);
                        desc.setSpacingAfter(4);
                        desc.setLeading(12f);
                        document.add(desc);
                    }

                    if (exp.getBulletPoints() != null && !exp.getBulletPoints().isBlank()) {
                        String[] bullets = exp.getBulletPoints().split("\n");
                        for (String b : bullets) {
                            String trimmed = b.replaceFirst("^[-*•\\d.]+\\s*", "").trim();
                            if (!trimmed.isBlank()) {
                                Paragraph bp = new Paragraph("•  " + trimmed, bodyFont);
                                bp.setIndentationLeft(12);
                                bp.setSpacingAfter(2);
                                bp.setLeading(12f);
                                document.add(bp);
                            }
                        }
                    }

                    document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 4)));
                }
            }

            // Education
            if (resume.getEducations() != null && !resume.getEducations().isEmpty()) {
                addSectionHeading(document, "EDUCATION", sectionHeaderFont, primaryColor);
                for (EducationDto edu : resume.getEducations()) {
                    PdfPTable eduTable = new PdfPTable(2);
                    eduTable.setWidthPercentage(100);
                    eduTable.setWidths(new float[]{75f, 25f});

                    PdfPCell leftCell = new PdfPCell();
                    leftCell.setBorder(Rectangle.NO_BORDER);
                    Paragraph degPara = new Paragraph();
                    degPara.add(new Chunk(edu.getDegree() != null ? edu.getDegree() : "", boldBodyFont));
                    if (edu.getFieldOfStudy() != null && !edu.getFieldOfStudy().isBlank()) {
                        degPara.add(new Chunk(" in " + edu.getFieldOfStudy(), bodyFont));
                    }
                    if (edu.getInstitution() != null && !edu.getInstitution().isBlank()) {
                        degPara.add(new Chunk("  |  " + edu.getInstitution(), bodyFont));
                    }
                    leftCell.addElement(degPara);

                    PdfPCell rightCell = new PdfPCell();
                    rightCell.setBorder(Rectangle.NO_BORDER);
                    rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    String dates = (edu.getStartDate() != null ? edu.getStartDate() : "") +
                            (edu.getCurrent() != null && edu.getCurrent() ? " - Present" : (edu.getEndDate() != null ? " - " + edu.getEndDate() : ""));
                    Paragraph datePara = new Paragraph(dates, subTextFont);
                    datePara.setAlignment(Element.ALIGN_RIGHT);
                    rightCell.addElement(datePara);

                    eduTable.addCell(leftCell);
                    eduTable.addCell(rightCell);
                    eduTable.setSpacingAfter(2);
                    document.add(eduTable);

                    if (edu.getGradeOrGpa() != null && !edu.getGradeOrGpa().isBlank()) {
                        Paragraph gpaPara = new Paragraph("GPA / Score: " + edu.getGradeOrGpa(), subTextFont);
                        gpaPara.setSpacingAfter(3);
                        document.add(gpaPara);
                    }

                    document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 4)));
                }
            }

            // Skills
            if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
                addSectionHeading(document, "CORE SKILLS & TECHNOLOGIES", sectionHeaderFont, primaryColor);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < resume.getSkills().size(); i++) {
                    sb.append(resume.getSkills().get(i).getName());
                    if (i < resume.getSkills().size() - 1) sb.append("  •  ");
                }
                Paragraph skillsPara = new Paragraph(sb.toString(), bodyFont);
                skillsPara.setSpacingAfter(10);
                skillsPara.setLeading(13f);
                document.add(skillsPara);
            }

            // Projects
            if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
                addSectionHeading(document, "KEY PROJECTS", sectionHeaderFont, primaryColor);
                for (ProjectDto proj : resume.getProjects()) {
                    Paragraph projTitle = new Paragraph();
                    projTitle.add(new Chunk(proj.getTitle() != null ? proj.getTitle() : "", boldBodyFont));
                    if (proj.getTechnologies() != null && !proj.getTechnologies().isBlank()) {
                        projTitle.add(new Chunk(" (" + proj.getTechnologies() + ")", subTextFont));
                    }
                    projTitle.setSpacingAfter(2);
                    document.add(projTitle);

                    if (proj.getDescription() != null && !proj.getDescription().isBlank()) {
                        Paragraph desc = new Paragraph(proj.getDescription(), bodyFont);
                        desc.setSpacingAfter(2);
                        desc.setLeading(12f);
                        document.add(desc);
                    }

                    if (proj.getBulletPoints() != null && !proj.getBulletPoints().isBlank()) {
                        String[] bullets = proj.getBulletPoints().split("\n");
                        for (String b : bullets) {
                            String trimmed = b.replaceFirst("^[-*•\\d.]+\\s*", "").trim();
                            if (!trimmed.isBlank()) {
                                Paragraph bp = new Paragraph("•  " + trimmed, bodyFont);
                                bp.setIndentationLeft(12);
                                bp.setSpacingAfter(1);
                                bp.setLeading(12f);
                                document.add(bp);
                            }
                        }
                    }

                    document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 3)));
                }
            }

            // Certifications
            if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
                addSectionHeading(document, "CERTIFICATIONS & AWARDS", sectionHeaderFont, primaryColor);
                for (CertificationDto cert : resume.getCertifications()) {
                    Paragraph cPara = new Paragraph();
                    cPara.add(new Chunk("•  " + (cert.getName() != null ? cert.getName() : ""), boldBodyFont));
                    if (cert.getIssuer() != null && !cert.getIssuer().isBlank()) {
                        cPara.add(new Chunk(" — " + cert.getIssuer(), bodyFont));
                    }
                    if (cert.getIssueDate() != null && !cert.getIssueDate().isBlank()) {
                        cPara.add(new Chunk(" (" + cert.getIssueDate() + ")", subTextFont));
                    }
                    cPara.setSpacingAfter(2);
                    document.add(cPara);
                }
            }

            document.close();
            return out.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate PDF resume: " + ex.getMessage(), ex);
        }
    }

    private void addSectionHeading(Document doc, String title, Font font, Color ruleColor) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(8);
        p.setSpacingAfter(3);
        doc.add(p);

        // Divider rule table
        PdfPTable ruleTable = new PdfPTable(1);
        ruleTable.setWidthPercentage(100);
        PdfPCell ruleCell = new PdfPCell();
        ruleCell.setBorder(Rectangle.BOTTOM);
        ruleCell.setBorderColorBottom(ruleColor);
        ruleCell.setBorderWidthBottom(1.2f);
        ruleCell.setPadding(0);
        ruleCell.setFixedHeight(2);
        ruleTable.addCell(ruleCell);
        ruleTable.setSpacingAfter(6);
        doc.add(ruleTable);
    }

    private Color resolveColor(String hex) {
        if (hex == null || hex.isBlank()) return new Color(79, 70, 229); // #4F46E5
        try {
            return Color.decode(hex.trim());
        } catch (Exception e) {
            return new Color(79, 70, 229);
        }
    }
}

