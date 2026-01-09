<template>
  <dialog ref="dialogRef" class="confirm-dialog">
    <h3 class="confirm-dialog__title">{{ title }}</h3>

    <p class="confirm-dialog__content">
      <slot>{{ content }}</slot>
    </p>

    <div class="confirm-dialog__actions">
      <button
        @click="close"
        class="confirm-dialog__cancel-btn"
      >
        {{ $t('btn.cancel') }}
      </button>

      <EBtn
        :color="confirmColor"
        @click="emit('confirm')"
        :text="$t('btn.confirm')"
      />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EBtn from '~/components/EBtn.vue'

interface Props {
  title?: string
  content?: string
  confirmColor?: 'success' | 'error' | 'warn'
}

withDefaults(defineProps<Props>(), {
  title: '提示',
  content: '',
  confirmColor: 'success'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

// 開放方法給父層控制
const open = () => dialogRef.value?.showModal()
const close = () => {
  dialogRef.value?.close()
  emit('cancel')
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
.confirm-dialog {
  @apply bg-[#2a2a2a] text-white p-6 rounded-xl border border-gray-600 shadow-2xl w-80;

  &::backdrop {
    @apply bg-black/60 backdrop-blur-[2px];
  }

  &[open] {
    animation: fade-in 0.2s ease-out;
  }

  &__title {
    @apply text-lg font-bold mb-4;
  }

  &__content {
    @apply mb-6 text-gray-300;
  }

  &__actions {
    @apply flex justify-end gap-3;
  }

  &__cancel-btn {
    @apply px-4 py-2 rounded border border-gray-500 hover:bg-gray-700 transition text-white;
    background: transparent;
  }
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>