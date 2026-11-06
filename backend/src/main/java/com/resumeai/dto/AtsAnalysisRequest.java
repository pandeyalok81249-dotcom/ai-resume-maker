package com.resumeai.dto;

public class AtsAnalysisRequest {
    private Long resumeId;
    private String targetRole;
    private String industry;
    private ResumeUpdateRequest resumeData; // optional inline data if analyzing before saving

    public AtsAnalysisRequest() {}

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public ResumeUpdateRequest getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeUpdateRequest resumeData) {
        this.resumeData = resumeData;
    }
}

