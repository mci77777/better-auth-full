# Better Auth Starter

This is a starter project for Better Auth, demonstrating how to integrate it with a FastAPI backend and a Next.js frontend.

## Features

- **Auth Service:** A robust authentication service built with `better-auth`.
- **FastAPI Backend:** An example of how to protect your FastAPI endpoints with JWT authentication.
- **Next.js Frontend:** A simple UI for user registration, login, and a protected dashboard.

## Getting Started

### Prerequisites

- Node.js
- pnpm
- Python
- PostgreSQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd better-auth-starter
   ```

2. **Install dependencies for the auth service:**

   ```bash
   pnpm install
   ```

3. **Install dependencies for the Next.js UI:**

   ```bash
   cd ui-nextjs
   pnpm install
   ```

4. **Install dependencies for the FastAPI backend:**

   ```bash
   pip install -r examples/fastapi/requirements.txt
   ```

### Configuration

1. **Create a `.env` file in the root directory:**

   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your database credentials and a secret key.**

3. **Create a `.env.local` file in the `ui-nextjs` directory:**

   ```bash
   cp ui-nextjs/.env.local.example ui-nextjs/.env.local
   ```

### Running the applications

1. **Start the PostgreSQL database.**

2. **Run the database migrations:**

   ```bash
   npx @better-auth/cli@latest generate
   npx @better-auth/cli@latest migrate
   ```

3. **Start the auth service:**

   ```bash
   npm run dev
   ```

4. **Start the FastAPI backend:**

   ```bash
   uvicorn examples.fastapi.main:app --reload --port 8080
   ```

5. **Start the Next.js UI:**

   ```bash
   cd ui-nextjs
   npm run dev
   ```

## Project Structure

```
.
├── docs
│   └── VALIDATION.md
├── examples
│   └── fastapi
│       ├── main.py
│       └── requirements.txt
├── src
│   ├── auth.ts
│   └── server.ts
├── ui-nextjs
│   ├── ...
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── docker-entrypoint.sh
├── package.json
├── README.md
├── todo.md
└── tsconfig.json
```




## Production Considerations

For production deployment, consider the following:

- **Domain Configuration:** Replace `http://localhost:4000` and `http://localhost:3000` with your actual production domains for `BETTER_AUTH_URL` and `CLIENT_ORIGIN` in the `.env` file.
- **CORS Whitelisting:** Ensure your production frontend domain is whitelisted in the `trustedOrigins` array in `src/auth.ts`.
- **Logging and Monitoring:** Implement robust logging and monitoring solutions for both the Auth service and FastAPI backend to track performance, errors, and security events.
- **Environment Variables:** Securely manage environment variables in your production environment, avoiding hardcoding sensitive information.
- **HTTPS:** Always use HTTPS for all production traffic to ensure secure communication.
- **Database Security:** Implement strong database security practices, including regular backups, access control, and encryption.


