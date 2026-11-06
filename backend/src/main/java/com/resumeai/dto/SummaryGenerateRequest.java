package com.resumeai.dto;

import java.util.List;

public class SummaryGenerateRequest {
    private String jobTitle;
    private Integer yearsOfExperience;
    private List<String> keySkills;
    private String tone = "Professional"; // Professional, Confident, Modern, Executive, Entry-Level
    private String additionalDetails;

    public SummaryGenerateRequest() {}

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public List<String> getKeySkills() {
        return keySkills;
    }

    public void setKeySkills(List<String> keySkills) {
        this.keySkills = keySkills;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(String additionalDetails) {
        this.additionalDetails = additionalDetails;
    }
}

