package com.resumeai.dto;

import java.util.List;

public class InterviewQuestionDto {
    private String id;
    private String category;
    private String question;
    private String whyAsked;
    private String starFramework;
    private List<String> suggestedTalkingPoints;
    private String sampleAnswer;

    public InterviewQuestionDto() {}

    public InterviewQuestionDto(String id, String category, String question, String whyAsked, String starFramework, List<String> suggestedTalkingPoints, String sampleAnswer) {
        this.id = id;
        this.category = category;
        this.question = question;
        this.whyAsked = whyAsked;
        this.starFramework = starFramework;
        this.suggestedTalkingPoints = suggestedTalkingPoints;
        this.sampleAnswer = sampleAnswer;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getWhyAsked() {
        return whyAsked;
    }

    public void setWhyAsked(String whyAsked) {
        this.whyAsked = whyAsked;
    }

    public String getStarFramework() {
        return starFramework;
    }

    public void setStarFramework(String starFramework) {
        this.starFramework = starFramework;
    }

    public List<String> getSuggestedTalkingPoints() {
        return suggestedTalkingPoints;
    }

    public void setSuggestedTalkingPoints(List<String> suggestedTalkingPoints) {
        this.suggestedTalkingPoints = suggestedTalkingPoints;
    }

    public String getSampleAnswer() {
        return sampleAnswer;
    }

    public void setSampleAnswer(String sampleAnswer) {
        this.sampleAnswer = sampleAnswer;
    }
}

