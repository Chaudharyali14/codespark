# CodeSpark

CodeSpark is a full-stack web application built with Next.js, Prisma, and Tailwind CSS. It is designed to be a platform for a coding-related business or educational institution, providing features for course management, student enrollment, project showcases, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## Features

- **Course Management:** Create, read, update, and delete courses.
- **Student Enrollment:** Students can apply for courses.
- **Project Showcase:** Display a portfolio of projects with images and videos.
- **Content Management:** Manage site content such as testimonials, services, vision, and mission.
- **Admin Dashboard:** A dedicated dashboard for administrators to manage the site.
- **Responsive Design:** The application is fully responsive and works on all screen sizes.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [MySQL](https://www.mysql.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [React](https://reactjs.org/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting:** [ESLint](https://eslint.org/)
- **Package Manager:** [npm](https://www.npmjs.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd codespark
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Database Setup

1.  Create a `.env.local` file in the root of the project.
2.  Add your MySQL database connection URL to the `.env.local` file:
    ```
    DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database>"
    ```
3.  Run the Prisma migrations to create the database schema:
    ```bash
    npx prisma migrate dev
    ```
4.  (Optional) Seed the database with initial data from `data.json`:
    ```bash
    npx ts-node prisma/migrate-data.ts
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
codespark/
├── .next/
├── node_modules/
├── prisma/
│   ├── schema.prisma
│   └── migrate-data.ts
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── (pages)/
│   │   └── layout.tsx
│   ├── components/
│   └── lib/
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

-   **`prisma/`**: Contains the Prisma schema and a script to migrate data.
-   **`src/app/`**: Contains the pages and API routes of the application.
-   **`src/components/`**: Contains reusable React components.
-   **`src/lib/`**: Contains utility functions, constants, and the Prisma client instance.

## API Endpoints

The API endpoints are located in `src/app/api/`. They provide a RESTful interface for a variety of resources.

-   `/api/courses`: GET, POST
-   `/api/courses/[id]`: GET, PUT, DELETE
-   `/api/students`: GET, POST
-   `/api/projects`: GET, POST
-   ...and more.

## Deployment

The easiest way to deploy this application is to use [Vercel](https://vercel.com/), the creators of Next.js.# codespark
# codespark
