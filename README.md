Mindora AI is an AI assistant that I built as a full-stack project.

It supports normal chat along with different modes like Coding, Search, PDF, PPT and Vision. It also includes Google authentication, chat history, credits, payments and AI tool calling.

## Live Demo

[Open Mindora AI](https://white-cliff-02cc5ce00.7.azurestaticapps.net)

## Features

- Google Login
- AI Chat
- Coding Mode
- Search Mode
- PDF Generation
- PPT Generation
- Vision/Image Support
- AI Tool Calling
- Chat History
- Redis-based Sessions
- Credits System
- Razorpay Payment Integration
- Protected API Routes

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Firebase Authentication

### Backend

- Node.js
- Express.js
- MongoDB
- Redis
- Firebase Admin

### Deployment & Other Tools

- Docker
- GitHub Actions
- Azure Container Apps
- Azure Container Registry
- Azure Static Web Apps
- Razorpay

## Project Structure

```text
Mindora/
│
├── frontend/
│
├── backend/
│   ├── gateway/
│   │
│   ├── services/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── agent/
│   │   └── billing/
│   │
│   └── shared/
│
└── .github/
    └── workflows/
```

## How It Works

The frontend is deployed using Azure Static Web Apps.

The backend is divided into different services and each service runs separately using Docker and Azure Container Apps.

The frontend sends requests to the API Gateway.

```text
Frontend
   |
   v
API Gateway
   |
   +---- Auth Service
   |
   +---- Chat Service
   |
   +---- Agent Service
   |
   +---- Billing Service
```

MongoDB is used for application data and Redis is used for storing user sessions.

## Authentication

I used Firebase Authentication for Google Login.

The basic flow is:

```text
User
  |
  v
Google Login
  |
  v
Firebase Authentication
  |
  v
Auth Service
  |
  v
Firebase Token Verification
  |
  v
Create User Session
  |
  v
Redis
  |
  v
HTTP-only Session Cookie
```

Protected requests are checked by the API Gateway before being sent to the required service.

## Credits

Different AI modes use different amounts of credits.

| Mode | Credits |
|------|---------|
| Chat | 1 |
| Search | 5 |
| Coding | 10 |
| PDF | 10 |
| PPT | 10 |
| Vision | 10 |

## Deployment

I deployed the project using Azure.

### Frontend

- Azure Static Web Apps

### Backend

- Azure Container Apps
- Azure Container Registry

The backend services are deployed separately:

- Gateway
- Auth Service
- Chat Service
- Agent Service
- Billing Service

## CI/CD

GitHub Actions is used for deployment.

Whenever changes are pushed to the `main` branch, the workflow builds and deploys the application.

The backend deployment process is:

```text
Git Push
   |
   v
GitHub Actions
   |
   v
Build Docker Images
   |
   v
Azure Container Registry
   |
   v
Azure Container Apps
```

The frontend is built and deployed to Azure Static Web Apps through the same workflow.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/gauravjain8056/Mindora.git
cd Mindora
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

The backend services require their respective environment variables and dependencies to be configured before running locally.

## Environment Variables

Frontend environment variables:

```env
VITE_FIREBASE_API_KEY=
VITE_RAZORPAY_KEY_ID=
VITE_SERVER_URL=
```

Backend environment variables include configuration for:

- MongoDB
- Redis
- Firebase
- AI services
- Payment services

Do not commit `.env` files or private credentials to GitHub.

## Screenshots

<img width="1913" height="971" alt="image" src="https://github.com/user-attachments/assets/9ab5296d-1ba3-4a2b-84b2-bc76c80b54b4" />
<img width="1906" height="972" alt="image" src="https://github.com/user-attachments/assets/7d0ecd37-7abf-4594-ba9f-c14389c36994" />
<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/ef512076-e5d0-4848-855c-9d07d927d12d" />

## What I Learned

While building Mindora AI, I worked with:

- React and Vite
- Node.js and Express
- Microservices
- API Gateway
- MongoDB
- Redis
- Firebase Authentication
- Docker
- GitHub Actions
- Azure
- CI/CD
- Payment Integration
- AI Tool Calling

## Author

**Gaurav Jain**

B.Tech IT

GitHub: [gauravjain8056](https://github.com/gauravjain8056)
