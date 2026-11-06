package com.resumeai.dto;

public class CoverLetterRequest {
    private Long resumeId;
    private String recipientName;
    private String companyName;
    private String jobTitle;
    private String jobDescription;
    private ResumeUpdateRequest resumeData;

    public CoverLetterRequest() {}

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
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

