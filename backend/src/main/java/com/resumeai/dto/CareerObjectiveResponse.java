package com.resumeai.dto;

import java.util.List;

public class CareerObjectiveResponse {
    private String objective;
    private List<String> alternativeOptions;
    private String source;

    public CareerObjectiveResponse() {}

    public CareerObjectiveResponse(String objective, List<String> alternativeOptions, String source) {
        this.objective = objective;
        this.alternativeOptions = alternativeOptions;
        this.source = source;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public List<String> getAlternativeOptions() {
        return alternativeOptions;
    }

    public void setAlternativeOptions(List<String> alternativeOptions) {
        this.alternativeOptions = alternativeOptions;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

