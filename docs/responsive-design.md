# Responsive design

Read this before you build or change any screen, layout or component. The EPIC says most users book from a phone, but the design frames are 1920px desktop sheets. The frames show the large layout. You design the small ones.

The stack is Next.js and Tailwind CSS v4, so everything below is written as Tailwind classes. Tailwind's default breakpoints apply: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. Do not add custom breakpoints without a reason in the pull request.

## Rules

### 1. Mobile first

- Write the base classes for a phone (about 360px wide). Add `md:`, `lg:` and so on only for what changes on larger screens. Never use `max-*:` variants to undo desktop styles.
- Treat the small screen as a prioritisation exercise: ask what the user needs to finish the task, and show only that at the base level. Move the rest behind a tab, accordion, drawer or dialog.
- Check the frame at 1920px last, not first.

### 2. Breakpoints follow the content

- Add a breakpoint where the layout starts to look wrong, not at a device width.
- Check each screen at 360, 768, 1024, 1280 and 1920px wide, in portrait and landscape for phone and tablet.
- A layout with no horizontal page scroll at 360px is the minimum. Scroll inside a container (`overflow-x-auto`) only for data that cannot shrink, such as the month and week calendars. Never let the page itself scroll sideways.

### 3. Fluid before fixed

- Prefer `w-full`, `flex-1`, `min-w-0`, `fr` units and `grid-cols-[repeat(auto-fit,minmax(...,1fr))]` over fixed pixel widths. A flex or grid child that holds long text needs `min-w-0` or it overflows.
- Give a max width to the content block (`max-w-*`), not a fixed width. `AppShell` already does this at 1500px.
- Use `gap-*` and `space-y-*` for spacing, and scale spacing with the breakpoint (`p-4 md:p-6 2xl:p-8`) rather than using one large value.
- Use `min-h-dvh` and `max-h-[calc(100dvh-...)]`, not `vh`. Mobile browser toolbars make `vh` too tall.

### 4. Touch targets and spacing

- Every tappable element is at least 44×44px (Apple) and preferably 48×48px (Material). Icon-only buttons included.
- To grow the hit area without growing the icon, add padding or a pseudo-element, not a bigger glyph.
- Leave at least 8px between adjacent targets so one tap cannot hit two.
- Do not rely on hover. Anything that appears on hover must also work on tap and on keyboard focus.

### 5. Type

- Body text is at least 16px on a phone. Smaller text is for secondary captions only. `<input>` at less than 16px makes iOS Safari zoom the page on focus.
- Keep line length at roughly 45 to 75 characters for reading text. Thai has no spaces between words, so check that long strings wrap (`break-words`) and do not push the layout wide.
- Use `clamp()` or breakpoint-stepped sizes for headings so they do not jump or overflow. Do not let Thai text with tall tone marks clip: keep a line height of at least `leading-6` for body text.

### 6. Navigation and primary actions

- Collapse the sidebar into a compact top bar below `md` and expand it from `md` up (`AppShell` does this).
- Keep one way to go home or back visible on every screen without extra taps.
- Keep the main action (submit, approve, book) reachable on a phone. For a long form or detail page, use a sticky bar at the bottom of the screen (`sticky bottom-0`, with `pb-[env(safe-area-inset-bottom)]`), not a button at the end of a long scroll.
- Put filters and sort controls in a dialog or bottom sheet on a phone, not in a sidebar.

### 7. Data-heavy screens

- A table that does not fit on a phone becomes a stack of cards. Each row is a card and each value keeps its label. Render both from the same data and switch with `hidden md:block` and `md:hidden`.
- Calendars: month, week and day views can scroll inside a container on a phone, but the default view on a phone should be the one that fits (the day view or a list).
- Status is never shown by colour alone. Always pair a colour with the label from `StatusBadge`.

### 8. Components, not pages

- Responsive behaviour belongs to the component. A component works in a sidebar, a dialog and a full-width page without the page overriding its internals.
- When a component needs to change with its own container instead of the viewport, use Tailwind v4 container queries: `@container` on the parent and `@md:` on the child.
- Do not duplicate a component per screen size. Change its classes, or switch layout with the breakpoint variants.

### 9. Images and icons

- Use `next/image` with `width` and `height` (or `fill` inside a sized, `relative` parent) so the layout does not shift, plus a correct `sizes` prop so phones download small files.
- Use SVG for icons and logos (`lucide-react` here). They scale and take `currentColor`.
- Lazy-load below-the-fold images. Mark the largest above-the-fold image `priority`.

### 10. Performance

- A fast layout on a slow connection is part of responsive design. Keep client components small and server-render what you can.
- Do not ship desktop-only code to phones when it can be avoided: render one layout, and switch it with CSS, rather than mounting two heavy trees.
- Check Core Web Vitals (LCP, CLS, INP) with Lighthouse before a pull request that changes a main screen.

## Check before you open a pull request

1. Open the screen in browser DevTools device mode at 360×800, 768×1024, 1280×800 and 1920×1080.
2. No horizontal page scroll at any width. Nothing is clipped, overlapping or too small to tap.
3. Every control works with a thumb: size at least 44px, no hover-only behaviour.
4. Open each dialog on a 360px screen. The title, content and actions stay visible, and the content scrolls inside the dialog.
5. Test with the keyboard and with browser zoom at 200%. The layout still works.
6. If you can, test on a real mid-range Android phone. It is the most common device and the one most often left untested.

## Known gaps in the current code

These break the rules above. Fix them when you touch the file, or in a dedicated pull request. Do not copy them into new code.

- `src/components/ui/button.tsx`: the default size is `h-9` (36px) and `icon` is `size-9`. Both are below 44px on a phone. Raise the touch size below `md` (for example `h-11 md:h-9`), or add a `touch` size.
- `src/features/availability/components/month-calendar.tsx` and `schedule-grid.tsx`: both use `min-w-[640px]` and `min-w-[840px]`, so they scroll sideways on a phone. This is acceptable for a calendar, but the page should open on a view that fits a phone, and the weekday header should stay visible while scrolling.
- `src/components/ui/dialog.tsx`: the dialog is centred with `w-[calc(100%-2rem)]`. On a phone, consider a full-width bottom sheet.

## References

- [Best practices and examples of excellent responsive design (UXPin)](https://www.uxpin.com/studio/blog/best-practices-examples-of-excellent-responsive-design/): the main source for the rules above.
- [Responsive Web Design: Principles and Best Practices (Medium, Dmitry Ignatovich)](https://medium.com/@ignatovich.dm/responsive-web-design-principles-and-best-practices-5370d8ce1c1d): linked by the team. Medium blocks automated fetching, so this document was not checked against it. A person should read it and add anything missing here.
- [Tailwind CSS: responsive design](https://tailwindcss.com/docs/responsive-design) and [container queries](https://tailwindcss.com/docs/responsive-design#container-queries)
- [WCAG 2.2, target size (2.5.8)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
