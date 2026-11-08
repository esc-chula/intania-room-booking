import { mock } from "bun:test";

// bun's mock.module is shared by every test file in the run, so the one mock of
// next/navigation lives here. Two files mocking it separately would overwrite each other.
export const navigation = {
  pathname: "/",
  replace: mock((_to: string) => undefined),
};

void mock.module("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace }),
}));
