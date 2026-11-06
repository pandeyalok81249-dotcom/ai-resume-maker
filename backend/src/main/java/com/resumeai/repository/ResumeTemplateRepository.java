package com.resumeai.repository;

import com.resumeai.entity.ResumeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeTemplateRepository extends JpaRepository<ResumeTemplate, Long> {
    Optional<ResumeTemplate> findByTemplateKey(String templateKey);
}

