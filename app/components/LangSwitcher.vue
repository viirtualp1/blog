<template>
  <u-select
    v-model="selected"
    :items="items"
    value-key="value"
    class="w-28"
    size="sm"
  />
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const items = computed(() => {
  return locales.value.map((l) => ({
    label: l.name,
    value: l.code,
  }))
})

const selected = computed({
  get: () => locale.value,
  set: (val: 'en' | 'ru') => setLocale(val),
})
</script>
