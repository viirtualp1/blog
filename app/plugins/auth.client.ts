export default defineNuxtPlugin(async () => {
  await useAuth().waitUntilReady()
})
