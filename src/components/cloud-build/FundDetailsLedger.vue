<template>
  <!-- 善款流水表：分页展示，结果为空时给出重置筛选的入口。 -->
  <section ref="ledger" class="fund-ledger" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ t('fundDetails.listTitle') }}</h2>
    <!-- 结果条数以仅读屏可见的文本播报，方便辅助技术感知筛选结果。 -->
    <p class="fund-sr-only" role="status">{{ t('fundDetails.results', { count: records.length }) }}</p>
    <table v-if="records.length" class="fund-records">
      <caption class="fund-sr-only">{{ t('fundDetails.listTitle') }}</caption>
      <colgroup><col class="fund-date-column" /><col class="fund-category-column" /><col /><col class="fund-amount-column" /></colgroup>
      <thead class="fund-sr-only"><tr><th scope="col">{{ t('fundDetails.date') }}</th><th scope="col">{{ t('fundDetails.category') }}</th><th scope="col">{{ t('fundDetails.recordNumber') }}</th><th scope="col">{{ t('fundDetails.amount') }}</th></tr></thead>
      <tbody><tr v-for="record in visibleRecords" :key="record.id">
        <td class="fund-record-date"><time :datetime="`${record.date}T${record.time}`">{{ record.date }} {{ record.time }}</time></td>
        <td class="fund-record-category"><span>{{ t(`fundDetails.categories.${record.category}`) }}</span></td>
        <td class="fund-record-description"><p>{{ t(record.titleKey) }}</p><small>{{ t('fundDetails.recordNumber') }}: {{ record.reference }}</small></td>
        <td class="fund-record-amount">{{ money(record.amount) }}</td>
      </tr></tbody>
    </table>
    <div v-else class="fund-empty"><p>{{ t('fundDetails.empty') }}</p><button type="button" @click="emit('reset')">{{ t('fundDetails.reset') }}</button></div>
    <!-- 分页：页码中间用省略号折叠，当前页以 aria-current 标记。 -->
    <nav v-if="records.length" class="fund-pagination" :aria-label="t('fundDetails.pagination')">
      <button type="button" :disabled="page === 1" @click="changePage(page - 1)">〈 {{ t('fundDetails.previous') }}</button>
      <template v-for="(item, index) in pageItems" :key="index"><span v-if="item === '…'" aria-hidden="true">…</span><button v-else type="button" :aria-current="page === item ? 'page' : undefined" :aria-label="t('fundDetails.pageLabel', { page: item })" @click="changePage(item)">{{ item }}</button></template>
      <button type="button" :disabled="page === totalPages" @click="changePage(page + 1)">{{ t('fundDetails.next') }} 〉</button>
      <span class="fund-page-summary" role="status">{{ t('fundDetails.pageSummary', { page, total: totalPages, size: pageSize }) }}</span>
    </nav>
  </section>
</template>

<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ records: { type: Array, required: true } })
const emit = defineEmits(['reset'])
const { t, locale } = useI18n()
const headingId = useId()
const ledger = ref(null)
// 当前页码与每页条数（固定 20 条）。
const page = ref(1)
const pageSize = 20
const totalPages = computed(() => Math.max(1, Math.ceil(props.records.length / pageSize)))
const visibleRecords = computed(() => props.records.slice((page.value - 1) * pageSize, page.value * pageSize))
// 页码按钮：始终包含首尾页与当前页附近，间隔超过 1 页时补省略号。
const pageItems = computed(() => {
  const pages = new Set([1, totalPages.value, page.value - 1, page.value, page.value + 1])
  if (page.value <= 3) [2, 3, 4, 5].forEach(value => pages.add(value))
  if (page.value >= totalPages.value - 2) [totalPages.value - 4, totalPages.value - 3].forEach(value => pages.add(value))
  const sorted = [...pages].filter(value => value >= 1 && value <= totalPages.value).sort((a, b) => a - b)
  return sorted.flatMap((value, index) => index && value - sorted[index - 1] > 1 ? ['…', value] : [value])
})
// 金额按当前语言格式化。
const money = value => `$${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }).format(value)}`
// 记录变化（例如重新筛选）时回到第 1 页。
watch(() => props.records, () => { page.value = 1 })

// 翻页后把流水表滚回视口内的合适位置。
function changePage(value) {
  page.value = Math.min(totalPages.value, Math.max(1, value))
  const top = ledger.value.getBoundingClientRect().top + window.scrollY - 120
  window.scrollTo({ top, behavior: 'instant' })
}
</script>
