package com.csd.cs203t1.common;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemMetadataRepository extends JpaRepository<SystemMetadata, String> {
    Optional<SystemMetadata> findByKey(String key);
}
