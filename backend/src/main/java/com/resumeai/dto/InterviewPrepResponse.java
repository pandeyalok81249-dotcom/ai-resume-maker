package com.resumeai.dto;

import java.util.List;

public class InterviewPrepResponse {
    private String targetRole;
    private int totalQuestions;
    private List<InterviewQuestionDto> questions;
    private List<String> generalTips;
    private String sourceTag;

    public InterviewPrepResponse() {}

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public List<InterviewQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<InterviewQuestionDto> questions) {
        this.questions = questions;
    }

    public List<String> getGeneralTips() {
        return generalTips;
    }

    public void setGeneralTips(List<String> generalTips) {
        this.generalTips = generalTips;
    }

    public String getSourceTag() {
        return sourceTag;
    }

    public void setSourceTag(String sourceTag) {
        this.sourceTag = sourceTag;
    }
}

