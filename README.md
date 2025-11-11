# Welcome to a Smart Complaint Management System
A full-stack Complaint Management System built using React, Supabase as backend, and hosted on Vercel.
This system allows users to submit complaints and track their status while enabling admins to manage and resolve them efficiently.

---

# Project Overview
## URL: https://complaint-management-theta.vercel.app/
## Roles

**User:** Can register, log in, submit, view, and update their complaints.

**Admin:** Can view all complaints, update status, and delete inappropriate or resolved ones.

## Features

- User authentication (Supabase Auth)

- Role-based access (Admin/User)

- CRUD operations for complaints

- Client-side form validation using Bootstrap / Shadcn UI

- Responsive dashboard (User + Admin)

- Toast notifications for success/error

- Hosted frontend (Vercel)

- Realtime updates from Supabase

---

# Tech Stack 

| Category          | Technology                                  |
| ----------------- | ------------------------------------------- |
| Frontend          | React (Vite) + TypeScript                |
| Backend           | Supabase (PostgreSQL + Auth + RLS Policies) |
| Hosting           | Vercel (Frontend) + Supabase Cloud          |
| Database          | PostgreSQL (Supabase)                       |
| Version Control   | Git + GitHub                                |
| Testing Framework | Vitest + React Testing Library              |
| Design            | Bootstrap 5, Tailwind, Shadcn UI            |

---

# SetUp Instructions
**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/Serendipity-scribe-dev/Complaint-Management.git

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
Visit: http://localhost:8000
```
**Setup Environment Variables**

Create a .env.local file in your root directory:
```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

---

# UML Diagrams
## 🧩 Use Case Diagram
![UML - Use Case](https://github.com/user-attachments/assets/63310018-3a04-4f0a-a6a1-255a232be969)


## 🗄️ Database Schema Diagram
![DB schema](https://github.com/user-attachments/assets/7954b177-d036-4ad3-9912-676cafa19233)



