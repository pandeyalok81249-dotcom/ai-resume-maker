package com.resumeai.repository;

import com.resumeai.entity.AiAnalysisLog;
import com.resumeai.entity.Resume;
import com.resumeai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiAnalysisLogRepository extends JpaRepository<AiAnalysisLog, Long> {
    List<AiAnalysisLog> findAllByResumeOrderByCreatedAtDesc(Resume resume);
    List<AiAnalysisLog> findTop5ByUserOrderByCreatedAtDesc(User user);
}

