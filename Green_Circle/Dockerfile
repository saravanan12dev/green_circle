# Step 1: Build using a standard Ubuntu image with Java 25 installed via SDKMAN
FROM ubuntu:24.04 AS build
ENV SDKMAN_DIR=/root/.sdkman
RUN apt-get update && apt-get install -y curl unzip zip git openjdk-21-jdk && \
    curl -s "https://get.sdkman.io" | bash && \
    /bin/bash -c "source $SDKMAN_DIR/bin/sdkman-init.sh && sdk install java 25-open"
WORKDIR /app
COPY . .
RUN chmod +x mvnw && /bin/bash -c "source $SDKMAN_DIR/bin/sdkman-init.sh && ./mvnw clean package -DskipTests"

# Step 2: Run using a generic openjdk runtime that supports Java 25 bytecode
FROM openjdk:25-ea-slim-bookworm
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]