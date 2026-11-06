package com.resumeai.dto;

public class CoverLetterResponse {
    private String coverLetterText;
    private String subjectLine;
    private String source;

    public CoverLetterResponse() {}

    public CoverLetterResponse(String coverLetterText, String subjectLine, String source) {
        this.coverLetterText = coverLetterText;
        this.subjectLine = subjectLine;
        this.source = source;
    }

    public String getCoverLetterText() {
        return coverLetterText;
    }

    public void setCoverLetterText(String coverLetterText) {
        this.coverLetterText = coverLetterText;
    }

    public String getSubjectLine() {
        return subjectLine;
    }

    public void setSubjectLine(String subjectLine) {
        this.subjectLine = subjectLine;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

