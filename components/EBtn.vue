<template>
  <button
    class="e-btn"
    :class="[`e-btn-${props.color}`]"
  >
    <span v-if="text">{{ text }}</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  color?: 'success' | 'error' | 'warn'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success'
})
</script>

<style scoped lang="scss">
.e-btn {
  @apply inline-flex items-center justify-center px-6 py-1.5 rounded text-base font-medium text-white cursor-pointer border-none outline-none transition-all duration-200 select-none active:scale-95;

  &-success {
    @apply bg-green-700 hover:bg-green-800 active:bg-green-900 hover:shadow-[0_0_8px_rgba(21,128,61,0.5)];
  }

  &-error {
    @apply bg-red-700 hover:bg-red-800 active:bg-red-900 hover:shadow-[0_0_8px_rgba(185,28,28,0.5)];
  }

  &-warn {
    @apply bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 hover:shadow-[0_0_8px_rgba(202,138,4,0.5)];
  }
}
</style>