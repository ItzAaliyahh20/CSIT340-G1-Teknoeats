# 🍽 TeknoEats - School Canteen Ordering System

A modern full-stack web application for managing school canteen orders, built with **React**, **Spring Boot**, and **MySQL**.

---

## 📋 Table of Contents
- Features  
- Tech Stack  
- Prerequisites  
- Installation  
- Configuration  
- Running the Application  
- Project Structure  
- API Endpoints  
- Troubleshooting  
- Development Notes  
- Security Notes  
- User Roles  
- Contributing  
- Acknowledgments  

---

## ✨ Features
- 🔐 **User Authentication** – Secure signup and login system  
- 👥 **Role-Based Access** – Customer, Canteen Personnel, and Admin roles  
- 🎨 **Modern UI** – Clean, responsive design with smooth animations  
- 🔒 **Form Validation** – Client-side and server-side validation  
- 📱 **Mobile Responsive** – Works seamlessly on all devices  

---

## 🛠 Tech Stack

### Frontend
- React 18+ – UI library  
- React Router – Client-side routing  
- Axios – HTTP client  
- Lucide React – Icon library  
- CSS3 – Styling with gradients and animations  

### Backend
- Spring Boot 3.5.6 – Java framework  
- Spring Data JPA – Database abstraction  
- Spring Security – Authentication & authorization  
- Hibernate – ORM  
- Maven – Dependency management  

### Database
- MySQL 8.0+ – Relational database  

---

## 📦 Prerequisites
Before you begin, ensure you have the following installed:

- [Node.js (v16 or higher)](https://nodejs.org/)  
- [Java JDK (17 or 21)](https://adoptium.net/)  
- [MySQL (8.0+)](https://dev.mysql.com/downloads/)  
- [Maven (3.6+)](https://maven.apache.org/download.cgi)  
- IntelliJ IDEA or VS Code (optional but recommended)

---

## 🚀 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/teknoeats.git
cd teknoeats
```

### 2️⃣ Database Setup
```bash
CREATE DATABASE teknoeats_db;
USE teknoeats_db;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('Customer','Canteen_Personnel','Admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

CREATE USER 'teknoeats'@'localhost' IDENTIFIED BY 'teknoeats123';
GRANT ALL PRIVILEGES ON teknoeats_db.* TO 'teknoeats'@'localhost';
FLUSH PRIVILEGES;
```

### 3️⃣ Backend Setup
```bash
cd backend
mvn clean install
```

### 4️⃣ Frontend Setup
```bash
cd frontend
npm install
```
---

## ⚙ Configuration

### Backend Configuration
Edit backend/src/main/resources/application.properties:
```bash
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/teknoeats_db
spring.datasource.username=teknoeats
spring.datasource.password=teknoeats123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### Frontend Configuration
In frontend/src/services/api.js:
```bash
const API_BASE_URL = 'http://localhost:8080/api';
export default API_BASE_URL;
```
---
## 🏃 Running the Application
### Start Backend
Option 1 – IntelliJ IDEA

1. Open backend folder
2. Wait for Maven to load dependencies
3. Run BackendApplication.java

Option 2 – Command Line
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

---
## 📁 Project Structure
```bash
teknoeats/
├── backend/
│   ├── src/
│   │   ├── main/java/com/teknoeats/backend/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── config/
│   │   │   └── BackendApplication.java
│   │   └── resources/application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── services/api.js
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md
```
---
## 🔌 API Endpoints
### Authentication
POST /api/auth/signup
Registers a new user
```bash
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "09123456789",
  "password": "password123",
  "role": "Customer"
}
```
### Response
```bash
{
  "message": "Login successful",
  "userId": 1,
  "email": "john@example.com",
  "role": "Customer"
}
```

---
## 🐛 Troubleshooting
### Backend Issues
#### MySQL Connection Error
Access denied for user 'root'@'localhost'
✔ Fix: Update application.properties with correct credentials.
#### Port 8080 Already in Use
✔ Fix: Stop any process using port 8080 or set server.port=8081.

---
### Frontend Issues
Cannot Connect to Backend
✔ Fix:
- Make sure backend is running on port 8080
- Check CORS setup
- Verify API_BASE_URL in api.js

#### npm Install Errors
```bash
npm install --legacy-peer-deps
```

---
## 📝 Development Notes
- Create backend models, repositories, services, and controllers for new features.
- Update frontend services when backend endpoints change.
- Use Postman or Thunder Client to test APIs.
- Hibernate auto-updates database schema with ddl-auto=update.
---

## 🔒 Security Notes
### ⚠ Development Mode:
- Passwords stored in plain text
- No JWT or CSRF protection
### 🔐 For Production:
- Use BCrypt password hashing
- Add JWT authentication
- Enable CSRF protection
- Use HTTPS and rate limiting

---
## 👥 User Roles
- Customer: Browse menu, place orders
- Canteen Personnel: Manage orders, update menu
- Admin: Manage users and the entire system

---
## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

---
## 🙏 Acknowledgments
- Spring Boot Documentation
- React Documentation
- MySQL Documentation
- Stack Overflow Community
```bash

---
✅ You can now:
1. Copy everything above  
2. Paste it into your VS Code file named **`README.md`**  
3. Save, then commit and push:
   ```bash
   git add README.md
   git commit -m "Add detailed README for TeknoEats project"
   git push origin main
```