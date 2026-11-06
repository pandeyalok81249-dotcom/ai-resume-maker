package com.resumeai.dto;

import java.util.List;

public class InterviewPrepRequest {
    private Long resumeId;
    private String targetRole;
    private Integer yearsOfExperience;
    private String jobDescription;
    private ResumeUpdateRequest resumeData;

    public InterviewPrepRequest() {}

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

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public ResumeUpdateRequest getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeUpdateRequest resumeData) {
        this.resumeData = resumeData;
    }
}

