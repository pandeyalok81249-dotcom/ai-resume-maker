package com.resumeai.dto;

import java.util.List;

public class BulletsGenerateResponse {
    private List<String> bulletPoints;
    private String source;

    public BulletsGenerateResponse() {}

    public BulletsGenerateResponse(List<String> bulletPoints, String source) {
        this.bulletPoints = bulletPoints;
        this.source = source;
    }

    public List<String> getBulletPoints() {
        return bulletPoints;
    }

    public void setBulletPoints(List<String> bulletPoints) {
        this.bulletPoints = bulletPoints;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

