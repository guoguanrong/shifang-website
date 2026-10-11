<template>
  <!-- 善款筛选：月份快捷选择、自定义日期区间与类别下拉。 -->
  <section class="fund-filters" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ t('fundDetails.filterTitle') }}</h2>
    <div class="fund-months" role="group" :aria-label="t('fundDetails.filterTitle')">
      <button type="button" :aria-pressed="!filters.month && !filters.start && !filters.end" @click="chooseMonth('')">{{ t('fundDetails.all') }}</button>
      <button v-for="month in fundMonths" :key="month" type="button" :aria-pressed="filters.month === month" @click="chooseMonth(month)">{{ month }}</button>
    </div>
    <form class="fund-date-range" @submit.prevent="queryRange">
      <span>{{ t('fundDetails.customRange') }}</span>
      <label class="fund-date-input"><span class="fund-sr-only">{{ t('fundDetails.startDate') }}</span><input v-model="start" type="date" required :aria-describedby="error ? errorId : undefined" /><img :src="calendar" alt="" /></label>
      <span>{{ t('fundDetails.to') }}</span>
      <label class="fund-date-input"><span class="fund-sr-only">{{ t('fundDetails.endDate') }}</span><input v-model="end" type="date" required :aria-describedby="error ? errorId : undefined" /><img :src="calendar" alt="" /></label>
      <button class="fund-query" type="submit">{{ t('fundDetails.search') }}</button>
      <p v-if="error" :id="errorId" class="fund-filter-error" role="alert">{{ t('fundDetails.invalidRange') }}</p>
    </form>
    <label class="fund-category"><span>{{ t('fundDetails.category') }}</span><select :value="filters.category" @change="emit('change', { ...filters, category: $event.target.value })"><option value="">{{ t('fundDetails.allCategories') }}</option><option v-for="category in fundCategories" :key="category" :value="category">{{ t(`fundDetails.categories.${category}`) }}</option></select></label>
  </section>
</template>

<script setup>
import { ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { fundCategories, fundMonths } from './fundDetailsPreview'
import calendar from '@/assets/fund-details/calendar.svg'

const props = defineProps({ filters: { type: Object, required: true } })
const emit = defineEmits(['change'])
const { t } = useI18n()
const headingId = useId()
const errorId = useId()
// 自定义区间的起止日期，默认覆盖当前年份。
const start = ref('2026-01-01')
const end = ref('2026-12-31')
// 起始日期晚于结束日期时为 true，此时不提交筛选。
const error = ref(false)

// 选择月份时清空自定义区间，两种筛选方式互斥。
function chooseMonth(month) {
  error.value = false
  emit('change', { month, start: '', end: '', category: props.filters.category })
}

// 校验日期区间，合法时与类别一起回传给父级。
function queryRange() {
  error.value = start.value > end.value
  if (!error.value) emit('change', { month: '', start: start.value, end: end.value, category: props.filters.category })
}
</script>
