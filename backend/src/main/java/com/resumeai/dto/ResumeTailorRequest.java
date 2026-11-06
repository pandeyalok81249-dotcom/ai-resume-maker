package com.resumeai.dto;

public class ResumeTailorRequest {
    private Long resumeId;
    private String jobTitle;
    private String company;
    private String jobDescription;
    private ResumeUpdateRequest resumeData;

    public ResumeTailorRequest() {}

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
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

