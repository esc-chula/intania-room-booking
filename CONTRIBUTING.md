# Contributing

## Workflow

1. Pick or create an issue that names the requirement and the design frame.
2. Branch from `main`: `feat/os-availability-calendar`, `fix/status-badge-label`, `docs/...`, `chore/...`.
3. Keep the pull request small: one screen or one behaviour.
4. Run `bun run check`, then open a pull request using the template.
5. Get one approval and green CI, then squash and merge. Nobody pushes directly to `main`.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `feat: add availability week view`. With squash merge, the pull request title becomes the commit, so it matters most.

## Building a screen

1. Find the route, design file and requirement in [docs/design-map.md](docs/design-map.md).
2. Replace `ScreenPlaceholder` in the route's `page.tsx`, and keep the page thin.
3. Put the feature's code in `src/features/<name>/`.
4. Read the requirement in the EPIC, not just the design. Rules such as the 14-day block only appear there.
5. Check [docs/open-questions.md](docs/open-questions.md). If you hit an unknown, add it there and ask instead of guessing silently.

## Where code goes

| Code                                    | Location                  |
| --------------------------------------- | ------------------------- |
| Route, layout, loading and error states | `src/app/`                |
| Used by one feature                     | `src/features/<name>/`    |
| Used by two or more features            | `src/components/`         |
| Generic primitive (button, dialog)      | `src/components/ui/`      |
| Business rule or term, no React         | `src/domain/`             |
| Reading or changing server data         | `src/server/api/routers/` |

Features must not import from other features. Move shared code up instead.

## UI rules

- **Mobile first.** The EPIC says most users book from a phone. Write the phone layout first and add `md:` for larger screens, even though the frames are desktop.
- **Tokens only.** Colours come from `src/styles/globals.css` (`bg-primary`, `text-status-pending-foreground`). If a colour is missing, add a token.
- **Primitives.** Add them with `bunx shadcn@latest add <component>`, then adjust to match `designs/component.svg`. The CLI currently writes a broken import, `from "cn"`, so change it to `from "@/lib/utils"` (`bun run typecheck` fails until you do).
- **Statuses.** Use `StatusBadge` and the types in `src/domain/booking.ts`. Never write the Thai label by hand.
- **Text.** The UI is Thai only, so hard-coded Thai strings are fine. Identifiers and code comments are in English.
- **Accessibility.** Use real buttons, links and labels. Status must never be shown by colour alone.

## Data

Client code gets data through tRPC. Add a router in `src/server/api/routers/` and register it in `src/server/api/root.ts`. Add environment variables to `src/env.js` and `.env.example` together.

## Tests

Tests use `bun test` and Testing Library and sit next to the code as `*.test.ts(x)`. Run them with `bun run test`.

- Always test business rules in `src/domain/`: the 14-day block, project code format, conflict detection.
- Test components through what users see and do, not their internals.
- A bug fix comes with a test that fails without the fix.

## Data and privacy

Bookings hold personal data and fall under PDPA (Epic 6). Use made-up names and phone numbers in fixtures, screenshots and issues, never real ones. Never commit `.env`, or put secrets in `NEXT_PUBLIC_*` variables, which reach the browser.

## Changing designs

Replace files in `designs/` using the same name so links keep working. If a file is renamed, update `docs/design-map.md`, because a test checks that every file it names exists.
