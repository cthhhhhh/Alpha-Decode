# Unit Testing

**Total: 118 tests across 14 files — all passing ✅ | BUILD SUCCESS**

---

## Prerequisites & Installation

To run these tests and generate the coverage reports on your own machine, ensure you have the following installed:

1.  **Java JDK 21**: The project is optimized for Java 21 logic.
2.  **Apache Maven**: Used for dependency management and executing the test lifecycle.

### Automatic Dependencies
The following are automatically handled by Maven when you run `mvn test`:
- **JUnit 5 / Mockito**: Core testing frameworks.
- **Jacoco**: The coverage plugin (version 0.8.12).
- **H2 Database**: An in-memory database used strictly for testing.
- **Spring Security Test**: Utilities for mocking user roles.

---

## 1. Test Files Overview

| File | Type | Tests |
|---|---|---|
| `user/UserServiceImplTest.java` | Unit (Mockito) | 26 |
| `user/UserRepositoryTest.java` | Repository (DataJpaTest) | 14 |
| `user/UserControllerTest.java` | Web Layer (WebMvcTest) | 14 |
| `user/UserIntegrationTest.java` | Integration (SpringBootTest) | 4 |
| `quiz/QuizRepositoryTest.java` | Repository (DataJpaTest) | 3 |
| `quiz/QuizControllerTest.java` | Web Layer (WebMvcTest) | 9 |
| `admin/AdminControllerTest.java` | Web Layer (WebMvcTest) | 10 |
| `draft/DraftControllerTest.java` | Web Layer (WebMvcTest) | 8 |
| `draft/DraftServiceImplTest.java` | Unit (Mockito) | 7 |
| `lesson/LessonControllerTest.java` | Web Layer (WebMvcTest) | 5 |
| `shop/ShopControllerTest.java` | Web Layer (WebMvcTest) | 6 |
| `shop/WardrobeControllerTest.java` | Web Layer (WebMvcTest) | 4 |
| `shop/ShopServiceImplTest.java` | Unit (Mockito) | 7 |
| `achievement/AchievementControllerTest.java` | Web Layer (WebMvcTest) | 1 |

---

## 2. Testing Methodology (The 3-Tier Approach)

To ensure high-quality code, we divided our tests to target each layer of the backend specifically:

### 1. Unit Testing with Mocking (Mockito)
**File Examples:** `UserServiceImplTest.java`, `DraftServiceImplTest.java`, `ShopServiceImplTest.java`

Each dependency (`UserRepository`, `JwtUtil`, `PasswordEncoder`) is replaced with a **Mockito mock** so that tests run entirely in-memory with no database, no network, and no Spring context. This means:
- Tests run in **milliseconds**.
- If a test fails, the bug is **guaranteed to be in the service logic** — not the database or network connection.

> *"The service layer was tested in strict isolation using Mockito. All dependencies — such as UserRepository and JwtUtil — were replaced with mock objects. This ensures that a test failure pinpoints a bug strictly within the business logic being tested."*

### 2. Boundary Value Analysis (BVA)
**File:** `UserServiceImplTest.java` (5 dedicated BVA tests)

BVA tests values at the **exact edge** of a valid input range, plus one value just inside and outside. This catches off-by-one errors.

**Password length boundary** (rule: `length < 6` is invalid):

| Test | Input | Expected | Boundary Position |
|---|---|---|---|
| `bva_resetPassword_5chars_belowBoundary_throwsException` | `"abcde"` (5 chars) | ❌ throws | **Just below** |
| `bva_resetPassword_6chars_onBoundary_succeeds` | `"abcdef"` (6 chars) | ✅ passes | **On the boundary** |
| `bva_resetPassword_7chars_aboveBoundary_succeeds` | `"abcdefg"` (7 chars) | ✅ passes | **Just above** |

**Streak lapse boundary** (rule: resets if `lastDate` is before `today - 1 day`):

| Test | Last Quiz Date | Streak Result | Boundary Position |
|---|---|---|---|
| `bva_streak_1DayAgo_onBoundary_streakPreserved` | yesterday | **preserved** | **On the boundary** |
| `bva_streak_2DaysAgo_justPastBoundary_streakReset` | 2 days ago | **reset to 0** | **Just past boundary** |

### 3. Integration Testing
**File:** `UserIntegrationTest.java`

Uses `@SpringBootTest` to load the **entire application** — all layers together — backed by the H2 in-memory database. Unlike unit or web layer tests, no components are mocked. This validates that the full request → controller → service → repository → database → response pipeline works.

### 4. Web Layer / API Simulation (MockMvc)
**Files:** `UserControllerTest.java`, `QuizControllerTest.java`, `AdminControllerTest.java`, etc.

Uses `@WebMvcTest` + `MockMvc` to simulate HTTP requests without starting a real Tomcat server. Tests verify that:
- Correct HTTP status codes are returned (200, 201, 400, 401, 403, 404, 409).
- Role-based access control works (`ADMIN` vs `USER`).
- Security configuration (`SecurityConfig`, `JwtFilter`) is correctly loaded.

---

## 3. Branch Coverage (Jacoco) + Understanding the Report

Jacoco is configured in `pom.xml` to run on every `mvn test`. Following the final expansion, the overall instruction coverage has reached **~50%**.

### How to Read the Jacoco index.html report

When you open the report at `target/site/jacoco/index.html`, you see a table with one row per Java package. Here is what **every single column** means:

| Column | Course Concept | What it means |
|---|---|---|
| **Element** | — | The Java package name. Click it to drill down into individual classes |
| **Missed Instructions** | Statement Coverage | How many individual Java bytecode instructions were NOT executed by any test |
| **Cov. (Instructions)** | Statement Coverage | The % of statements that WERE executed. This is your statement coverage score |
| **Missed Branches** | Branch Coverage | How many `if/else` decision points had at least one path (true OR false) never taken by a test |
| **Cov. (Branches)** | Branch Coverage | The % of `if/else` branches that were fully exercised. This is your branch coverage score |
| **Missed / Cxty** | Cyclomatic Complexity | How many independent paths exist in code that were not tested. High complexity = harder to test |
| **Missed / Lines** | Statement Coverage | How many source code lines were not touched by any test |
| **Missed / Methods** | — | How many methods (functions) were never called by any test |
| **Missed / Classes** | — | How many entire classes (Java files) were never loaded during testing |

### The Colour Coding Inside Individual Class Files

When you click into a package → then into a class (e.g. `UserServiceImpl`), Jacoco shows you the actual source code with coloured highlighting:

- 🟢 **Green line** = Statement was executed AND all branches (true/false) were taken → **Full coverage**
- 🟡 **Yellow line (diamond)** = Statement was executed, BUT not all branches were taken. For example, an `if` was tested when `true` but never when `false` → **Partial branch coverage**
- 🔴 **Red line** = Statement was never executed by any test at all → **No coverage**

### Mapping to the Coverage Levels from Your Slides

| Slide Concept | Jacoco Column | Our Result |
|---|---|---|
| **Statement Coverage** | `Cov.` (Instructions) | **~50% overall**; ~81% for Quiz module |
| **Branch Coverage** | `Cov.` (Branches) | **~35% overall**; ~54% for Quiz module |
| **Path Coverage** | ❌ Not measured | Not feasible — 2ⁿ combinations |

> *"Statement coverage and branch coverage were automatically measured using the Jacoco Maven plugin. The generated HTML report at `target/site/jacoco/index.html` provides a colour-coded breakdown of every class, showing which lines and conditional branches were exercised by the test suite. Path coverage was not pursued, as it is computationally infeasible for real-world systems — a method with just 5 conditionals yields up to 32 unique execution paths."*

---

## 4. Final Coverage Metrics (Successive Expansion)

The overall % is an **average across all packages**. Untested modules pull the whole figure down. Since our expansion, nearly all core modules now have coverage:

| Package | Statement Coverage | Status |
|---|---|---|
| `quiz` | **78%** | Fully tested |
| `shop` | **68%** | Tested during expansion |
| `draft` | **60%** | Tested during expansion |
| `user` | **58%** | Fully tested |
| `security` | **72%** | Covered indirectly via controller tests |
| `admin` | **46%** | Tested during expansion |
| `lesson` | **26%** | Tested during expansion |
| **Overall** | **~50%** | **Goal Met!** |

---

## 5. Testing Concept Checklist for Your Report

| Concept | ✅ Covered | Evidence |
|---|---|---|
| Unit Testing (Mockito) | ✅ | `UserServiceImplTest` — 26 isolated tests |
| AAA Pattern | ✅ | Arrange/Act/Assert comments in all test files |
| Positive Testing | ✅ | All valid-input happy-path tests |
| Negative Testing | ✅ | Exception-throwing and error-response tests |
| Equivalence Partitioning | ✅ | Valid/Invalid username, email, password groups |
| Boundary Value Analysis | ✅ | 5 dedicated BVA tests with boundary tables |
| Integration Testing | ✅ | `UserIntegrationTest` — 4 full-stack tests |
| Repository Testing | ✅ | `UserRepositoryTest`, `QuizRepositoryTest` |
| Web Layer / API Testing | ✅ | `UserControllerTest`, `QuizControllerTest` |
| Security Testing | ✅ | `@WithMockUser(roles="ADMIN")` vs `"USER"` |
| Statement Coverage | ✅ | Jacoco `Cov.` (Instructions) column |
| Branch Coverage | ✅ | Jacoco `Cov.` (Branches) column |

---

## 6. How to Run

```powershell
# Run all 118 tests and generate the Jacoco HTML coverage report
mvn test

# Open the coverage report in Chrome:
# C:\CS203T1\target\site\jacoco\index.html
```
