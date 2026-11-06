# ==========================================
# Stage 1: Build React Vite Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build Spring Boot Backend
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B || true

COPY backend/src ./src

# Inject built frontend static files into Spring Boot static folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# ==========================================
# Stage 3: Minimal Production JRE Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Render assigns port dynamically via $PORT
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=dev
ENV AI_PROVIDER=demo

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]

