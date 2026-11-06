package com.resumeai.dto;

import java.util.List;

public class ResumeTailorResponse {
    private Integer matchScoreBefore;
    private Integer projectedMatchScoreAfter;
    private String tailoredRoleHeadline;
    private String tailoredSummary;
    private List<BulletOptimizationDto> bulletOptimizations;
    private List<String> suggestedSkills;
    private List<String> highImpactKeywords;
    private String sourceTag;

    public ResumeTailorResponse() {}

    public static class BulletOptimizationDto {
        private String section;
        private String originalBullet;
        private String tailoredBullet;
        private String rationale;
        private List<String> keywordsAdded;

        public BulletOptimizationDto() {}

        public BulletOptimizationDto(String section, String originalBullet, String tailoredBullet, String rationale, List<String> keywordsAdded) {
            this.section = section;
            this.originalBullet = originalBullet;
            this.tailoredBullet = tailoredBullet;
            this.rationale = rationale;
            this.keywordsAdded = keywordsAdded;
        }

        public String getSection() {
            return section;
        }

        public void setSection(String section) {
            this.section = section;
        }

        public String getOriginalBullet() {
            return originalBullet;
        }

        public void setOriginalBullet(String originalBullet) {
            this.originalBullet = originalBullet;
        }

        public String getTailoredBullet() {
            return tailoredBullet;
        }

        public void setTailoredBullet(String tailoredBullet) {
            this.tailoredBullet = tailoredBullet;
        }

        public String getRationale() {
            return rationale;
        }

        public void setRationale(String rationale) {
            this.rationale = rationale;
        }

        public List<String> getKeywordsAdded() {
            return keywordsAdded;
        }

        public void setKeywordsAdded(List<String> keywordsAdded) {
            this.keywordsAdded = keywordsAdded;
        }
    }

    public Integer getMatchScoreBefore() {
        return matchScoreBefore;
    }

    public void setMatchScoreBefore(Integer matchScoreBefore) {
        this.matchScoreBefore = matchScoreBefore;
    }

    public Integer getProjectedMatchScoreAfter() {
        return projectedMatchScoreAfter;
    }

    public void setProjectedMatchScoreAfter(Integer projectedMatchScoreAfter) {
        this.projectedMatchScoreAfter = projectedMatchScoreAfter;
    }

    public String getTailoredRoleHeadline() {
        return tailoredRoleHeadline;
    }

    public void setTailoredRoleHeadline(String tailoredRoleHeadline) {
        this.tailoredRoleHeadline = tailoredRoleHeadline;
    }

    public String getTailoredSummary() {
        return tailoredSummary;
    }

    public void setTailoredSummary(String tailoredSummary) {
        this.tailoredSummary = tailoredSummary;
    }

    public List<BulletOptimizationDto> getBulletOptimizations() {
        return bulletOptimizations;
    }

    public void setBulletOptimizations(List<BulletOptimizationDto> bulletOptimizations) {
        this.bulletOptimizations = bulletOptimizations;
    }

    public List<String> getSuggestedSkills() {
        return suggestedSkills;
    }

    public void setSuggestedSkills(List<String> suggestedSkills) {
        this.suggestedSkills = suggestedSkills;
    }

    public List<String> getHighImpactKeywords() {
        return highImpactKeywords;
    }

    public void setHighImpactKeywords(List<String> highImpactKeywords) {
        this.highImpactKeywords = highImpactKeywords;
    }

    public String getSourceTag() {
        return sourceTag;
    }

    public void setSourceTag(String sourceTag) {
        this.sourceTag = sourceTag;
    }
}

