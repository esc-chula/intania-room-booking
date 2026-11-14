# Project rules

Read `README.md`, `CONTRIBUTING.md` and `docs/design-map.md` before changing code. Read `docs/responsive-design.md` before building or changing any screen, layout or component.

- This is a T3 app run with Bun: use `bun`, never npm or pnpm. Imports use the `@/` alias.
- Requirements live in `docs/Room_Booking_System_EPIC.md`; screens live in `designs/`. Unresolved items are tracked in `docs/open-questions.md`. Do not guess an answer to an open question in code: flag it.
- Booking and location statuses come from `src/domain/`. Colours come from the tokens in `src/styles/globals.css`. Do not hard-code either in a component.
- UI is mobile first: base classes are for a 360px phone, `md:` and up add the desktop layout. Tap targets are at least 44px, and the page never scrolls sideways. The full rules and the pre-PR checks are in `docs/responsive-design.md`.
- Client code gets data through tRPC. Read environment variables through `src/env.js`, not `process.env`.
- Run `bun run check` before opening a pull request.
