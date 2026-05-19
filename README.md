# ChatAI — AI Chat Application

A full-stack AI chat application. Built as a portfolio project to demonstrate modern web development skills including authentication, database design, and integration with LLM APIs (OpenRouter / OpenAI-compatible).

## Key Features

- Secure authentication (NextAuth)
- Multiple independent chat sessions per user
- AI-powered responses using OpenAI-compatible APIs (OpenRouter supported)
- Persistent chat history stored in MongoDB
- Chat management (create / switch / delete conversations)
- Real-time conversational UX (chat-style interface)
- Fully environment-configured deployment

## Tech Stack

### Frontend

- Next.js (React)
- TypeScript

### Backend

- Next.js API Routes / Node.js backend
- NextAuth.js (authentication)

### Database

- MongoDB (Mongoose / native driver)

### AI Integration

- OpenRouter API (OpenAI-compatible interface)

## Architecture Overview

- Each user has multiple chat sessions
- Each chat stores a list of messages (user + assistant)
- Messages are persisted in MongoDB
- On user input:
  1. Message is saved to DB
  2. Request is sent to LLM API
  3. Response is streamed/returned
  4. Response is saved and rendered in UI

## Environment Variables

Create a `.env` file in the root directory:

```bash
MONGODB_URI=mongodb://localhost:27017/chatai

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

ALLOWED_ORIGIN=http://localhost:3000

OPENAI_API_KEY=your_api_key
```

## Getting Started

```bash
git clone https://github.com/your-username/chatai.git
cd chatai

npm install
npm run dev
```

App runs at:

http://localhost:3000

## What This Project Demonstrates

This project was built to showcase:

- Full-stack application design
- Authentication & session management
- Database modeling for chat systems
- Integration with external AI APIs
- Handling multiple user conversations
- Clean separation of chat sessions and messages
- Environment-based configuration for deployment

## Database Design (Simplified)

### User

- id
- email
- password (or provider-based auth)
- createdAt

### Chat

- id
- userId
- messageSchema
- createdAt

### Message

- id
- role (user | assistant)
- content
- timestamp

## Authentication Flow

- Implemented using NextAuth
- Protects API routes and UI pages
- Each user accesses only their own chats

## AI Integration

Supports any OpenAI-compatible API:

- OpenAI
- OpenRouter
- Custom LLM endpoints

Configured via:

- OPENAI_API_KEY

## Deployment Notes

To run in production:

- Set NEXTAUTH_URL to production domain
- Use MongoDB Atlas or hosted MongoDB
- Configure proper CORS via ALLOWED_ORIGIN
- Store secrets securely in hosting platform (Vercel / Railway / etc.)

## Why This Project Matters

This project demonstrates ability to:

- Build production-style full-stack applications
- Integrate modern AI APIs into real products
- Design scalable chat-based data structures
- Implement authentication and user isolation
- Work with environment-based deployment configs