# Alpha Decode

Alpha Decode is a gamified web application designed to help users master "Gen Alpha" slang.

**[☁️ Play Alpha Decode Live!](https://alpha-decode.wittydesert-fcae5fd0.southeastasia.azurecontainerapps.io/)**

## Features

* **Daily Drop:** A new slang term featured every day with definitions and usage examples.
* **Learning Path:** A gamified progression system with unlockable levels (e.g., Rizz 101, Ohio Lore).
* **Slang Dictionary:** A searchable glossary of terms with bookmarking capabilities.
* **Gamification:** Streak counters, Coins tracking, leaderboards, and a virtual shop.
* **Achievements:** Unlockable badges tied to user milestones and learning progress.
* **AI Integration:** AI-powered definitions and real-world usage examples and explanation.
* **Admin Dashboard:** Built-in tools for user management and content moderation.
* **Contributor Dashboard:** Built-in tools for sending lesson contributions.
  
## Tech Stack

### Backend
* **Framework:** Spring Boot 3.2.5 (Java 21)
* **Database:** PostgreSQL (Prod) / H2 (Dev)
* **Security:** Spring Security + JWT
* **Other:** Spring AI (Gemini APIs), Swagger/OpenAPI

### Frontend
* **Framework:** React 19 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4, Framer Motion
* **Icons:** Lucide React

## Local Development

While Alpha Decode is deployed on the cloud, you can also spin it up locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Lim-JL/CS203T1.git
    cd CS203T1
    ```

2.  **Run Backend (Spring Boot):**
    Open your terminal in the root folder and run:
    ```bash
    mvn spring-boot:run
    ```

3.  **Run Frontend (Vite):**
    Open a new terminal, navigate to the frontend folder, and run:
    ```bash
    cd frontend
    npm run dev
    ```

*(Access the UI at `http://localhost:5173` and the Backend API at `http://localhost:8080`)*
