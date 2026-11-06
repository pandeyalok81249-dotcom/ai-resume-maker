package com.resumeai.dto;

import java.util.List;
import java.util.Map;

public class SalaryInsightsResponse {
    private String targetRole;
    private String location;
    private String experienceLevel;
    private Integer minSalary;
    private Integer medianSalary;
    private Integer maxSalary;
    private Integer top10Salary;
    private String currency;
    private String marketDemand; // "High", "Very High", "Moderate"
    private Map<String, String> skillPremiums; // e.g. "Kubernetes": "+18%"
    private List<String> careerMilestones;
    private List<String> negotiationTips;
    private String sourceTag;

    public SalaryInsightsResponse() {}

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public Integer getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(Integer minSalary) {
        this.minSalary = minSalary;
    }

    public Integer getMedianSalary() {
        return medianSalary;
    }

    public void setMedianSalary(Integer medianSalary) {
        this.medianSalary = medianSalary;
    }

    public Integer getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(Integer maxSalary) {
        this.maxSalary = maxSalary;
    }

    public Integer getTop10Salary() {
        return top10Salary;
    }

    public void setTop10Salary(Integer top10Salary) {
        this.top10Salary = top10Salary;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getMarketDemand() {
        return marketDemand;
    }

    public void setMarketDemand(String marketDemand) {
        this.marketDemand = marketDemand;
    }

    public Map<String, String> getSkillPremiums() {
        return skillPremiums;
    }

    public void setSkillPremiums(Map<String, String> skillPremiums) {
        this.skillPremiums = skillPremiums;
    }

    public List<String> getCareerMilestones() {
        return careerMilestones;
    }

    public void setCareerMilestones(List<String> careerMilestones) {
        this.careerMilestones = careerMilestones;
    }

    public List<String> getNegotiationTips() {
        return negotiationTips;
    }

    public void setNegotiationTips(List<String> negotiationTips) {
        this.negotiationTips = negotiationTips;
    }

    public String getSourceTag() {
        return sourceTag;
    }

    public void setSourceTag(String sourceTag) {
        this.sourceTag = sourceTag;
    }
}

