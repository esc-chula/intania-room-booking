# Project rules

Read `README.md`, `CONTRIBUTING.md` and `docs/design-map.md` before changing code.

- This is a T3 app run with Bun: use `bun`, never npm or pnpm. Imports use the `@/` alias.
- Requirements live in `docs/Room_Booking_System_EPIC.md`; screens live in `designs/`. Unresolved items are tracked in `docs/open-questions.md`. Do not guess an answer to an open question in code: flag it.
- Booking and location statuses come from `src/domain/`. Colours come from the tokens in `src/styles/globals.css`. Do not hard-code either in a component.
- Client code gets data through tRPC. Read environment variables through `src/env.js`, not `process.env`.
- Run `bun run check` before opening a pull request.
