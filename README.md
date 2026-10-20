# Daily DSA Mistake Log

A secure, full-stack web application designed for software engineers and Java developers to record, categorize, review, and learn from mistakes made while solving Data Structures and Algorithms (DSA) problems.

---

## 🚀 Key Features

### 🔐 Complete Authentication & Authorization
- **User Registration**: Register securely with name, email, and password. Client-side and server-side validation, email normalization (trimmed, lowercase), and duplicate email conflict rejection.
- **Secure Authentication**: Authenticate using Spring Security with **BCrypt password hashing** (cost factor 10). Failed login attempts return a uniform error without disclosing account existence.
- **Stateless JWT Tokens**: Tokens signed using HMAC-SHA256 (`HS256`) with a 256-bit secret key. Validated natively using Spring Security's **OAuth2 Resource Server** with Nimbus JWT decoder.
- **Strict Multi-Tenant Data Isolation**: Every mistake record, search query, filter, and dashboard KPI is strictly scoped to the authenticated user on the database level. User A cannot view, update, delete, review, or aggregate User B's mistakes.
- **In-Memory Token Storage**: Access tokens are kept strictly in frontend memory (NOT in `localStorage`) to protect against persistent XSS token theft.
- **Profile & Credential Management**: View personal account details, update display name, and securely change password with current-password verification.

### 📝 Problem Journaling & Categorization
- **Mistake Journaling Form**: Capture problem identity (platform, URL, topic), initial failed intuition, failure root cause, optimal approach, mental triggers, asymptotic complexities, and review schedule.
- **7 Failure Archetypes**:
  - `WRONG_ALGORITHM`: Algorithmic misunderstanding or incorrect paradigm
  - `IMPLEMENTATION_SYNTAX`: Language-level logic or syntax mistake
  - `EDGE_CASE`: Missed boundary condition, empty inputs, single element, duplicates
  - `TIME_COMPLEXITY`: Suboptimal asymptotic complexity (e.g. $O(n^2)$ vs $O(n)$)
  - `SPACE_COMPLEXITY`: Memory limit exceeded or unneeded auxiliary allocations
  - `MISUNDERSTOOD_PROBLEM`: Read input/output constraints or questions incorrectly
  - `OTHER`: Unclassified mistake type
- **Spaced Review Workflow**: Track review stages (`NOT_REVIEWED`, `NEEDS_ANOTHER_REVIEW`, `REVIEWED`), independent solve tracking, and review takeaways.

### 📊 Personal Analytics Dashboard
### 🧠 Learn DSA Module ("Everyday Life First" Pedagogy)
- **13 Complete Curriculum Topics in Sequence**:
  1. Arrays and Strings
  2. Hashing
  3. Linked Lists
  4. Stacks and Queues
  5. Trees and Graphs
  6. Heap
  7. Greedy Algorithms
  8. Binary Search
  9. Backtracking
  10. Dynamic Programming
  11. Interviews
  12. Tools
- **Interactive 5-Stage Classroom Experience**:
  - **Stage A: GUESS**: Thought-provoking everyday life question with interactive choices to trigger curiosity before formal terms.
  - **Stage B: EXPLORE**: Relatable real-world analogies (gym lockers for arrays, contact books for hash maps, connected train coaches for linked lists, emergency rooms for priority heaps) paired with state-driven visualizers.
  - **Stage C: UNDERSTAND**: Plain-English definitions, internal memory architecture, step-by-step dry run trace tables, pseudocode, and clean tabbed Java/Python implementations.
  - **Stage D: PRACTICE**: Immediate-feedback concept check micro-quizzes with retry capability to verify comprehension.
  - **Stage E: REFLECT**: Core Invariant takeaway, common pitfall to avoid, contextual motivational quotes, and progressive hint ladder practice problems with direct mistake-logging integration.
- **Semantic Classroom Theme System**: Dedicated `--learn-*` design tokens ensuring optimal, accessible contrast in both light (`#FFF9F0` warm neutral) and dark (`#171923` deep slate) modes without page reload.
- **Contextual Motivational Quotes**: Every single learning point features a short, relevant quote (e.g., *"Hints help, copying hurts."*, *"Struggle builds logic."*, *"Debug your thinking first."*), anchored by the signature motto: **"Hints, not answers. Logic, not shortcuts."**
- **Progressive Hint Ladder**: Practice problems feature a multi-tier revelation system (Hint 1: Key Observation -> Hint 2: Data Structure & Pattern -> Hint 3: Algorithm Outline -> Full Solution Walkthrough). Direct integration with the mistake journal allows users to log a mistake with prefilled metadata in one click if stuck.
- **Interactive Visualizers**: State-driven React visualizers for Arrays & Two Pointers, Stacks (LIFO cafeteria plates), Queues (FIFO ticket counter), and Binary Search (dictionary range halving).
- **MySQL-Backed Progress Persistence**: User progress is stored securely in MySQL per authenticated user (`learning_progress` table) with unique constraints preventing duplicates. Real completion percentages and "Continue Learning" states are computed dynamically.

---

## 🛠️ Architecture & Tech Stack

```
DailyDSAMistakeLog/
├── backend/                              # Java 21 + Spring Boot 3.3.4 REST API
│   ├── sql/
│   │   ├── schema.sql                    # Complete consolidated MySQL schema (includes learning_progress)
│   │   └── migration_auth.sql            # Safe migration script for existing data
│   └── src/
│       ├── main/java/com/dsa/mistakelog/
│       │   ├── config/                   # SecurityConfig, JwtTokenService, UserDetailsService, CORS
│       │   ├── controller/               # AuthController, UserController, MistakeController, DashboardController, LearningProgressController, SpaWebController
│       │   ├── dto/                      # RegisterRequest, LoginRequest, AuthResponse, LearningProgressResponse, etc.
│       │   ├── entity/                   # User, Mistake, LearningProgress, UserRole, MistakeType, ReviewStatus
│       │   ├── exception/                # GlobalExceptionHandler (401, 403, 404, 400 JSON responses)
│       │   ├── repository/               # UserRepository, MistakeRepository, LearningProgressRepository
│       │   └── service/                  # AuthService, UserService, MistakeService, LearningProgressService
│       └── test/                         # 43 JUnit 5 & Mockito unit/integration tests
├── frontend/                             # React 19 + Vite 8 + Bootstrap 5 SPA
│   └── src/
│       ├── components/                   # ProtectedRoute, PublicOnlyRoute, Navbar, Sidebar, Modals, Forms
│       │   └── learn/                    # QuoteCard, EverydayAnalogyCard, ProgressiveHints, PracticeProblemCard, CodeTabs, visualizers/
│       ├── context/                      # AuthContext, ThemeContext, ToastContext
│       ├── data/                         # learnCurriculum.js (13 topics, everyday analogies, traces, quotes, practice problems)
│       ├── layouts/                      # MainLayout with responsive navbar and sidebar
│       ├── pages/                        # LoginPage, RegisterPage, ProfilePage, Dashboard, Mistakes, Analytics
│       │   └── learn/                    # LearnLandingPage.jsx, LearnTopicPage.jsx
│       ├── services/                     # Centralized Axios client with Bearer interceptor & LearnService
│       └── test/                         # 14 Vitest frontend tests (auth, 5-stage learn curriculum, progressive hints)
├── .env.example                          # Environment variables template
└── README.md
```

### Backend
- **Java 21 LTS**
- **Spring Boot 3.3.4**
- **Spring Security 6** with OAuth2 Resource Server (`spring-boot-starter-oauth2-resource-server`)
- **Nimbus JOSE JWT** (HMAC-SHA256 symmetric signing & decoding)
- **Spring Data JPA & Hibernate 6**
- **MySQL 8.x**
- **BCrypt Password Encoder**
- **Jakarta Bean Validation**
- **Lombok**
- **JUnit 5, Mockito & Spring Security Test** (43 automated unit & integration tests)

### Frontend
- **React 19** with **Vite 6**
- **Bootstrap 5** + Dark Mode Glassmorphic CSS tokens
- **React Router 7** (`ProtectedRoute`, `PublicOnlyRoute`, in-memory navigation)
- **Axios** (Centralized API client with in-memory Bearer token injection and 401 interception)
- **Recharts** (Interactive Area & Donut charts)
- **Lucide React** (Icons)
- **Vitest & React Testing Library** (Automated frontend auth testing)

---

## 🗄️ Database Design & Migration Safety

### Users Table (`users`)
```sql
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Mistakes Relationship (`mistakes.user_id`)
```sql
ALTER TABLE mistakes
    ADD COLUMN user_id BIGINT NOT NULL AFTER id,
    ADD CONSTRAINT fk_mistakes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    ADD INDEX idx_mistake_user_id (user_id);
```

### Safe Migration Strategy
If your database already contains mistake logs created prior to authentication:
1. The migration script `backend/sql/migration_auth.sql` creates the `users` table without modifying existing tables.
2. It provisions a designated system owner account:
   - **Email**: `system@dsamistakelog.com`
   - **Default Password**: `SystemUser@2026` (hashed with BCrypt)
3. It adds the `user_id` column as nullable first, assigns all existing legacy rows to `user_id = 1` (`system@dsamistakelog.com`), and then applies the `NOT NULL` constraint and foreign key index.
4. **No existing mistake records are deleted or orphaned.**

To apply the migration manually:
```bash
mysql -u root -p dsa_mistake_log < backend/sql/migration_auth.sql
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` or set these environment variables in your environment:

| Variable | Default Value | Description |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/dsa_mistake_log?...` | MySQL connection URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | *(blank)* | Database password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit (32-byte) hex key for HS256 JWT signing |
| `JWT_EXPIRATION_SECONDS` | `86400` (24 hours) | JWT access token validity period |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | CORS allowed origins |
| `MIGRATION_OWNER_EMAIL` | `system@dsamistakelog.com` | Account designated for legacy unowned records |
| `APP_SEED_DATA_ENABLED` | `true` | Seed canonical problem examples on startup |

> **Key Length Requirement**: HMAC-SHA256 (`HS256`) requires a signing key of at least 256 bits (32 bytes). To generate a cryptographically strong key:
> ```bash
> openssl rand -hex 32
> ```

---

## 🏃 Running the Application

### 1. Database Setup
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS dsa_mistake_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Start the Spring Boot Backend
```bash
cd backend
./mvnw clean spring-boot:run
```
The backend starts on `http://localhost:8080`.

To run all backend tests:
```bash
cd backend
./mvnw clean test
```
*(39 tests covering authentication, registration, login, JWT validation, password change, data isolation, and spec filtering).*

### 3. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`.

To run all frontend tests:
```bash
cd frontend
npm test
```
*(7 tests covering login validation, registration validation, protected route guards, in-memory token state, logout, and token expiration).*

---

## 📡 REST API Reference

### Authentication Endpoints (Public)

#### `POST /api/auth/register`
Register a new user account.
```json
// Request
{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "SecurePassword@123"
}

// Response (201 Created)
{
  "id": 2,
  "name": "Jane Developer",
  "email": "jane@example.com",
  "role": "USER",
  "createdAt": "2026-10-20T10:00:00"
}
```

#### `POST /api/auth/login`
Authenticate credentials and obtain signed JWT access token.
```json
// Request
{
  "email": "jane@example.com",
  "password": "SecurePassword@123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresInSeconds": 86400,
  "user": {
    "id": 2,
    "name": "Jane Developer",
    "email": "jane@example.com",
    "role": "USER",
    "createdAt": "2026-10-20T10:00:00"
  }
}
```

---

### User Profile Endpoints (Protected - Requires `Authorization: Bearer <token>`)

#### `GET /api/users/me`
Retrieve authenticated user profile.
```json
// Response (200 OK)
{
  "id": 2,
  "name": "Jane Developer",
  "email": "jane@example.com",
  "role": "USER",
  "createdAt": "2026-10-20T10:00:00"
}
```

#### `PUT /api/users/me`
Update editable profile attributes (e.g. `name`).
```json
// Request
{
  "name": "Jane D. Engineer"
}
```

#### `POST /api/users/me/change-password`
Change user password with current password verification.
```json
// Request
{
  "currentPassword": "SecurePassword@123",
  "newPassword": "NewStrongPassword@456"
}

// Response (200 OK)
{
  "message": "Password changed successfully"
}
```

---

### Mistakes Endpoints (Protected - User-Scoped)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/mistakes` | Create mistake log owned by authenticated user |
| `GET` | `/api/mistakes` | Paginated and filtered list of user's own mistakes |
| `GET` | `/api/mistakes/{id}` | Retrieve single mistake (ownership verified; 404 if owned by another user) |
| `PUT` | `/api/mistakes/{id}` | Update mistake (ownership verified) |
| `DELETE` | `/api/mistakes/{id}` | Delete mistake (ownership verified) |
| `PATCH` | `/api/mistakes/{id}/review` | Update review status and notes (ownership verified) |

---

### Dashboard & Analytics Endpoints (Protected - User-Scoped)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | KPI summary for current user only |
| `GET` | `/api/dashboard/mistakes-by-type` | Mistake counts by archetype for current user |
| `GET` | `/api/dashboard/mistakes-over-time?days=14` | Timeline history for current user |
| `GET` | `/api/dashboard/mistakes-by-topic` | Topic breakdown for current user |

---

### 📚 Learn DSA Progress Endpoints (Protected - User-Scoped)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/learn/progress` | Overall course progress, completed counts, topics started/completed, and last-viewed checkpoint |
| `GET` | `/api/learn/progress/{topicSlug}` | Topic-level completion breakdown and list of completed point IDs for the topic |
| `POST` | `/api/learn/progress/toggle` | Toggle completion status for a learning point (`{ learningPointId, topicSlug, lessonSlug }`) |
| `PUT` | `/api/learn/progress/points/{id}` | Explicitly set completion state for a learning point (`{ completed: true/false, topicSlug, lessonSlug }`) |
| `POST` | `/api/learn/progress/view` | Record last viewed checkpoint (`{ learningPointId, topicSlug, lessonSlug }`) for "Continue Learning" |

---

### 📖 How to Add New Lessons to Learn DSA

The course curriculum is centrally defined in [`frontend/src/data/learnCurriculum.js`](frontend/src/data/learnCurriculum.js). It adheres strictly to the **15-Step Pedagogy**:

1. Open `frontend/src/data/learnCurriculum.js`.
2. Locate the relevant topic object in `LEARN_CURRICULUM` (e.g. `arrays-and-strings` or add a new topic).
3. Add a lesson entry to `topic.lessons`:
```javascript
{
  id: "your-lesson-slug",
  slug: "your-lesson-slug",
  title: "Lesson Title",
  summary: "Brief beginner summary",
  points: [
    {
      id: "unique-point-id",
      title: "Learning Point Title",
      quote: "One concept, many applications.", // Contextual quote
      everydayAnalogy: {
        title: "Relatable Everyday Metaphor",
        scenario: "Describe the real-life analogy without technical jargon first..."
      },
      theProblem: "The core challenge this data structure or algorithm solves",
      theIntuition: "The common-sense intuition behind the solution",
      formalConcept: "Formal DSA definition and invariant",
      internalWorking: "Memory layout, pointers, or register operations",
      dryRunSteps: [{ step: 1, label: "Initial State", value: "..." }],
      pseudocode: `// Clean step-by-step logic`,
      codeExamples: {
        java: `// Production-grade Java implementation`,
        python: `# Clean Python 3 implementation`
      },
      complexity: {
        time: "O(n)",
        space: "O(1)",
        details: "Explain why time and auxiliary space take these values"
      },
      commonMistakes: [
        { mistake: "Common edge-case trap", fix: "How to avoid or guard against it" }
      ],
      practiceProblems: [
        {
          id: "problem-1",
          title: "LeetCode Problem Name",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/...",
          relevance: "Why this problem reinforces the topic",
          hints: [
            "Hint 1: Key observation",
            "Hint 2: Data structure or pattern",
            "Hint 3: Algorithm outline",
            "Full Solution: Walkthrough and explanation"
          ]
        }
      ]
    }
  ]
}
```
4. All progress tracking, completion toggles, visualizer mappings, and metrics will automatically integrate without modifying database schemas!

---

### Error Response Format
All errors return consistent JSON responses without exposing stack traces:
```json
{
  "timestamp": "2026-10-20T14:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/api/mistakes"
}
```

---

## 🔒 Security Decisions & Token Lifecycle

1. **In-Memory Access Tokens**:
   - The JWT access token is stored strictly in React state (`AuthContext`) and never persisted to `localStorage` or `sessionStorage`.
   - This provides defense-in-depth against XSS token harvesting.
   - *Token Lifecycle Note*: A full browser page refresh clears the in-memory token in v1, prompting the user to re-authenticate. When refresh-token support is introduced in a future release, it can utilize an `HttpOnly`, `SameSite=Strict` cookie paired with CSRF validation without altering this access token architecture.
2. **Stateless API & CSRF**:
   - Because the API uses `Authorization: Bearer <token>` headers instead of session cookies, CSRF protection is safely disabled for stateless REST endpoints per standard Spring Security recommendations.
3. **No Password Hashes in API Responses**:
   - Password hashes are never serialized into DTOs or sent over HTTP.
4. **Data Isolation Enforcement**:
   - All database queries filter directly by `User` entity (`findByIdAndUser`, `countByUser`, `MistakeSpecification.withCriteriaAndUser`).
   - Client-provided IDs in request bodies are ignored in favor of the resolved `SecurityContext` principal.

---

## 📄 License
MIT License. Built for rigorous DSA preparation and software engineering interview practice.
