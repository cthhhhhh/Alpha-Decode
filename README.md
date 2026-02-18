# ALPHA-DECODE 🧠

> A Bauhaus-inspired Gen-Alpha Slang Learning Platform

ALPHA-DECODE is a web application that helps you test and improve your knowledge of Gen-Alpha internet slang and terminology — from *Skibidi* to *Fanum Tax*. Styled with bold Bauhaus design principles (geometric shapes, primary colours, hard shadows), the platform offers a fun and structured way to "decode the brainrot."

---

## 📄 Pages Overview

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Landing page with a hero section, diagnostic process overview, manifesto, and slang glossary teaser |
| **Assessment** | `/assessment` | Multi-step quiz to evaluate your Gen-Alpha slang fluency and calculate your "Brainrot Score" |
| **Lesson / Dictionary** | `/lesson` | Browse and learn 500+ Gen-Alpha terms categorised by type and social weight |
| **World Map** | `/world-map` | Gamified curriculum map showing unlockable learning worlds (e.g. The Slop Wasteland, Glazing Gulch) |
| **Dashboard** | `/dashboard` | Personal learning hub showing daily missions, world exploration progress, streak counter, and buddy status |

---

## 🛠️ Tech Stack

- **Java 21**
- **Spring Boot 3.2.5** (spring-boot-starter-web)
- **Thymeleaf** — server-side HTML templating
- **Tailwind CSS** (via CDN) — utility-first styling
- **Google Fonts** — Space Grotesk typeface
- **Google Material Symbols** — icon library
- **Maven** — build and dependency management

---

## ✅ Prerequisites

Make sure you have the following installed before running the project:

### 1. Java Development Kit (JDK) 21

Download from: https://www.oracle.com/java/technologies/downloads/#java21

Verify installation:
```bash
java -version
```
Expected output: `java version "21.x.x" ...`

---

### 2. Apache Maven

Download from: https://maven.apache.org/download.cgi

**Installation steps (Windows):**
1. Extract the downloaded archive (e.g. `apache-maven-3.x.x-bin.zip`) to a folder like `C:\Program Files\Maven`
2. Add `C:\Program Files\Maven\bin` to your system `PATH` environment variable
3. Verify installation:
```bash
mvn -version
```
Expected output: `Apache Maven 3.x.x ...`

> **Tip:** If you use IntelliJ IDEA or VS Code with the Spring Boot extension, Maven may already be bundled — no separate installation needed.

---

## 🚀 Running the Application

### Option A — Using Maven (Terminal)

1. Open a terminal and navigate to the project root:
```bash
cd path\to\CS203T1
```

2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

3. Open your browser and go to:
```
http://localhost:8080
```

---

### Option B — Using an IDE (IntelliJ IDEA / VS Code)

1. Open the project folder in your IDE
2. Locate the main application class:
   `src/main/java/com/alphadecode/AlphaDecodeAppApplication.java`
3. Click the **Run** button (▶) next to the `main` method
4. Open your browser and go to `http://localhost:8080`

---

## 📁 Project Structure

```
CS203T1/
├── src/
│   └── main/
│       ├── java/com/alphadecode/
│       │   ├── AlphaDecodeAppApplication.java   # Spring Boot entry point
│       │   └── controller/
│       │       └── PageController.java          # Route mappings
│       └── resources/
│           ├── templates/                        # Thymeleaf HTML pages
│           │   ├── index.html
│           │   ├── assessment.html
│           │   ├── lesson.html
│           │   ├── world-map.html
│           │   └── dashboard.html
│           └── application.properties
├── pom.xml                                       # Maven dependencies
└── README.md
```

---

## 📝 Notes

- The app uses **Tailwind CSS via CDN** — no local CSS build step is required.
- **Spring Boot DevTools** is included for hot-reload during development; changes to templates will reflect without a full restart.
- All pages are served as Thymeleaf templates via a single `PageController`.
