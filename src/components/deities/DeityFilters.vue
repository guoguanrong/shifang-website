<template>
  <!-- 神明分类筛选：按钮组，选中项通过 aria-pressed 标记。 -->
  <nav class="deity-filters" :aria-label="t('deities.filtersLabel')">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      :class="{ 'is-active': modelValue === filter.value }"
      :aria-pressed="modelValue === filter.value"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])

const { t, tm } = useI18n()

// value 使用稳定业务键，切换语言不会破坏当前筛选状态。
const filterValues = ['all', 'wealth', 'career', 'health', 'study', 'peace']
const filters = computed(() => {
  const labels = tm('deities.filters')
  return filterValues.map((value, index) => ({ value, label: labels[index] }))
})
</script>

<style scoped>
/* 标签按钮行，选中态换成实心红底。 */
.deity-filters {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  height: 76px;
}

.deity-filters button {
  width: 93px;
  height: 36px;
  padding: 0 12px;
  color: #2d261f;
  font: inherit;
  font-size: 16px;
  line-height: 36px;
  white-space: nowrap;
  background: url('@/assets/deities/card-tag.svg') center / 100% 100% no-repeat;
  border: 0;
  cursor: pointer;
  transition: color .2s ease, filter .2s ease, transform .2s ease;
}

.deity-filters button:hover,
.deity-filters button:focus-visible {
  filter: brightness(1.04) saturate(1.08);
  transform: translateY(-2px);
}

.deity-filters button:focus-visible {
  outline: 2px solid #9f1b0b;
  outline-offset: 2px;
}

.deity-filters button.is-active {
  color: #fff;
  background-image: none;
  background-color: #a91206;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px #d88e48;
}

/* 小屏允许换行并压缩按钮尺寸。 */
@media (max-width: 760px) {
  .deity-filters {
    gap: 9px;
    height: auto;
    min-height: 106px;
    padding: 0 16px 28px;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .deity-filters button { width: 86px; height: 34px; font-size: 14px; line-height: 34px; }
}

:global(html[data-locale-layout='international'] .deity-filters button) {
  /* 英文标签更长，改为自适应宽度。 */
  width: auto;
  min-width: 104px;
  padding-inline: 18px;
  font-family: var(--font-ui-international);
  font-size: 13px;
}
</style>
