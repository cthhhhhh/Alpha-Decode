# Unit Testing

Current backend snapshot (April 2026):

- Test files: 33
- Executed tests: 244
- Failures: 0
- Errors: 0
- Skipped: 0
- Status: BUILD SUCCESS

The figures above are taken from the latest `target/surefire-reports` XML output.

---

## Prerequisites

1. Java JDK 21
2. Apache Maven

Dependencies (JUnit 5, Mockito, Spring Test, H2, JaCoCo) are managed by Maven.

---

## Current Test Inventory

| File | Tests (`@Test`) |
|---|---:|
| `src/test/java/com/csd/cs203t1/achievement/AchievementControllerTest.java` | 3 |
| `src/test/java/com/csd/cs203t1/achievement/AchievementServiceImplTest.java` | 5 |
| `src/test/java/com/csd/cs203t1/admin/AdminControllerTest.java` | 14 |
| `src/test/java/com/csd/cs203t1/admin/AdminServiceImplTest.java` | 7 |
| `src/test/java/com/csd/cs203t1/ai/AiControllerTest.java` | 1 |
| `src/test/java/com/csd/cs203t1/ai/AiServiceTest.java` | 4 |
| `src/test/java/com/csd/cs203t1/bookmark/BookmarkControllerTest.java` | 4 |
| `src/test/java/com/csd/cs203t1/bookmark/BookmarkServiceImplTest.java` | 4 |
| `src/test/java/com/csd/cs203t1/draft/DraftControllerTest.java` | 9 |
| `src/test/java/com/csd/cs203t1/draft/DraftServiceImplTest.java` | 7 |
| `src/test/java/com/csd/cs203t1/flag/FlagControllerTest.java` | 7 |
| `src/test/java/com/csd/cs203t1/flag/FlagServiceImplTest.java` | 5 |
| `src/test/java/com/csd/cs203t1/lesson/LessonControllerTest.java` | 7 |
| `src/test/java/com/csd/cs203t1/lesson/LessonServiceImplTest.java` | 10 |
| `src/test/java/com/csd/cs203t1/question/QuestionControllerTest.java` | 6 |
| `src/test/java/com/csd/cs203t1/question/QuestionServiceImplTest.java` | 5 |
| `src/test/java/com/csd/cs203t1/quiz/QuizControllerTest.java` | 9 |
| `src/test/java/com/csd/cs203t1/quiz/QuizRepositoryTest.java` | 3 |
| `src/test/java/com/csd/cs203t1/quiz/QuizServiceImplTest.java` | 9 |
| `src/test/java/com/csd/cs203t1/security/JwtFilterTest.java` | 2 |
| `src/test/java/com/csd/cs203t1/security/JwtUtilTest.java` | 3 |
| `src/test/java/com/csd/cs203t1/shop/ShopControllerTest.java` | 3 |
| `src/test/java/com/csd/cs203t1/shop/ShopServiceImplTest.java` | 11 |
| `src/test/java/com/csd/cs203t1/shop/WardrobeControllerTest.java` | 3 |
| `src/test/java/com/csd/cs203t1/term/TermControllerTest.java` | 8 |
| `src/test/java/com/csd/cs203t1/term/TermServiceImplTest.java` | 4 |
| `src/test/java/com/csd/cs203t1/user/LeaderboardControllerTest.java` | 3 |
| `src/test/java/com/csd/cs203t1/user/LeaderboardServiceImplTest.java` | 8 |
| `src/test/java/com/csd/cs203t1/user/OnboardingControllerTest.java` | 1 |
| `src/test/java/com/csd/cs203t1/user/UserControllerTest.java` | 22 |
| `src/test/java/com/csd/cs203t1/user/UserIntegrationTest.java` | 4 |
| `src/test/java/com/csd/cs203t1/user/UserRepositoryTest.java` | 14 |
| `src/test/java/com/csd/cs203t1/user/UserServiceImplTest.java` | 39 |
| **Total** | **244** |

---

## Coverage Snapshot (JaCoCo)

Source: `target/site/jacoco/index.html`

- Instruction coverage: 84% (1,007 missed of 6,295)
- Branch coverage: 65% (145 missed of 410)
- Classes covered: 54 / 62

### Package Coverage

| Package | Instruction Coverage | Branch Coverage |
|---|---:|---:|
| `com.csd.cs203t1.ai` | 99% | 74% |
| `com.csd.cs203t1.achievement` | 97% | 85% |
| `com.csd.cs203t1.shop` | 94% | 88% |
| `com.csd.cs203t1.security` | 93% | 60% |
| `com.csd.cs203t1.lesson` | 96% | 80% |
| `com.csd.cs203t1.quiz` | 91% | 68% |
| `com.csd.cs203t1.user` | 87% | 71% |
| `com.csd.cs203t1.term` | 86% | 50% |
| `com.csd.cs203t1.bookmark` | 69% | 100% |
| `com.csd.cs203t1.flag` | 67% | 33% |
| `com.csd.cs203t1.question` | 71% | 47% |
| `com.csd.cs203t1.admin` | 74% | 35% |
| `com.csd.cs203t1.draft` | 66% | 50% |
| `com.csd.cs203t1` | 52% | 0% |
| `com.csd.cs203t1.common` | 100% | n/a |

---

## How To Run

### Run full test suite

```powershell
mvn clean test
```

### Run backend tests while skipping frontend build steps

Use quoted property syntax in PowerShell:

```powershell
mvn "-Dskip.frontend=true" test
```

### Open coverage report

`target/site/jacoco/index.html`
