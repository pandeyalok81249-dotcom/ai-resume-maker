package com.resumeai.dto;

public class SkillDto {
    private Long id;
    private String name;
    private String category;
    private String proficiency;
    private Integer sortOrder = 0;

    public SkillDto() {}

    public SkillDto(String name, String category, String proficiency) {
        this.name = name;
        this.category = category;
        this.proficiency = proficiency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}

