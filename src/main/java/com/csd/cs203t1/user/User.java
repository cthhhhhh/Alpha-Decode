package com.csd.cs203t1.user;

import com.csd.cs203t1.common.Role;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.time.LocalDate;


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
	private int coins = 0;

	@Column(columnDefinition = "integer default 0", nullable = false)
	private int weeklyCoins = 0;

	@Column(columnDefinition = "integer default 0", nullable = false)
	private int maxUnlockedLessonIndex = 0;

	@Column(columnDefinition = "text default ''", nullable = false)
	private String completedRevisionQuizIds = "";

	@Column(columnDefinition = "integer default 0")
	private int streak = 0;

	@Column(columnDefinition = "integer default 0")
	private int dailyQuizCount = 0;

	@Column
	private LocalDate dailyQuizLastDate;


	@Column(nullable = false, columnDefinition = "boolean default true")
	private boolean enabled = true;

	@Column(nullable = false, columnDefinition = "boolean default false")
	private boolean onboardingCompleted = false;

	@Column
	private String faceId;

	@Column
	private String bodyTypeId;

	@Column
	private String hairId;

	@Column
	private String skinColor;

	@Column
	private String hairColor;

	@Column
	private Long equippedOutfitId;

	@Column
	private Long equippedPetId;

}