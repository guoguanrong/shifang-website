<template>
  <!-- 神明供奉页：供奉对象由地址栏 ?deity= 决定，方案选择与下单表单都在本页完成。 -->
  <OfferingPageShell :title="t('offerings.deityTitle')" :eyebrow="t('offerings.deityEyebrow')" :subtitle="t('offerings.deitySubtitle')" :section="t('deityDetail.section')" section-to="/deities">
    <!-- 神龛示意区：神像、供桌、烛台、香炉与名牌都是展示素材。 -->
    <section class="shrine-display offering-paper">
      <div class="shrine-deity-heading"><img :src="shrineEmblem" alt="" /><p>{{ t('offerings.deityLabel') }}</p><h2>{{ deity.title }}</h2></div>
      <h3 class="shrine-example-heading"><img :src="headingLeft" alt="" /><span>{{ t('offerings.shrineTitle') }}</span><img :src="headingRight" alt="" /></h3>
      <div class="shrine-photo"><img :src="shrine" :alt="t('offerings.shrineAlt')" /></div>
      <div class="shrine-altar">
        <img class="altar-table" :src="altar" alt="" />
        <img class="altar-candle left" :src="candle" alt="" /><img class="altar-censer" :src="censer" alt="" /><img class="altar-candle right" :src="candle" alt="" />
        <p class="altar-nameplate">{{ t('offerings.nameplate') }}</p>
      </div>
      <p class="shrine-caption"><span class="offering-notice-icon" aria-hidden="true"><img :src="noticeIcon" alt="" /></span><span>{{ deity.title }} · {{ t('offerings.shrineCaption') }}</span></p>
    </section>
    <!-- 供奉方案与下单表单：选中的方案决定金额、周期与弹窗文案。 -->
    <section class="deity-offering-order offering-paper">
      <OrnateSectionHeading :title="t('offerings.plansTitle')" />
      <p v-if="loading" class="worship-status" role="status">{{ t('offerings.worshipLoading') }}</p>
      <p v-else-if="!worship" class="worship-status" role="status">
        {{ t(loadError ? 'offerings.worshipLoadFailed' : 'offerings.worshipUnavailable') }}
      </p>
      <div v-else class="deity-order-inner">
        <div class="offering-plans" role="group" :aria-label="t('offerings.plansTitle')">
          <button v-for="plan in plans" :key="plan.id" class="offering-plan" :class="plan.id" type="button" :aria-pressed="selectedPlan === plan.id" @click="selectedPlan = plan.id">
            <img :src="plan.image" alt="" /><span v-if="plan.id === 'yearly' && yearlySavings > 0" class="plan-saving">{{ t('offerings.saving', { amount: formatPrice(yearlySavings) }) }}</span>
            <span class="plan-title">{{ t(`offerings.${plan.id}`) }}</span><span class="plan-description">{{ t(`offerings.${plan.id}Text`) }}</span>
            <span class="plan-price">${{ formatPrice(plan.amount) }}<small> / {{ t(`offerings.${plan.period}`) }}</small></span>
          </button>
        </div>
        <OfferingOrderForm kind="deity" :amount="activePlan.amount" :period="t(`offerings.${activePlan.period}`)" @submit="details = $event" />
      </div>
    </section>
    <!-- details 非空即打开下单确认弹窗，关闭时置空。 -->
    <OfferingDialog v-if="details" kind="deity" :title="deity.title" :amount="activePlan.amount" :period="t(`offerings.${activePlan.period}`)" :plan-label="t(`offerings.${activePlan.id}`)" :details="details" @close="details = null" />
  </OfferingPageShell>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingOrderForm from '@/components/offerings/OfferingOrderForm.vue'
import OfferingDialog from '@/components/offerings/OfferingDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import shrine from '@/assets/offerings/shrine.webp'
import altar from '@/assets/offerings/altar.png'
import candle from '@/assets/offerings/candle.svg'
import censer from '@/assets/offerings/censer.svg'
import shrineEmblem from '@/assets/offerings/shrine-emblem.svg'
import headingLeft from '@/assets/offerings/heading-left.svg'
import headingRight from '@/assets/offerings/heading-right.svg'
import noticeIcon from '@/assets/offerings/notice-icon.svg'
import monthly from '@/assets/offerings/monthly.png'
import yearly from '@/assets/offerings/yearly.png'
import { getWorshipByGodName } from '@/api/worship'
import { deityGodNames } from '@/data/deityWorship'
const { t, tm } = useI18n()
const route = useRoute()
const selectedDeityId = computed(() => (
  typeof route.query.deity === 'string' && deityGodNames[route.query.deity]
    ? route.query.deity
    : 'doumu'
))
const deity = computed(() => {
  const entries = [tm('deities.featured'), ...tm('deities.cards')]
  return entries.find((item) => item.id === selectedDeityId.value) || tm('deities.featured')
})
const worship = ref(null)
const loading = ref(false)
const loadError = ref(false)
const selectedPlan = ref('yearly')
const plans = computed(() => [
  { id: 'monthly', amount: Number(worship.value?.monthPrice ?? 0), period: 'month', image: monthly },
  { id: 'yearly', amount: Number(worship.value?.yearPrice ?? 0), period: 'year', image: yearly },
])
const activePlan = computed(() => plans.value.find((plan) => plan.id === selectedPlan.value) || plans.value[0])
const yearlySavings = computed(() => Math.max(0, plans.value[0].amount * 12 - plans.value[1].amount))
const details = ref(null)

function formatPrice(value) {
  const price = Number(value)
  return Number.isFinite(price) ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'
}

let requestSequence = 0
async function loadWorship() {
  const sequence = ++requestSequence
  const godName = deityGodNames[selectedDeityId.value]
  worship.value = null
  loadError.value = false
  details.value = null
  selectedPlan.value = 'yearly'

  if (!godName) {
    loadError.value = true
    return
  }

  loading.value = true
  try {
    const result = await getWorshipByGodName(godName)
    if (sequence === requestSequence) worship.value = result || null
  } catch {
    if (sequence === requestSequence) loadError.value = true
  } finally {
    if (sequence === requestSequence) loading.value = false
  }
}

watch(selectedDeityId, loadWorship, { immediate: true })
</script>

<style scoped>
.worship-status {
  margin: 40px auto;
  color: #8e6e49;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
}
</style>
