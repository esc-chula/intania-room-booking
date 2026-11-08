import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Preloaded on its own: the DOM must exist before Testing Library is imported.
GlobalRegistrator.register();
