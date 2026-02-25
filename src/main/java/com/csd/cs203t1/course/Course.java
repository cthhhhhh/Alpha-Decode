package com.csd.cs203t1.course;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


import lombok.*;


@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name="Course")

public class Course {
	private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;
	private String name;

}
