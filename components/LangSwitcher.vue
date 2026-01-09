<template>
  <div class="lang-switch">
    <button @click="changeLocale('zh-TW')" class="lang-switch__btn">中文</button>
    <button @click="changeLocale('en-US')" class="lang-switch__btn">English</button>
  </div>
</template>

<script setup lang="ts">
const { setLocale } = useI18n() // 直接使用 Nuxt i18n 提供的 setLocale

const changeLocale = async (lang: 'zh-TW' | 'en-US') => {
  // 這裡會自動處理 lazy load，載入 json 檔案後才切換
  await setLocale(lang)
}
</script>

<style scoped lang="scss">
.lang-switch {
  @apply flex justify-end gap-2 w-full;

  &__btn {
    @apply px-3 py-1 bg-gray-700 rounded text-sm text-white hover:bg-gray-600 transition;
    border: none;
    cursor: pointer;
  }
}
</style>