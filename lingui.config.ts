import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "fr", "mr", "hi", "js", "ko"],
  catalogs: [
    {
      path: "client/locales/{locale}/messages",
      include: ["client"],
    },
  ],
});
