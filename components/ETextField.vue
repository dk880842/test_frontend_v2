<template>
  <div class="e-text-field">
    <label
      v-if="label"
      :for="computedId"
      class="e-text-field__label"
    >
      {{ label }}
    </label>

    <input
      :id="computedId"
      v-model="innerValue"
      :type="type"
      :placeholder="placeholder"
      class="e-text-field__input"
      :class="{ 'has-error': errorMessage }"
      autocomplete="off"
    />

    <span v-if="errorMessage" class="e-text-field__error-msg">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  value?: string | number
  id?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'password'
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  value: ''
})

const emit = defineEmits<{
  (e: 'update:value', val: string | number): void
}>()
const autoId = useId()
const computedId = computed(() => {
  return props.id || autoId
})

const innerValue = computed({
  get: () => props.value,
  set: (val) => emit('update:value', val)
})
</script>

<style scoped lang="scss">
.e-text-field {
  @apply flex flex-col w-full mb-1;

  &__label {
    @apply block text-sm font-bold mb-1 ml-1 text-white;
  }

  &__input {
    @apply flex-1 bg-transparent border border-gray-500 rounded px-3 py-2 text-white outline-none transition-all duration-200 text-base placeholder-gray-400;

    &:focus {
      @apply border-green-500 ring-1 ring-green-500;
    }

    &.has-error {
      @apply border-red-500;

      &:focus {
        @apply ring-red-500;
      }
    }
  }

  &__error-msg {
    @apply text-red-500 text-xs ml-1 mt-1 min-h-[1.25em];
  }
}
</style>