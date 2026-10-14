# Daily DSA Mistake Log

A full-stack web application designed for software engineers and Java developers to record, categorize, review, and learn from mistakes made while solving Data Structures and Algorithms (DSA) problems.

---

## 🚀 Key Features

- **Mistake Journaling Form**: Capture problem identity (platform, URL, topic), initial failed intuition, failure root cause, optimal approach, mental triggers, asymptotic complexities, and review schedule.
- **Mistake Categorization**: Categorize errors into 7 failure archetypes:
  - Wrong algorithm / assumption
  - Implementation / syntax
  - Edge case
  - Time complexity
  - Space complexity
  - Misunderstood problem
  - Other
- **Review Workflow**: Simple 3-stage lifecycle (`Not reviewed`, `Needs another review`, `Reviewed`), independent solve tracking, and review notes.
- **Analytics & Insights**:
  - Mistakes timeline over time (7, 14, 30 days)
  - Distribution breakdown by failure category (Donut and Bar charts)
  - Topic distribution analysis
  - Review completion velocity
- **Search, Multi-Filter & Pagination**: Dynamic JPA Specification queries supporting multi-criteria filtering by topic, platform, category, date range, and search keyword with backend pagination.
- **Modern Responsive Dark UI**: Built with a sleek dark aesthetic, responsive sidebar for desktop & offcanvas for mobile, and instant light/dark mode toggle.

---

## 🛠️ Architecture & Tech Stack

```
DailyDSAMistakeLog/
├── backend/                  # Java 21 + Spring Boot 3.3.4 REST API
│   ├── sql/schema.sql        # Documented MySQL Schema
│   └── src/
│       ├── main/java/com/dsa/mistakelog/
│       │   ├── config/       # CORS, DataInitializer (canonical seeds)
│       │   ├── controller/   # REST endpoints (@RestController)
│       │   ├── dto/          # Request & Response DTOs, Bean Validation
│       │   ├── entity/       # JPA Entities & Enums
│       │   ├── exception/    # Global Exception Handler (@RestControllerAdvice)
│       │   ├── repository/   # Spring Data JPA Repositories & Specifications
│       │   └── service/      # Business logic & Database aggregations
│       └── test/             # JUnit 5, Mockito & Integration Test Suite
├── frontend/                 # React 19 + Vite 6 + Bootstrap 5 SPA
│   └── src/
│       ├── components/       # Reusable UI (Form, Modals, Badges, StatCards)
│       ├── context/          # ThemeContext (Dark/Light), ToastContext
│       ├── layouts/          # Responsive App Layout (Navbar, Sidebar)
│       ├── pages/            # Dashboard, Add, Edit, Details, History, Analytics
│       ├── services/         # Axios API Client
│       └── utils/            # Constants & Formatters
└── README.md
```

### Backend
- **Java 21 LTS**
- **Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate 6**
- **MySQL 8.x**
- **Jakarta Bean Validation**
- **Lombok**
- **JUnit 5 & Mockito** (20 automated unit & integration tests)

### Frontend
- **React 19** with **Vite**
- **Bootstrap 5** + Custom Modern CSS
- **React Router 7**
- **Axios** (Centralized API client with interceptors)
- **Recharts** (Interactive Area & Donut charts)
- **Lucide React** (Icons)

---

## 📋 Prerequisites

Before running the application, make sure you have:
1. **Java Development Kit (JDK 17 or 21)**: `java -version`
2. **Node.js (v18+) & npm**: `node -v` && `npm -v`
3. **MySQL Server (8.x)** running locally on port 3306

---

## 🗄️ MySQL Database Setup

1. Log into your MySQL server:
   ```bash
   mysql -u root -p
   ```

2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS dsa_mistake_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. (Optional) Run the schema script manually:
   ```bash
   mysql -u root dsa_mistake_log < backend/sql/schema.sql
   ```

### Database Environment Variables

Configure connection settings using environment variables or modify `backend/src/main/resources/application.properties`:

| Variable | Default Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/dsa_mistake_log?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` | JDBC Connection URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | *(blank)* | MySQL password |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed frontend origins |
| `APP_SEED_DATA_ENABLED` | `true` | Idempotently seed canonical examples |

---

## 🏃 Running the Application Locally

### 1. Start the Spring Boot Backend

From the repository root:

```bash
cd backend
./mvnw clean spring-boot:run
```

The backend server starts on **`http://localhost:8080`**.
On first startup, the database tables are verified and initial canonical examples (e.g., *Daily Temperatures*, *3Sum*, *LRU Cache*) are seeded automatically.

To run the backend test suite:
```bash
cd backend
./mvnw test
```

### 2. Start the React Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **`http://localhost:5173`**.

---

## 📡 REST API Reference

### Mistakes CRUD

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/api/mistakes` | Create a new mistake log | `201 Created` |
| `GET` | `/api/mistakes` | Paginated and filtered mistake list | `200 OK` |
| `GET` | `/api/mistakes/{id}` | Retrieve single mistake by ID | `200 OK` / `404` |
| `PUT` | `/api/mistakes/{id}` | Update an existing mistake | `200 OK` / `400` / `404` |
| `DELETE` | `/api/mistakes/{id}` | Delete a mistake | `204 No Content` / `404` |
| `PATCH` | `/api/mistakes/{id}/review` | Update review status and notes | `200 OK` / `404` |

#### Filtering & Search Query Parameters for `GET /api/mistakes`:
- `search` (string) — Case-insensitive search on problem name and notes
- `topic` (string) — Filter by topic (e.g. `Stack`, `Arrays`, `Two Pointers`)
- `mistakeType` (enum) — `WRONG_ALGORITHM`, `IMPLEMENTATION_SYNTAX`, `EDGE_CASE`, `TIME_COMPLEXITY`, `SPACE_COMPLEXITY`, `MISUNDERSTOOD_PROBLEM`, `OTHER`
- `platform` (string) — `LeetCode`, `HackerRank`, `GeeksforGeeks`, `Other`
- `reviewStatus` (enum) — `NOT_REVIEWED`, `NEEDS_ANOTHER_REVIEW`, `REVIEWED`
- `startDate` (ISO Date: `YYYY-MM-DD`)
- `endDate` (ISO Date: `YYYY-MM-DD`)
- `page` (int, default `0`)
- `size` (int, default `10`)
- `sort` (string, e.g. `createdAt,desc`, `problemName,asc`)

### Analytics & Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | KPI summary (total, weekly, reviewed, most frequent type, top 5 recent) |
| `GET` | `/api/dashboard/mistakes-by-type` | Grouped count by mistake archetype |
| `GET` | `/api/dashboard/mistakes-over-time?days=14` | Daily creation count timeline |
| `GET` | `/api/dashboard/mistakes-by-topic` | Grouped count by algorithmic topic |

---

## 💡 Canonical Seed Example: Daily Temperatures

The application automatically includes the classic canonical DSA mistake:

- **Problem**: Daily Temperatures (LeetCode)
- **Topic**: Stack
- **My First Approach**: Only check the next element in the temperatures array.
- **Why was it wrong?**: Assumed the next warmer day was always adjacent; problem asks for days until any warmer temperature in the future.
- **Mistake Type**: `WRONG_ALGORITHM`
- **Correct Approach**: Use a monotonic decreasing stack of indices.
- **Change Next Time**: Recognize next-greater-element pattern and apply monotonic stack.
- **Complexity**: Time `O(n)`, Space `O(n)`.

---

## 🛠️ Troubleshooting

- **Backend cannot connect to MySQL**:
  Ensure MySQL is running (`brew services list` or `systemctl status mysql`). Check database existence and credentials:
  ```bash
  mysql -u root -e "SHOW DATABASES LIKE 'dsa_mistake_log';"
  ```
- **CORS error in browser console**:
  Ensure frontend is accessing backend on configured origin `http://localhost:5173`. If using custom port, set `APP_CORS_ALLOWED_ORIGINS=http://localhost:<PORT>` in environment.
- **Port 8080 already in use**:
  Kill existing process or pass `SERVER_PORT=8081` when starting backend, and update `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8081/api`.

---

## 📄 License
MIT License. Open-source personal study and interview preparation tool.
