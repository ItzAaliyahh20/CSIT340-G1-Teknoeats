🍽️ TeknoEats: School Canteen Ordering System
A modern, full-stack web application designed to streamline the school canteen ordering process. Built with React for a dynamic front-end, Spring Boot for a robust back-end, and MySQL for persistent data management.

✨ Key Features
🔐 Secure User Authentication: A robust system for secure user sign-up and login.

👥 Role-Based Access Control: Distinct user experiences for Customer, Canteen Personnel, and Admin roles.

🎨 Modern & Responsive UI: A clean, engaging design built with CSS3, featuring smooth animations that work seamlessly on all devices.

🔒 Comprehensive Form Validation: Client-side and server-side validation ensures data integrity.

🛠️ Technology Stack
Category	Technology	Description
Frontend	React 18+	Primary UI library
React Router	Client-side navigation
Axios	HTTP requests
Lucide React	Icon library
CSS3	Styling with gradients and animations
Backend	Spring Boot 3.5.6	Java framework for application logic
Spring Security	Authentication and authorization
Spring Data JPA/Hibernate	ORM for database abstraction
Maven	Dependency management
Database	MySQL 8.0+	Relational database storage

Export to Sheets

📦 Prerequisites
Ensure you have the following software installed before proceeding with the installation:

Node.js: v16 or higher (for the React front-end)

Java JDK: 17 or 21 (for the Spring Boot back-end)

MySQL: 8.0+ (the primary database)

Maven: 3.6+ (for managing Java dependencies)

IDE (Optional): IntelliJ IDEA or VS Code is highly recommended for development.

🚀 Installation Guide
1. Clone the Repository
Open your terminal or command prompt and run the following:

Bash

git clone https://github.com/ItzAaliyahh20/CSIT340-G1-Teknoeats.git
cd CSIT340-G1-Teknoeats
2. Database Setup
Open MySQL Workbench or your preferred MySQL client and execute these SQL commands:

SQL

-- Create the main database
CREATE DATABASE teknoeats_db;
USE teknoeats_db;

-- Create a dedicated MySQL user for the application (Recommended)
CREATE USER 'teknoeats'@'localhost' IDENTIFIED BY 'teknoeats123';
GRANT ALL PRIVILEGES ON teknoeats_db.* TO 'teknoeats'@'localhost';
FLUSH PRIVILEGES;

-- The 'users' table structure is defined here
-- The remaining tables will be automatically created by Hibernate (JPA)
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

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
3. Backend Setup (Spring Boot)
Navigate to the backend directory and install dependencies. Maven will automatically download all required components.

Bash

cd backend
mvn clean install
4. Frontend Setup (React)
Navigate to the frontend directory and install the Node.js dependencies:

Bash

cd ../frontend
npm install
⚙️ Configuration
Backend Configuration
The database and server settings are managed in backend/src/main/resources/application.properties.

Key Settings:

Setting	Value	Notes
server.port	8080	Default server port
spring.datasource.username	teknoeats	Must match the user created in Step 2
spring.datasource.password	teknoeats123	Must match the password created in Step 2
spring.jpa.hibernate.ddl-auto	update	Allows Hibernate to auto-create/update tables
spring.web.cors.allowed-origins	http://localhost:3000	Allows the React front-end to connect

Export to Sheets

Note: If you used different credentials during the database setup, you must update the spring.datasource.username and spring.datasource.password fields here.

Frontend Configuration
The API base URL is configured in frontend/src/services/api.js. Change this if you run the backend on a different port than 8080.

JavaScript

const API_BASE_URL = 'http://localhost:8080/api';
🏃 Running the Application
Start Backend
You can run the backend using an IDE or the command line.

Option 1: Command Line (Recommended for quick start)

Bash

cd backend
mvn spring-boot:run
The backend API will start at: http://localhost:8080

Option 2: IntelliJ IDEA

Open the backend folder in IntelliJ.

Wait for Maven to finish downloading dependencies.

Locate BackendApplication.java and Right-click → Run 'BackendApplication'.

Start Frontend
Navigate to the frontend directory and start the React development server:

Bash

cd frontend
npm start
The application will open in your browser at: http://localhost:3000

🔌 API Endpoints (Authentication)
Endpoint	Method	Function
/api/auth/signup	POST	Register a new user with a specified role.
/api/auth/login	POST	Authenticate an existing user.

Export to Sheets

Example: Signup Request Body
JSON

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "09123456789",
  "password": "password123",
  "role": "Customer" // Available roles: Customer, Canteen_Personnel, Admin
}
🐛 Troubleshooting
Issue	Potential Cause(s)	Solution
Access denied for user...	Incorrect MySQL credentials in application.properties.	Update spring.datasource.username and password.
Port 8080 Already in Use	Another application is using the backend port.	Stop the other application or change server.port in application.properties (e.g., to 8081).
Network Error (Frontend)	Backend is not running or CORS issue.	Ensure backend is running. Check CORS configuration in application.properties.
npm ERR! code ERESOLVE	Dependency conflict during install.	Run npm install --legacy-peer-deps to force installation.
Table Doesn't Exist	Hibernate failed to create tables.	Verify spring.jpa.hibernate.ddl-auto=update is set in application.properties.

Export to Sheets

⚠️ Security Notes (Development vs. Production)
This project is currently configured for a simplified development environment.

Development Implementation	Recommended Production Solution
Passwords stored in plain text.	Implement BCrypt password hashing.
No JWT authentication.	Add JWT token authentication for secure sessions.
CSRF protection disabled.	Enable CSRF protection.
HTTP only.	Use HTTPS for secure communication.
Basic session handling.	Implement proper session management and rate limiting.

Export to Sheets

👥 User Roles
Role	Access Level
Customer	Browse menu, place new orders, view order history.
Canteen Personnel	Manage and process incoming orders, update the menu.
Admin	Full system access, including user and role management.

Export to Sheets

🤝 Contributing
We welcome contributions! Please follow these steps to contribute:

Fork the repository.

Create your feature branch: git checkout -b feature/AmazingFeature

Commit your changes: git commit -m 'Add some AmazingFeature'

Push to the branch: git push origin feature/AmazingFeature

Open a Pull Request.
