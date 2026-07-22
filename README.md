# Horizon

Horizon is a web platform for students who want to build practical experience through events, projects, publications and internship opportunities. It combines a public landing page with account management and a personal development dashboard.

I built the application during a bootcamp and was responsible for the implementation; the other team members prepared the project presentation.

## Features

- registration, email verification, login and refresh-token authentication;
- password recovery by email;
- editable user profiles and avatar uploads;
- events with tags, filters and detailed views;
- personal sections for achievements, projects, publications, applications and XP history;
- responsive public pages for partners, career information, support and privacy policy;
- SQLite schema initialization without a separate database server.

## Tech stack

Next.js 16, React 19, TypeScript, SQLite, bcrypt, JSON Web Tokens, Nodemailer, Sharp, CSS Modules and Tailwind CSS.

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The SQLite database and its tables are created automatically on first use.

At minimum, replace `JWT_SECRET` and `JWT_REFRESH_SECRET_KEY` with two independent random values. SMTP settings are required for real verification and password-reset emails. When SMTP is not configured, the application reports that the message was not sent and does not print verification codes or reset links to the console.

## Commands

```bash
npm run dev      # development server
npm run lint     # ESLint
npm run build    # production build
npm start        # run the production build
```

## Runtime data

Local databases, environment files, build output and uploaded avatars are excluded from Git. The directory `public/uploads/avatars` is kept with a `.gitkeep` file and is populated at runtime.

This repository contains the bootcamp version of the product. Before a public deployment, use managed storage for uploads and a production database instead of the local filesystem and SQLite.

## License

This project is available under the [MIT License](LICENSE).
