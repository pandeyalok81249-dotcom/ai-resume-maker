package com.resumeai.dto;

import java.util.List;

public class LinkedInSummaryRequest {
    private String currentRole;
    private List<String> topSkills;
    private String passionsOrGoals;
    private String tone = "Engaging & Professional";

    public LinkedInSummaryRequest() {}

    public String getCurrentRole() {
        return currentRole;
    }

    public void setCurrentRole(String currentRole) {
        this.currentRole = currentRole;
    }

    public List<String> getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(List<String> topSkills) {
        this.topSkills = topSkills;
    }

    public String getPassionsOrGoals() {
        return passionsOrGoals;
    }

    public void setPassionsOrGoals(String passionsOrGoals) {
        this.passionsOrGoals = passionsOrGoals;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }
}

