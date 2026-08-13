# Assets Portfolio Client

Vue + TypeScript + Tailwind CSS + DaisyUI starter.

## API Setup

Set the API base URL in a local env file:

```sh
cp .env.example .env.local
```

Set `VITE_GOLE_PRICE_DOMAIN` to the gold price API origin. Requests are sent to `${VITE_GOLE_PRICE_DOMAIN}/api`.

The shared Axios instance is available at `src/api/httpClient.ts`.
Server state is handled with TanStack Query in `src/queries`.
Use Pinia later only for shared client state such as auth, theme, filters, or UI preferences.

## Scripts

```sh
npm install
npm run dev
npm run build
```
