<template>
  <div class="data-table-wrapper">
    <div class="data-table">
      <div class="data-table__header">
        <div class="data-table__cell data-table__cell--index">#</div>
        <div class="data-table__cell data-table__cell--name">{{ $t('table.header.name') }}</div>
        <div class="data-table__cell data-table__cell--age">{{ $t('table.header.age') }}</div>
        <div class="data-table__cell data-table__cell--action">{{ $t('table.header.action') }}</div>
      </div>

      <div class="data-table__body">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          class="data-table__row"
        >
          <div class="data-table__cell data-table__cell--index text-gray">{{ index + 1 }}</div>
          <div class="data-table__cell data-table__cell--name font-bold" :title="item.name">{{ item.name }}</div>
          <div class="data-table__cell data-table__cell--age font-bold" :title="String(item.age)">{{ item.age }}</div>
          <div class="data-table__cell data-table__cell--action">
            <div class="data-table__action-group">
              <EBtn
                color="success"
                class="btn-sm"
                @click="emit('edit', item)"
                :text="$t('btn.btn_edit')"
              />
              <EBtn
                color="error"
                class="btn-sm"
                @click="emit('delete', item.id)"
                :text="$t('btn.btn_delete')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from '~/api/user'
import EBtn from '~/components/EBtn.vue'

defineProps<{
  list: UserInfo[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: UserInfo): void
  (e: 'delete', id: number): void
}>()
</script>

<style scoped lang="scss">
.data-table-wrapper {
  // RWD 核心: 同時處理 X 軸與 Y 軸 overflow
  // h-full + overflow-y-auto: 垂直滾動
  // overflow-x-auto: 當 320px 真的塞不下時，允許左右滑動，避免破版
  @apply h-full w-full overflow-y-auto overflow-x-auto;

  // 卷軸樣式
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px; // 水平卷軸高度
  }
  &::-webkit-scrollbar-track {
    @apply bg-[#1e1e1e] rounded;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-600 rounded hover:bg-gray-500;
  }
}

.data-table {
  // 設定一個極限最小寬度，確保內容不會擠成一團
  // 如果螢幕小於 320，wrapper 會出現卷軸
  @apply w-full min-w-[320px] text-center relative;

  &__header {
    // text-sm: 手機版字體縮小
    // md:text-base: 平板以上恢復正常大小
    @apply flex items-center border-b border-gray-600 text-gray-300 pb-2 font-bold text-sm md:text-base;
    @apply sticky top-0 z-10;
    @apply bg-[#252525];
  }

  &__row {
    // py-3: 手機版減少垂直間距
    // md:py-4: 桌機版恢復
    @apply flex items-center border-b border-gray-700 py-3 md:py-4 transition duration-200 text-sm md:text-base;

    &:last-child {
      @apply border-0;
    }

    &:hover {
      @apply bg-white/5;
    }
  }

  &__cell {
    // --- 序號欄 ---
    &--index {
      // w-8 (2rem): 手機版縮小
      // md:w-12: 桌機版加寬
      @apply w-4 md:w-12 text-center shrink-0;
      &.text-gray { @apply text-gray-400; }
    }

    // --- 彈性內容欄 (名字/年齡) ---
    &--name, &--age {
      // min-w-0: 這是 flex item 能夠正確 truncate 的關鍵
      // truncate: 文字過長顯示 ...
      // px-1: 給一點點內距避免文字黏在一起
      @apply flex-1 text-center min-w-0 truncate px-1;
      &.font-bold { @apply font-bold; }
    }

    // --- 操作欄 ---
    &--action {
      // w-28 (7rem): 手機版緊湊一點
      // md:w-32: 桌機版寬鬆
      @apply w-22 md:w-32 text-center shrink-0;
    }
  }

  &__action-group {
    // gap-1: 手機版按鈕靠緊一點
    // md:gap-2: 桌機版拉開
    @apply flex justify-center items-center gap-1 md:gap-2;
  }
}

// 針對按鈕的響應式調整
// 這裡假設 .btn-sm 會應用到 EBtn 內層
:deep(.btn-sm) {
  // 手機版: 極小的 padding 和文字 (text-xs)
  // md: 平板以上恢復 (text-sm)
  @apply px-2 py-1 text-xs md:px-3 md:text-sm whitespace-nowrap;
}
</style>