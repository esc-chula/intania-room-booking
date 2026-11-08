# Room Booking System

Web app for the room and location booking system that replaces the Google Form process used by ฝ่าย OS. Built on the [T3 stack](https://create.t3.gg) and run with [Bun](https://bun.sh).

Status: foundation only. Every screen has a route with a placeholder page, and no feature is built yet. Sign-in uses the Go API (see [ADR 0002](docs/adr/0002-auth.md)). Run the API with auth switched on, or every page except `/login` shows a "cannot check sign-in" message.

## Getting started

You need [Bun](https://bun.sh) and Node 20 or newer (`.nvmrc` pins the version CI uses, 24).

```bash
bun install
cp .env.example .env
bun run dev
```

Open http://localhost:3000 for an index of every screen.

## Commands

| Command              | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `bun run dev`        | Start the dev server                                 |
| `bun run check`      | Run everything CI runs. Do this before you open a PR |
| `bun run test`       | Run tests (use this, not plain `bun test`)           |
| `bun run test:watch` | Run tests in watch mode                              |
| `bun run format`     | Format all files                                     |
| `bun run lint:fix`   | Fix lint problems                                    |
| `bun run typecheck`  | Check types                                          |

## Where things are

```
designs/                 Design exports (SVG), read-only inputs from design
docs/
  Room_Booking_System_EPIC.md   Requirements, the source of truth
  design-map.md          Which design and requirement belongs to which route
  open-questions.md      Unresolved decisions. Check here before guessing
  adr/                   Technical decisions and why they were made
src/
  app/                   Routes only: keep pages thin
    (auth)/              /login
    (user)/              User A and B screens: /home, /requests, /profile
    os/                  OS screens: /os/*
    api/trpc/            tRPC endpoint
  features/<name>/       Code for one feature: components and hooks
  components/ui/         Generic primitives (shadcn/ui)
  components/layout/     App shell and navigation
  components/            Shared project components such as StatusBadge
  domain/                Business terms and rules, with no React
  config/                Navigation and request types
  server/api/routers/    tRPC routers: all server data access
  trpc/                  tRPC clients for server and client components
  styles/globals.css     Design tokens
  env.js                 Validated environment variables
```

## Read next

1. [CONTRIBUTING.md](CONTRIBUTING.md): how we work together
2. [docs/design-map.md](docs/design-map.md): find your screen
