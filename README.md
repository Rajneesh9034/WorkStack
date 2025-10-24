# WorkStack – Project Management System

**WorkStack** is a full-stack project management application to help teams organize tasks, track project progress, and collaborate efficiently.

---



---

## Features
- Create, update, and delete projects and tasks
- Track task progress (To Do, In Progress, Done)
- User authentication and authorization
- Real-time project management dashboard

---

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React.js, Vite, Tailwind CSS
- **Authentication:** JWT, bcrypt

---

## Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/Rajneesh9034/WorkNest.git
cd WorkNest
-----
### 2. Backend Setup
cd backend


Install dependencies:

npm install


Seed the database (first run only):

npm run seeder


This creates a dummy user, projects, and tasks.

Start the backend server:

npm start


⚡ Important: First run npm run seeder, then npm start.
Your backend must be seeded before starting to ensure the database has initial data.

### 3. Frontend Setup
cd ../frontend


Install dependencies:

npm install


Start the frontend development server:

npm run dev


⚡ Important: First run npm install, then npm run dev to start the frontend.

🔑 Login Credentials (Seeded User)
Email	Password
dummy@example.com
	Test@123
Optional Commands

Stop backend: Ctrl + C in terminal

Stop frontend: Ctrl + C in terminal

Re-run seeder: npm run seeder (resets dummy data)
