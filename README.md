🍽️ TeknoEats - School Canteen Ordering System
A modern full-stack web application for managing school canteen orders, built with React, Spring Boot, and MySQL.

✨ Features
🔐 User Authentication - Secure signup and login system
👥 Role-Based Access - Customer, Canteen Personnel, and Admin roles
🎨 Modern UI - Clean, responsive design with smooth animations
🔒 Form Validation - Client-side and server-side validation
📱 Mobile Responsive - Works seamlessly on all devices

🛠️ Tech Stack
Frontend
React 18+ - UI library
React Router - Client-side routing
Axios - HTTP client
Lucide React - Icon library
CSS3 - Styling with gradients and animations
Backend
Spring Boot 3.5.6 - Java framework
Spring Data JPA - Database abstraction
Spring Security - Authentication & authorization
Hibernate - ORM
Maven - Dependency management
Database
MySQL 8.0+ - Relational database

📦 Prerequisites
Before you begin, ensure you have the following installed:
Node.js (v16 or higher) - Download
Java JDK (17 or 21) - Download
MySQL (8.0+) - Download
Maven (3.6+) - Download
IntelliJ IDEA or VS Code - IDE (optional but recommended)

🚀 Installation
1. Clone the Repository
bash
git clone https://github.com/ItzAaliyahh20/CSIT340-G1-Teknoeats.git
cd CSIT340-G1-Teknoeats
2. Database Setup
Open MySQL Workbench and run:
sql
-- Create database
CREATE DATABASE teknoeats_db;
USE teknoeats_db;

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('Customer', 'Canteen_Personnel', 'Admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

-- Create MySQL user for the app (recommended)
CREATE USER 'teknoeats'@'localhost' IDENTIFIED BY 'teknoeats123';
GRANT ALL PRIVILEGES ON teknoeats_db.* TO 'teknoeats'@'localhost';
FLUSH PRIVILEGES;
3. Backend Setup
bash
cd backend
Install dependencies (Maven will auto-download):
bash
mvn clean install
4. Frontend Setup
bash
cd frontend
npm install

⚙️ Configuration
Backend Configuration
Edit backend/src/main/resources/application.properties:
properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/teknoeats_db
spring.datasource.username=teknoeats
spring.datasource.password=teknoeats123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
Frontend Configuration
The API base URL is configured in frontend/src/services/api.js:
javascript
const API_BASE_URL = 'http://localhost:8080/api';
Change this if your backend runs on a different port.

🏃 Running the Application
Start Backend (Option 1: IntelliJ IDEA)
Open the backend folder in IntelliJ
Wait for Maven to download dependencies
Find BackendApplication.java
Right-click → Run 'BackendApplication'
Start Backend (Option 2: Command Line)
bash
cd backend
mvn spring-boot:run
Backend will start at: http://localhost:8080
Start Frontend
bash
cd frontend
npm start
Frontend will start at: http://localhost:3000

📁 Project Structure
CSIT340-G1-Teknoeats/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/teknoeats/backend/
│   │   │   │   ├── model/
│   │   │   │   │   └── User.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   └── UserService.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── AuthController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── SignupRequest.java
│   │   │   │   │   └── AuthResponse.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)

🔌 API Endpoints
Authentication
POST /api/auth/signup
Register a new user
Request Body:
json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "09123456789",
  "password": "password123",
  "role": "Customer"
}
Response:
json
{
  "message": "User registered successfully",
  "userId": 1,
  "email": "john@example.com",
  "role": "Customer"
}
POST /api/auth/login
Authenticate user
Request Body:
json
{
  "username": "john@example.com",
  "password": "password123"
}
Response:
json
{
  "message": "Login successful",
  "userId": 1,
  "email": "john@example.com",
  "role": "Customer"
}

🐛 Troubleshooting
Backend Issues
MySQL Connection Error
Access denied for user 'root'@'localhost'
Solution: Update application.properties with correct MySQL credentials
Port 8080 Already in Use
Port 8080 was already in use
Solution:
Stop other applications using port 8080
Or change port in application.properties: server.port=8081
Frontend Issues
Cannot Connect to Backend
Network Error
Solution:
Ensure backend is running on port 8080
Check CORS configuration
Verify API_BASE_URL in api.js
npm Install Errors
npm ERR! code ERESOLVE
Solution:
bash
npm install --legacy-peer-deps
Database Issues
Table Doesn't Exist
Solution: Ensure spring.jpa.hibernate.ddl-auto=update in application.properties
Data Shows as NULL
Solution:
Check browser console (F12) for errors
Verify api.js file exists in src/services/
Ensure axios is installed: npm install axios

📝 Development Notes
Adding New Features
Create model in backend/model/
Create repository in backend/repository/
Create service in backend/service/
Create controller in backend/controller/
Update frontend API service
Database Changes
Run SQL commands in MySQL Workbench or let Hibernate auto-update with ddl-auto=update
Testing API
Use Postman or Thunder Client (VS Code extension) to test endpoints

🔒 Security Notes
⚠️ Current Implementation:
Passwords are stored in plain text (for development only)
No JWT authentication
CSRF protection disabled
🔐 For Production:
Implement BCrypt password hashing
Add JWT token authentication
Enable CSRF protection
Use HTTPS
Add rate limiting
Implement proper session management

👥 User Roles
Customer - Browse menu, place orders
Canteen Personnel - Manage orders, update menu
Admin - Full system access, user management

🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request


