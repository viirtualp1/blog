export default defineNuxtConfig({
  compatibilityDate: "2025-06-17",
  modules: ["@nuxt/ui", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:3000",
    },
  },

  i18n: {
    defaultLocale: "en",
    strategy: "prefix_except_default",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "ru", name: "Русский", file: "ru.json" },
    ],
  },

  devServer: { port: 3001 },
});
