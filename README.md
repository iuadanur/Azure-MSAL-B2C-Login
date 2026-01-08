# Microsoft Entra External ID (B2C) React Demo

A React + TypeScript + Vite demo that integrates Microsoft Entra External ID (B2C) using MSAL. It implements a basic sign-in/sign-out flow, shows protected content, and displays profile information from ID token claims.

## Features
- MSAL authentication with an external tenant (Entra External ID / B2C)
- Sign-in and sign-out buttons
- Protected section that renders only for authenticated users
- Profile card with name, email, and object ID claims
- Config driven by environment variables for local and Azure App Service

## Tech Stack
- React 19 + TypeScript
- Vite
- MSAL Browser + MSAL React

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `react-auth-app/.env` file:
```bash
VITE_CLIENT_ID=your-app-client-id
VITE_TENANT_DOMAIN=your-tenant.onmicrosoft.com
VITE_SIGNIN_POLICY=your_sign_in_sign_up_flow
VITE_AUTHORITY_HOST=your-tenant.ciamlogin.com
VITE_AUTHORITY=https://your-tenant.ciamlogin.com/your-tenant.onmicrosoft.com/your_sign_in_sign_up_flow
VITE_REDIRECT_URI=http://localhost:5173/callback
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
VITE_API_SCOPES=openid,profile,email
```

Notes:
- `VITE_AUTHORITY` is optional. If omitted, it is built from the host, tenant domain, and policy.
- `VITE_API_SCOPES` is optional. Use a comma-separated list if you have additional scopes.

### 3) Run locally
```bash
npm run dev
```
Open `http://localhost:5173`.

## Azure App Service Deployment
1) Deploy the build output to Azure App Service.
2) In App Service -> Configuration -> Application settings, add the same `VITE_*` variables.
3) Ensure the Redirect URIs in your App Registration include:
   - Local: `http://localhost:5173/callback`
   - Production: `https://<your-app>.azurewebsites.net/callback`

## Project Structure
- `src/authConfig.ts`: MSAL configuration and environment variable handling
- `src/App.tsx`: UI, login/logout, and protected content

## Security Note
This project does not store any client secrets. Environment variables in `.env` are public configuration values used by the frontend. Do not add secrets to Vite env files, and keep `.env` files out of version control.

## Scripts
```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview build
npm run lint     # lint
```
