# ServiceDesk AI 🤖🎫

A modern, AI-powered ticketing system and service desk application built with React, TypeScript, Vite, and Firebase.

## 🌟 Features

- **Role-Based Access & Dashboards**: 
  - **Users**: Create requests, view request status, and track ticket updates.
  - **Agents**: Manage priority queues, handle assigned tickets, and communicate with users.
  - **Admins**: View analytics, manage the system, and track agent performance.
- **Authentication**: Secure login and authorization via Firebase.
- **Modern UI**: Fully responsive and beautiful interface built with Tailwind CSS.
- **Dark Mode**: Built-in support for dark and light themes.
- **Client-Side Routing**: Fast, seamless navigation via React Router.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 (Vite) + TypeScript
- **Styling**: Tailwind CSS
- **Backend / Database**: Firebase (Auth, Firestore, Realtime Database)
- **Deployment**: Configured for Netlify

## ⚙️ Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- NPM or Yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dipakdhurve9975-lgtm/Ticket-web-.git
   cd Ticket-web-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

This project is pre-configured to be easily deployed on **Netlify**.
- Includes `public/_redirects` and `netlify.toml` to support Single Page Application (SPA) routing out of the box.
- The build command is `npm run build` and the publish directory is `dist`.

## 📁 Project Structure

```text
src/
├── components/   # Reusable UI components
├── config/       # Constants, routes, and environment configurations
├── firebase/     # Firebase initialization and services
├── hooks/        # Custom React hooks (e.g., Theme, Auth)
├── layouts/      # Layout wrappers (Auth, Dashboard)
├── pages/        # Main application pages
├── services/     # External API and database logic
├── types/        # TypeScript interfaces and types
└── utils/        # Helper functions
```
