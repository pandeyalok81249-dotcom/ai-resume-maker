package com.resumeai.controller;

import com.resumeai.dto.ResumeResponse;
import com.resumeai.dto.UserResponse;
import com.resumeai.entity.Resume;
import com.resumeai.entity.User;
import com.resumeai.repository.ResumeRepository;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;

    public UserController(AuthService authService, UserRepository userRepository, ResumeRepository resumeRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody Map<String, String> payload) {
        User user = authService.getCurrentUser();
        if (payload.containsKey("firstName")) user.setFirstName(payload.get("firstName"));
        if (payload.containsKey("lastName")) user.setLastName(payload.get("lastName"));
        if (payload.containsKey("targetIndustry")) user.setTargetIndustry(payload.get("targetIndustry"));
        if (payload.containsKey("targetRole")) user.setTargetRole(payload.get("targetRole"));

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.fromEntity(saved));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        User user = authService.getCurrentUser();
        List<Resume> resumes = resumeRepository.findAllByUserOrderByUpdatedAtDesc(user);

        long totalResumes = resumes.size();
        double avgAts = resumes.stream()
                .mapToInt(r -> r.getAtsScore() != null ? r.getAtsScore() : 0)
                .average()
                .orElse(0.0);

        long readyResumes = resumes.stream()
                .filter(r -> r.getCompletionPercentage() != null && r.getCompletionPercentage() >= 80)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalResumes", totalResumes);
        stats.put("averageAtsScore", Math.round(avgAts));
        stats.put("readyResumes", readyResumes);
        stats.put("targetIndustry", user.getTargetIndustry() != null ? user.getTargetIndustry() : "Technology");
        stats.put("targetRole", user.getTargetRole() != null ? user.getTargetRole() : "Professional");

        return ResponseEntity.ok(stats);
    }
}

