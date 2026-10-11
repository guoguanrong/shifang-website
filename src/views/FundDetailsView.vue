<template>
  <!-- 善款明细页：顶部四项汇总，下方筛选器与流水表共用同一份筛选状态。 -->
  <CommunityDetailShell class="fund-details-page" :title="t('fundDetails.title')" :eyebrow="t('fundDetails.eyebrow')" :section="t('fundDetails.section')" section-to="/cloud-build">
    <template #meta><p>{{ t('fundDetails.subtitle') }}</p></template>
    <!-- 汇总：捐款、支出、笔数、结余，金额按当前语言格式化。 -->
    <section class="fund-summary" :aria-label="t('fundDetails.title')">
      <article v-for="(item, index) in summary" :key="index"><h2>{{ tm('fundDetails.summary')[index] }}</h2><p>{{ item }}</p></article>
    </section>
    <!-- 筛选条件由本页持有，子组件通过 change 事件回传新值。 -->
    <FundDetailsFilters :filters="filters" @change="filters = $event" />
    <p class="fund-preview-note">{{ t('fundDetails.preview') }}</p>
    <!-- 流水表展示过滤后的记录，其重置事件会清空上方筛选条件。 -->
    <FundDetailsLedger :records="records" @reset="resetFilters" />
  </CommunityDetailShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import FundDetailsFilters from '@/components/cloud-build/FundDetailsFilters.vue'
import FundDetailsLedger from '@/components/cloud-build/FundDetailsLedger.vue'
import { filterFundRecords, fundRecordsPreview, fundSummaryPreview } from '@/components/cloud-build/fundDetailsPreview'
import '@/styles/fund-details.css'

const { t, tm, locale } = useI18n()
// 筛选条件（月份、起止日期、类别）集中在父级，便于筛选器与流水表共享。
const filters = ref({ month: '', start: '', end: '', category: '' })
// 预览数据为静态示例，按当前条件在前端过滤。
const records = computed(() => filterFundRecords(fundRecordsPreview, filters.value))
// 汇总金额按当前语言格式化，笔数交给 i18n 复数处理。
const summary = computed(() => {
  const money = value => `$${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }).format(value)}`
  return [money(fundSummaryPreview.donations), money(fundSummaryPreview.expenditure), t('fundDetails.transactions', { count: fundSummaryPreview.transactions }), money(fundSummaryPreview.balance)]
})
// 重置：清空全部筛选条件，展示完整流水。
function resetFilters() { filters.value = { month: '', start: '', end: '', category: '' } }
</script>
