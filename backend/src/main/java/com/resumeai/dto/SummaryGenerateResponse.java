package com.resumeai.dto;

import java.util.List;

public class SummaryGenerateResponse {
    private String summary;
    private List<String> alternativeOptions;
    private String source; // "AI_ENGINE" or "DEMO_ENGINE"

    public SummaryGenerateResponse() {}

    public SummaryGenerateResponse(String summary, List<String> alternativeOptions, String source) {
        this.summary = summary;
        this.alternativeOptions = alternativeOptions;
        this.source = source;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
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

