# SprintPulse — Frontend

Sprint report management UI. React + Vite + JavaScript.

## Run

```bash
npm install
npm run dev
```

Opens on http://localhost:5173

## Routes (Phase 1)

| Path      | Page                 |
| --------- | -------------------- |
| `/`       | Landing page         |
| `/login`  | Sign in UI           |
| `/signup` | Create account UI    |
| `*`       | 404                  |

## Structure

```
src/
  components/
    layout/    Navbar, Footer, PublicLayout, AuthLayout
    ui/        Button, Input, Card, Logo
  pages/
    auth/      Login, Signup
    public/    Home, NotFound
  routes/      AppRoutes.jsx
  styles/      global.css (design tokens + component styles)
```

## Notes

- Forms are UI only right now. Validation (React Hook Form + Zod), auth
  context, Axios, and protected routes come in later phases.
- Signup never offers a role picker. The backend assigns `EMPLOYEE`.
- Any role-based hiding in the UI is for UX only. The Spring Boot API is the
  security boundary.
