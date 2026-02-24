# Alpha Decode

Alpha Decode is a gamified web application designed to help users master "Gen Alpha" slang (e.g., *Rizz*, *Fanum Tax*, *Skibidi*). Built with a modern React stack, it mimics the engagement mechanics of popular language learning apps like Duolingo.

## Features

* **Daily Drop:** A new slang term featured every day with definitions and usage examples.
* **Learning Path:** A gamified progression system with locked/unlocked levels (Rizz 101, Ohio Lore, etc.).
* **Slang Dictionary:** A searchable glossary of terms.
* **Gamification:** Streak counters, XP tracking, and visual progress indicators.

## Tech Stack

### Backend
* **Framework:** Spring Boot 3.2.5
* **Language:** Java 21
* **Build Tool:** Maven 3.x
* **Database:** H2 (Dev) / MySQL (Prod)
* **API Docs:** Swagger / OpenAPI

### Frontend
* **Framework:** React 19 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React

## Prerequisites

Ensure you have the following installed before running the project:

* **Java Development Kit (JDK) 21**
    * Verify with: `java -version`
* **Apache Maven 3.x**
    * Verify with: `mvn -version`
* **Node.js & npm** (Optional - Maven handles this automatically, but good for debugging)

## ⚡ Setup Guide (The "One Command" Way)

This project is configured with the `frontend-maven-plugin`. Maven will automatically download Node.js, install frontend dependencies, build the React app, and serve it via the Spring Boot server.

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd CS203T1
    ```

2.  **Run the Application**
    Open your terminal in the root folder (where `pom.xml` is) and run:
    ```bash
    mvn spring-boot:run
    ```

    *What happens next?*
    * Maven downloads Java dependencies.
    * Maven installs Node/npm locally (inside the folder).
    * Maven runs `npm run build` for the frontend.
    * Spring Boot starts the server.

3.  **Access the App**
    * **Main Website:** `http://localhost:8080` (Your React App is served here!)
    * **API Documentation:** `http://localhost:8080/swagger-ui/index.html`

## Developer Mode (Hot Reloading)

If you are working on the UI and want instant updates without restarting Java:

1.  **Terminal 1 (Backend):**
    ```bash
    mvn spring-boot:run
    ```
2.  **Terminal 2 (Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
    *Access the frontend at `http://localhost:5173`.*