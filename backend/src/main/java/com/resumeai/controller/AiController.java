package com.resumeai.controller;

import com.resumeai.dto.*;
import com.resumeai.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate-summary")
    public ResponseEntity<SummaryGenerateResponse> generateSummary(@RequestBody SummaryGenerateRequest request) {
        return ResponseEntity.ok(aiService.generateSummary(request));
    }

    @PostMapping("/generate-bullets")
    public ResponseEntity<BulletsGenerateResponse> generateBullets(@RequestBody BulletsGenerateRequest request) {
        return ResponseEntity.ok(aiService.generateBullets(request));
    }

    @PostMapping("/improve-content")
    public ResponseEntity<ImproveContentResponse> improveContent(@RequestBody ImproveContentRequest request) {
        return ResponseEntity.ok(aiService.improveContent(request));
    }

    @PostMapping("/ats-analysis")
    public ResponseEntity<AtsAnalysisResponse> analyzeAts(@RequestBody AtsAnalysisRequest request) {
        return ResponseEntity.ok(aiService.analyzeAts(request));
    }

    @PostMapping("/job-match")
    public ResponseEntity<JobMatchResponse> matchJob(@RequestBody JobMatchRequest request) {
        return ResponseEntity.ok(aiService.matchJob(request));
    }

    @PostMapping("/career-objective")
    public ResponseEntity<CareerObjectiveResponse> generateCareerObjective(@RequestBody CareerObjectiveRequest request) {
        return ResponseEntity.ok(aiService.generateCareerObjective(request));
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<CoverLetterResponse> generateCoverLetter(@RequestBody CoverLetterRequest request) {
        return ResponseEntity.ok(aiService.generateCoverLetter(request));
    }

    @PostMapping("/linkedin-summary")
    public ResponseEntity<LinkedInSummaryResponse> generateLinkedInSummary(@RequestBody LinkedInSummaryRequest request) {
        return ResponseEntity.ok(aiService.generateLinkedInSummary(request));
    }

    @PostMapping("/interview-prep")
    public ResponseEntity<InterviewPrepResponse> generateInterviewPrep(@RequestBody InterviewPrepRequest request) {
        return ResponseEntity.ok(aiService.generateInterviewPrep(request));
    }

    @PostMapping("/evaluate-answer")
    public ResponseEntity<AnswerEvaluationResponse> evaluateAnswer(@RequestBody AnswerEvaluationRequest request) {
        return ResponseEntity.ok(aiService.evaluateAnswer(request));
    }

    @PostMapping("/tailor-resume")
    public ResponseEntity<ResumeTailorResponse> tailorResume(@RequestBody ResumeTailorRequest request) {
        return ResponseEntity.ok(aiService.tailorResume(request));
    }

    @PostMapping("/salary-insights")
    public ResponseEntity<SalaryInsightsResponse> generateSalaryInsights(@RequestBody SalaryInsightsRequest request) {
        return ResponseEntity.ok(aiService.generateSalaryInsights(request));
    }
}

