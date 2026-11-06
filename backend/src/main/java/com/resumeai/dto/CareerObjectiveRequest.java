package com.resumeai.dto;

import java.util.List;

public class CareerObjectiveRequest {
    private String careerStage; // "Student", "Fresher", "Career Switcher", "Experienced"
    private String fieldOfStudyOrDomain;
    private String targetRole;
    private List<String> topSkills;

    public CareerObjectiveRequest() {}

    public String getCareerStage() {
        return careerStage;
    }

    public void setCareerStage(String careerStage) {
        this.careerStage = careerStage;
    }

    public String getFieldOfStudyOrDomain() {
        return fieldOfStudyOrDomain;
    }

    public void setFieldOfStudyOrDomain(String fieldOfStudyOrDomain) {
        this.fieldOfStudyOrDomain = fieldOfStudyOrDomain;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public List<String> getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(List<String> topSkills) {
        this.topSkills = topSkills;
    }
}

