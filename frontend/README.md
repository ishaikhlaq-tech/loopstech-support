# LoopTech Support Frontend

This folder contains the React/Vite client for LoopTech Support.

For the full system documentation, architecture, database schema, API routes, and operational notes, see the top-level [README.md](../README.md).

## Frontend Stack

- React 19
- Vite
- React Router v6
- Tailwind CSS
- React Hook Form
- Zod
- Supabase JS client
- Recharts
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

## Environment

Set `VITE_API_URL` to the backend API base URL, for example:

```env
VITE_API_URL=http://localhost:5000/api
```
