import Link from "next/link";
import { AuthGate } from "@/features/auth/components/auth-gate";
import {
  osNavigation,
  userNavigation,
  type NavItem,
} from "@/config/navigation";

function flatten(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => item.children ?? [item]);
}

const sections = [
  { title: "Sign in", items: [{ label: "เข้าสู่ระบบ", href: "/login" }] },
  { title: "User A / B", items: flatten(userNavigation) },
  { title: "OS", items: flatten(osNavigation) },
];

// Screen index for the team, kept at /screens now that "/" redirects by role.
export default function ScreenIndexPage() {
  return (
    <AuthGate area="any">
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <header>
          <h1 className="text-2xl font-semibold text-primary">
            Room Booking System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Screen index for development. See docs/design-map.md.
          </p>
        </header>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-sm font-semibold">{section.title}</h2>
            <ul className="divide-y rounded-lg border bg-card">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex justify-between px-4 py-3 hover:bg-muted"
                  >
                    <span>{item.label}</span>
                    <code className="text-xs text-muted-foreground">
                      {item.href}
                    </code>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </AuthGate>
  );
}
