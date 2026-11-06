package com.resumeai.dto;

public class ImproveContentRequest {
    private String content;
    private String targetGoal = "Impact & Tone"; // "Grammar & Polish", "Action Verbs & Impact", "Concise & Direct", "Executive Polish"
    private String context; // e.g. "Work Experience", "Summary", "Project Description"

    public ImproveContentRequest() {}

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTargetGoal() {
        return targetGoal;
    }

    public void setTargetGoal(String targetGoal) {
        this.targetGoal = targetGoal;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}

