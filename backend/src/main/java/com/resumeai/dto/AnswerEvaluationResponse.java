package com.resumeai.dto;

import java.util.List;

public class AnswerEvaluationResponse {
    private Integer score;
    private String rating;
    private String feedback;
    private List<String> strengths;
    private List<String> improvements;
    private String refinedAnswer;
    private String sourceTag;

    public AnswerEvaluationResponse() {}

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getImprovements() {
        return improvements;
    }

    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }

    public String getRefinedAnswer() {
        return refinedAnswer;
    }

    public void setRefinedAnswer(String refinedAnswer) {
        this.refinedAnswer = refinedAnswer;
    }

    public String getSourceTag() {
        return sourceTag;
    }

    public void setSourceTag(String sourceTag) {
        this.sourceTag = sourceTag;
    }
}

