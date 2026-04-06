# Alpha Decode

Alpha Decode is a gamified web application designed to help users master "Gen Alpha" slang (e.g., *Rizz*, *Fanum Tax*, *Skibidi*). Built with a modern React stack, it mimics the engagement mechanics of popular language learning apps like Duolingo, while incorporating AI-powered insights and comprehensive progression systems.

**[☁️ Play Alpha Decode Live!](https://alpha-decode.wittydesert-fcae5fd0.southeastasia.azurecontainerapps.io/)**

## Core Features & Architecture

Alpha Decode provides a modern, robust platform spanning a high-performance Java backend and an interactive React frontend:

* **Daily Drop & Gamified Learning Path:** Users unlock curated dictionary lists (like "Rizz 101" or "Ohio Lore") as they progress. Each "Daily Drop" introduces trending slang with rich contextual sentences.
* **Interactive Slang Dictionary & Bookmarks:** A fully searchable, paginated dictionary that allows users to seamlessly bookmark slang terms to their personal profile for later review.
* **Advanced Gamification Engine:** Driven by a Spring Boot scheduled task and background jobs, the app actively monitors and rewards user consistency via daily streaks, XP accumulation, and a dynamic leaderboard ranking top learners.
* **Virtual Shop & Economy:** Users earn coins and XP upon completing lessons or daily tasks, which can be spent in the Shop to unlock exclusive user avatars and customized cosmetic items.
* **AI-Powered Integrations:** Leveraging Google Gemini's AI ecosystem (via Spring AI), the app can intelligently generate accurate definitions, realistic usage contexts, and assists in automated content moderation.
* **Comprehensive Admin Dashboard:** An authenticated, role-based admin panel enabling moderators to manage users, track application telemetry, and gracefully handle flagged content to maintain a safe learning environment.

## Tech Stack

### Backend
* **Core Framework:** Spring Boot 3.2.5 with Java 21 LTS
* **Security & Auth:** Spring Security with stateless JWT (JSON Web Tokens) for secure, scalable session management.
* **Data Persistence:** Spring Data JPA / Hibernate, mapped to a PostgreSQL database for production and an in-memory H2 database for local development.
* **AI Integration:** Google Gemini Generative AI API integrations.
* **API Documentation:** Auto-generated Swagger / OpenAPI endpoints.
* **Build Tooling:** Apache Maven 3.x

### Frontend
* **Core Framework:** React 19 optimized with Vite for lightning-fast build and hot-reload times.
* **Language:** Strictly typed TypeScript to maintain robust structural integrity across models and API responses.
* **Styling & Animation:** Tailwind CSS v4 for utility-first responsive styling and Framer Motion for buttery-smooth micro-animations.
* **Routing:** Client-side routing mapped natively via React Router DOM.
* **Icons:** Lucide React for consistent and lightweight iconography.

## Local Development

While Alpha Decode is deployed on the cloud, you can also spin it up locally for development and testing.

### Prerequisites

* **Java Development Kit (JDK) 21**
* **Apache Maven 3.x**
* **Node.js & npm** (Optional but recommended for frontend development)

### Getting Started

This project is configured with the `frontend-maven-plugin`. Maven will automatically download Node.js, build the React app, and serve it via the Spring Boot server.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Lim-JL/CS203T1.git
    cd CS203T1
    ```

2.  **Run in Developer Mode (Hot Reloading):**
    If you are working on the UI and want instant updates without restarting Java:

    * **Terminal 1 (Backend):**
      ```bash
      mvn spring-boot:run
      ```
    * **Terminal 2 (Frontend):**
      ```bash
      cd frontend
      npm run dev
      ```
    *Access the frontend at `http://localhost:5173` and the backend api at `http://localhost:8080`.*

3.  **Run Production Build Locally:**
    Alternatively, run everything combined in one command:
    ```bash
    mvn spring-boot:run
    ```
    *Access the fully integrated app at `http://localhost:8080`.*