package com.example.devworkspace.repository;

import com.example.devworkspace.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    @Query("SELECT a FROM Announcement a JOIN FETCH a.workspace w JOIN FETCH w.owner WHERE a.id = :id")
    Optional<Announcement> findByIdWithWorkspaceOwner(@Param("id") Long id);
}