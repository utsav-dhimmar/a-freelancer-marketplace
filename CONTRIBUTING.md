# 🤝 Contributing to A-Freelancer-Marketplace


---

## 📁 Project Structure

```
a-freelancer-marketplace/
├── apps/
│   ├── backend/      # Express.js + Node.js API (TypeScript)
│   ├── frontend/     # Angular Application
│   └── shared/       # Shared utilities, types, and constants
├── package.json      # Root package.json (npm workspaces)
└── README.md
```

### Workspaces

| Workspace       | Description     | Tech Stack                       |
| --------------- | --------------- | -------------------------------- |
| `apps/backend`  | REST API server | Express.js, Mongoose, TypeScript |
| `apps/frontend` | Web application | Angular 21                       |
| `apps/shared`   | Shared code     | TypeScript                       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (recommended: v20 LTS)
- **npm** v9+ (comes with Node.js)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd a-freelancer-marketplace
   ```

2. **Install all dependencies** (from root directory)
   ```bash
   npm install
   ```
   > This installs dependencies for all workspaces automatically.

3. **Set up environment variables**
   ```bash
   # Copy the example .env file for backend
   cp apps/backend/.env.example apps/backend/.env
   # Update with your MongoDB connection string and other config
   ```

---

## 🛠️ Development Commands

Run all commands from the **root directory**:

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev:backend`  | Start backend dev server with hot-reload |
| `npm run dev:frontend` | Start Angular dev server                 |
| `npm run build`        | Build all workspaces                     |

### Running individual workspaces

```bash
# Backend only
npm run dev --workspace=apps/backend

# Frontend only
npm run start --workspace=apps/frontend

# Install a package to a specific workspace
npm install <package-name> --workspace=apps/backend
```

---

## 📂 Working with Shared Package

The `@app/shared` package contains shared types, constants, and utilities.

### Importing from shared:

```typescript
// In backend or frontend
import { someUtility } from '@app/shared';
```

### Adding to shared:
1. Add your code to `apps/shared/src/`
2. Export it from `apps/shared/src/index.ts`

---

## 🌿 Git Workflow

### Branch Naming Convention

| Type     | Format                         | Example                       |
| -------- | ------------------------------ | ----------------------------- |
| Feature  | `feature/<short-description>`  | `feature/user-authentication` |
| Bug Fix  | `fix/<short-description>`      | `fix/login-validation`        |
| Hotfix   | `hotfix/<short-description>`   | `hotfix/critical-security`    |
| Refactor | `refactor/<short-description>` | `refactor/api-structure`      |

### Commit Message Format

```
<type>(<scope>): <short description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```bash
feat(backend): add user registration endpoint
fix(frontend): resolve login form validation
docs: update README with setup instructions
chore: update dependencies
```

### Pull Request Process

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with meaningful messages

3. Push your branch
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request to `main` branch

5. Wait for code review from at least one team member

6. After approval, merge using **Squash and Merge**

---

## 📝 Code Style Guidelines

### TypeScript
- Use **strict mode** (enabled in `tsconfig`)
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### Backend (Express)
- Use async/await for asynchronous operations
- Handle errors using try-catch
- Validate inputs using middleware
- Keep controllers thin, business logic in services

### Frontend (Angular)
- Follow Angular style guide
- Use standalone components
- Use signals for state management where applicable
- Keep components focused and reusable

---

## 🔧 Environment Variables

### Backend (`apps/backend/.env`)

| Variable      | Description               | Example                                |
| ------------- | ------------------------- | -------------------------------------- |
| `PORT`        | Server port               | `3000`                                 |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/freelancer` |
| `JWT_SECRET`  | Secret for JWT tokens     | `your-secret-key`                      |

> ⚠️ **Never commit `.env` files to the repository!**

---

## 🐛 Reporting Issues

When creating an issue, please include:
1. **Clear title** describing the problem
2. **Steps to reproduce**
3. **Expected behaviour**
4. **Actual behaviour**
5. **Screenshots** (if applicable)
6. **Environment** (Node version, OS, browser)

---

## ❓ Need Help?

- Check existing issues and pull requests
- Ask in the team group chat
- Contact project maintainers

---


Happy coding! 🎉
