<template>
  <u-app :locale="locales[locale as keyof typeof locales]">
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>
