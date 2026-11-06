package com.resumeai.controller;

import com.resumeai.dto.*;
import com.resumeai.entity.User;
import com.resumeai.service.AuthService;
import com.resumeai.service.PdfExportService;
import com.resumeai.service.ResumeAuditorService;
import com.resumeai.service.ResumeParserService;
import com.resumeai.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final AuthService authService;
    private final PdfExportService pdfExportService;
    private final ResumeParserService resumeParserService;
    private final ResumeAuditorService resumeAuditorService;

    public ResumeController(
            ResumeService resumeService,
            AuthService authService,
            PdfExportService pdfExportService,
            ResumeParserService resumeParserService,
            ResumeAuditorService resumeAuditorService) {
        this.resumeService = resumeService;
        this.authService = authService;
        this.pdfExportService = pdfExportService;
        this.resumeParserService = resumeParserService;
        this.resumeAuditorService = resumeAuditorService;
    }

    @PostMapping("/upload-and-analyze")
    public ResponseEntity<ResumeUploadAnalysisResponse> uploadAndAnalyze(
            @RequestParam("file") MultipartFile file) {
        ResumeParserService.ParseResult parsed = resumeParserService.parseUploadedResume(file);
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "UploadedResume.pdf";
        String fileType = filename.endsWith(".pdf") ? "PDF Document" : "Text Document";

        ResumeUploadAnalysisResponse analysis = resumeAuditorService.auditResume(
                parsed.rawText, parsed.resume, filename, fileType
        );

        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/import-parsed")
    public ResponseEntity<ResumeResponse> importParsedResume(@RequestBody ResumeUpdateRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.importParsedResume(request, user));
    }

    @PostMapping
    public ResponseEntity<ResumeResponse> createResume(@Valid @RequestBody ResumeCreateRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.createResume(request, user));
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getUserResumes() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.getUserResumes(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResumeById(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.getResumeById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponse> updateResume(@PathVariable Long id, @RequestBody ResumeUpdateRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.updateResume(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        resumeService.deleteResume(id, user);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ResumeResponse> duplicateResume(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.duplicateResume(id, user));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<ResumeResponse> getPublicResume(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.getPublicResumeById(id));
    }

    @PostMapping("/{id}/toggle-public")
    public ResponseEntity<ResumeResponse> togglePublic(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(resumeService.togglePublic(id, user));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        ResumeResponse resume = resumeService.getResumeById(id, user);
        byte[] pdfBytes = pdfExportService.generatePdf(resume);

        String cleanName = resume.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cleanName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}

