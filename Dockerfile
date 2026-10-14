# Multi-stage Dockerfile: Bundles React Frontend + Spring Boot Backend into a Single Runnable Web Application

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend with bundled Frontend static assets
FROM maven:3.9.8-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/src ./backend/src/
# Inject built React static files directly into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist/ ./backend/src/main/resources/static/
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
