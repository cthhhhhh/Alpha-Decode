package com.csd.cs203t1.user;

import com.csd.cs203t1.common.Role;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.util.UUID;

import jakarta.persistence.EnumType;
import lombok.*;


@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode
@Table(name="users")
public class User {
	
	
	private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;

	@NonNull //unique = true if sign in is via username and not email
	@Column(nullable=false)
	private String username;

	@NonNull
	@Column(nullable=false)
	private String password;

	@NonNull
	@Column(nullable=false, unique=true)
	private String email;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role = Role.USER; //defaults to user, if creating admin/contributor account use setter to override

	@Column(nullable = false)
	private int level = 1;

	@Column(nullable = false)
	private int xp = 0;

	@Column(columnDefinition = "integer default 0", nullable = false)
	private int maxUnlockedLessonIndex = 0;

	@Column(nullable=false, unique=true, updatable=false)
	private UUID publicUUID = UUID.randomUUID(); //for later when we implement sign in with jwt

}