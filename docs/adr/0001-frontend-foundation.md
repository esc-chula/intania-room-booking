# ADR 0001: Foundation

Status: Accepted. T3 and Bun were chosen by the project lead; the remaining choices were made during setup and are open to review.

## Context

The team is building a Thai-language booking site with separate OS and user areas, on a short timeline with Sprint 0 under way. The data source and sign-in are undecided (see [open questions](../open-questions.md)). The designs use Tailwind's neutral, lime, amber and red colour values, with component shapes that resemble shadcn/ui.

## Decision

| Area            | Choice                                      | Why                                                                                                     |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Base            | create-t3-app, App Router, strict TS        | Project lead's choice                                                                                   |
| Package manager | Bun, with a committed `bun.lock`            | Project lead's choice                                                                                   |
| Data access     | tRPC                                        | Types are shared from server to client, and server code can hold credentials, such as for a Sheets read |
| Database        | None yet                                    | The data source is open question 1. Add Drizzle or Prisma once it is answered                           |
| Auth            | None yet                                    | Sign-in is open question 2. Add NextAuth or BetterAuth once it is answered                              |
| Styling         | Tailwind CSS v4 with CSS variable tokens    | Included in T3, and the designs already use its colour values                                           |
| Components      | shadcn/ui, added when needed                | The code lives in this repo, so it can match the designs                                                |
| Tests           | `bun test`, happy-dom, Testing Library      | Needs no extra test runner. Browser tests can be added when real flows exist                            |
| Quality gate    | Prettier, ESLint, types, tests in CI        | Rules are enforced in one place, with no pre-commit hooks to keep setup simple                          |
| Runtime         | Node runs Next.js, Bun runs everything else | `next` runs on Node by default, which is what Next.js is built and supported on. CI uses Node 24        |

## Consequences

- Features are built against sample data until a data source is decided. Put it behind a tRPC router so that switching later only touches the router.
- Routes are open until sign-in is decided, so no real personal data may be loaded into the app before then. All tRPC procedures are public until then.
- Deployment target is undecided. Next.js needs a Node server for server-side features such as tRPC, so confirm the hosting available to the project.
