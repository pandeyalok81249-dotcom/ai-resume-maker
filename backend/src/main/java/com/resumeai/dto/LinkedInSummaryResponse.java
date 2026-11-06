package com.resumeai.dto;

import java.util.List;

public class LinkedInSummaryResponse {
    private String headline;
    private String aboutSection;
    private List<String> hashtags;
    private String source;

    public LinkedInSummaryResponse() {}

    public LinkedInSummaryResponse(String headline, String aboutSection, List<String> hashtags, String source) {
        this.headline = headline;
        this.aboutSection = aboutSection;
        this.hashtags = hashtags;
        this.source = source;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getAboutSection() {
        return aboutSection;
    }

    public void setAboutSection(String aboutSection) {
        this.aboutSection = aboutSection;
    }

    public List<String> getHashtags() {
        return hashtags;
    }

    public void setHashtags(List<String> hashtags) {
        this.hashtags = hashtags;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

