package com.csd.cs203t1.common;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name="system_metadata")
public class SystemMetadata {
    @Id
    private String key;
    private String value;
}
