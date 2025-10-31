# TeknoEats Website

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JAVASCRIPT](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![REACT](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TAILWINDCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## About

**TeknoEats** is a modern web platform designed to make food management and ordering smarter and easier.
The frontend is built with **React** and styled using **Tailwind CSS**, while the backend is powered by **Spring Boot** for efficient API management and database handling.

---

## Tech Stack

- **Frontend:** React
- **Styling:** Tailwind CSS
- **Backend:** Spring Boot (Java)
- **Package Manager:** Spring Boot Server (Backend)

---

## Setup Instructions

### 1️. Clone the Repository
To start, open your terminal and clone this repository to your computer by running:
```bash
git clone https://github.com/ItzAaliyahh20/CSIT340-G1-Teknoeats.git teknoeats
cd teknoeats
```

### 2. Install Frontend Dependencies
Before installing, make sure **Node.js (v18+)** and **npm** are installed on your computer.

To check if Node.js is installed:  
1. Open your terminal (Command Prompt, PowerShell, or Git Bash).  
2. Type the following command and press Enter:  
```bash
node -v
npm -v
```
- If Node.js is installed, it will display the version (e.g., v20.3.1).
- If not installed, download it here: https://nodejs.org/

Once Node.js is installed, run this command in your project folder to install all frontend dependencies:
```bash
npm install
```

### 3. Run the Development Server
Start the local React development server:
```bash
npm start
```
This will run the website at:
```bash
http://localhost:3000
```

### 4. Connect to the Backend (Spring Boot)
- Ensure Java and Spring Boot are installed.
- Run your backend (usually on port 8080).
- Verify API URLs match your backend endpoints, e.g.:
```bash
fetch("http://localhost:8080/api/foods")
```
Note: If frontend and backend run on different ports, configure CORS in your Spring Boot app.

### 5. Build for Production (optional)
To create an optimized production build:
```bash

npm run build
```
This will generate a build/ folder ready for deployment.

---

## Notes

- Ensure Java and Spring Boot are installed for the backend.
- You can host the backend (Spring Boot) and frontend (React) separately or deploy them together using a reverse proxy setup.git 