<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const items = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map((l) => ({
    label: l.name,
    value: l.code,
  })),
)

const selected = computed({
  get: () => locale.value,
  set: (val: string) => setLocale(val),
})
</script>

<template>
  <USelect v-model="selected" :items="items" value-key="value" class="w-28" size="sm" />
</template>
