# Hi, I'm Kit! 👋

## 🔗 Links

**Contact me on my [website](https://kitmakesthings.co.uk/?view=contact)**

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/KitHamm)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kit-hamm/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/KitHammUK)

# Repo Info

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## The Media Worskhop

This repo containes the source code used to create the company website for [The Media Worskhop](https://staging.themediaworkshop.co.uk/)

## My Role - Full Stack Developer

`This project is still in the development stage.`

## Tech Stack

**Client:** Next.js, React, TypeScript, Tailwind, Next UI.

**Server:** Node.js, Next.js, Prisma.

**Databse:** PostgreSQL.

**Development Tools:** VS Code, Docker, Insomnia API tester

## Features

-   Static and Dynamic SSR
-   Custom built dashboard for content managment
-   Add page segments as needed with customizability
-   Media pool on dashboard for quickly seeing all media available
-   Contact form with message center on dashboard
-   Media storing and serving from hosting Server
-   PostgreSQL Database with Prisma client
-   Custom Paralax Views

## TODO

-   Mobile and Tablet responsive styling
-   Add case study carousel modal for page segments
-   Media folders for content managment
-   Finalize styling

## Environment Variables

To run this project, you will need a PostgreSQL data base ideally running in a local Docker environment and to add the following environment variables to your .env file

`NEXTAUTH_SECRET`

`DATABASE_URL=http://localhost:3000/`

`STATIC_VIDEOS="/videos"`

`STATIC_IMAGES="/images"`

`PUT_STATIC_VIDEOS="/public/videos/"`

`PUT_STATIC_IMAGES="/public/images/"`

`PUT_STATIC_AVATARS="public/avatars/"`

`NEXT_PUBLIC_BASE_AVATAR_URL="/avatars/"`

`NEXT_PUBLIC_BASE_VIDEO_URL="/videos/"`

`NEXT_PUBLIC_BASE_IMAGE_URL="/images/"`

`NEXT_PUBLIC_DELETE_IMAGE_DIR="/public/images/"`

`NEXT_PUBLIC_DELETE_VIDEO_DIR="/public/videos/"`

## Run Locally

`subject to change - I will try to keep this updated`

Clone the project

```bash
  git clone https://github.com/KitHamm/themediaworkshop.co.uk.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Migrate the Database

```bash
  npx prisma migrate dev
```

Generate the prisma client

```bash
  npx prisma generate
```

Start the server

```bash
  npm run dev
```
