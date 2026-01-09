<template>
  <div class="page">

    <LangSwitcher />

    <div class="card">
      <h2 class="card__title">{{ $t('operation_title') }}</h2>

      <div class="card__form">
        <ETextField
          v-model:value="name"
          :label="$t('input.label.name')"
          :placeholder="$t('input.placeholder.name')"
          :error-message="errors.name"
        />

        <ETextField
          v-model:value.number="age"
          type="number"
          :label="$t('input.label.age')"
          :placeholder="$t('input.placeholder.age')"
          :error-message="errors.age"
        />
      </div>

      <div class="card__actions">
        <ClientOnly>
          <EBtn color="error" v-if="userStore.editingId" @click="reset" :text="$t('btn.cancel')" />
          <EBtn color="success" @click="prepareAction('UPDATE')" :text="$t('btn.btn_update')" />
        </ClientOnly>
        <EBtn color="warn" @click="prepareAction('ADD')" :text="$t('btn.btn_add')" />
      </div>
    </div>

    <div class="card flex-1 min-h-0">
      <UserListTable
        :list="userStore.list"
        @edit="fillForm"
        @delete="prepareDelete"
      />
    </div>

    <AppConfirmDialog
      ref="confirmDialogRef"
      :title="$t('dialog.title')"
      :content="dialogContent"
      :confirm-color="currentAction === 'DELETE' ? 'error' : 'success'"
      @confirm="executeAction"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useUserStore } from '~/store/user'
import type { UserInfo } from '~/api/user'

// 引入拆分後的組件
import EBtn from '~/components/EBtn.vue'
import ETextField from '~/components/ETextField.vue'
import LangSwitcher from '~/components/LangSwitcher.vue'
import UserListTable from '~/components/UserListTable.vue'
import AppConfirmDialog from '~/components/AppConfirmDialog.vue'

const userStore = useUserStore()
const { t } = useI18n()

await useAsyncData('users', () => userStore.fetchList())

// --- 表單驗證與邏輯 ---
const validationSchema = computed(() => toTypedSchema(
  z.object({
    name: z.string().min(1, t('validation.name_required')),
    age: z.number(t('validation.age_required')).min(1, t('validation.age_min'))
  })
))

const { errors, defineField, validate, setValues, resetForm, values: formValues } = useForm({
  validationSchema,
  initialValues: { name: '', age: undefined as number | undefined }
})

const [name] = defineField('name')
const [age] = defineField('age')


const fillForm = (item: UserInfo) => {
  userStore.$patch({editingId:  item.id})
  setValues({ name: item.name, age: item.age })
}
const reset = () => {
  resetForm()
  userStore.$patch({editingId:  undefined })
}

const confirmDialogRef = ref<InstanceType<typeof AppConfirmDialog> | null>(null)
const currentAction = ref<'ADD' | 'UPDATE' | 'DELETE' | null>(null)
const deleteTargetId = ref<number | null>(null)

const dialogContent = computed(() => {
  switch (currentAction.value) {
    case 'ADD': return t('dialog.confirm_add', { name: formValues.name })
    case 'UPDATE': return t('dialog.confirm_update', { name: formValues.name })
    case 'DELETE': return t('dialog.confirm_delete')
    default: return ''
  }
})

const prepareAction = async (type: 'ADD' | 'UPDATE') => {
  const { valid } = await validate()
  if (!valid) return

  if (type === 'UPDATE' && !userStore.editingId) {
    alert(t('message.select_item_first'))
    return
  }

  currentAction.value = type
  confirmDialogRef.value?.open() //
}

const prepareDelete = (id: number) => {
  currentAction.value = 'DELETE'
  deleteTargetId.value = id
  confirmDialogRef.value?.open() //
}

const executeAction = async () => {
  try {
    if (currentAction.value === 'ADD') {
      await userStore.addUserAction({ name: formValues.name!, age: Number(formValues.age) })
      reset
    } else if (currentAction.value === 'UPDATE' && userStore.editingId) {
      await userStore.updateUserAction({ id: userStore.editingId, name: formValues.name!, age: Number(formValues.age) })
      reset
    } else if (currentAction.value === 'DELETE' && deleteTargetId.value) {
      await userStore.deleteUserAction(deleteTargetId.value)
    }
  } catch (e) {
    alert(t('message.action_failed'))
  } finally {
    confirmDialogRef.value?.close()
    currentAction.value = null
    deleteTargetId.value = null
  }
}
</script>

<style scoped lang="scss">
// BEM Block: page
.page {
  @apply h-[100vh] bg-[#1e1e1e] flex flex-col items-center justify-center p-4 gap-6 text-white relative overflow-hidden;
}

// BEM Block: card (這是容器樣式，保留在父層)
.card {
  @apply w-full max-w-lg border border-gray-600 rounded-2xl px-8 py-2 bg-[#252525] relative;

  &__title {
    @apply text-xl font-bold text-center mb-1;
  }

  &__form {
    @apply flex flex-col gap-1;
  }

  &__actions {
    @apply flex justify-end gap-3 mt-2;
  }
}
</style>