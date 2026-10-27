<template>
  <!-- 神明供奉页：供奉对象由地址栏 ?deity= 决定，方案选择与下单表单都在本页完成。 -->
  <OfferingPageShell :title="t('offerings.deityTitle')" :eyebrow="t('offerings.deityEyebrow')"
    :subtitle="t('offerings.deitySubtitle')" :section="t('deityDetail.section')" section-to="/deities">
    <!-- 神龛示意区：神像、供桌、烛台、香炉与名牌都是展示素材。 -->
    <section class="shrine-display offering-paper">
      <div class="shrine-deity-heading"><img :src="shrineEmblem" alt="" />
        <p>{{ t('offerings.deityLabel') }}</p>
        <h2>{{ deity.title }}</h2>
      </div>
      <h3 class="shrine-example-heading"><img :src="headingLeft" alt="" /><span>{{ t('offerings.shrineTitle')
          }}</span><img :src="headingRight" alt="" /></h3>
      <!-- <div class="shrine-photo"><img :src="shrine" :alt="t('offerings.shrineAlt')" /></div> -->
      <div class="shrine-altar">
        <img class="altar-table" :src="altar" alt="" />
        <img class="altar-candle left" :src="candle" alt="" /><img class="altar-censer" :src="censer" alt="" /><img
          class="altar-candle right" :src="candle" alt="" />
        <p class="altar-nameplate">{{ t('offerings.nameplate') }}</p>
      </div>
      <p class="shrine-caption"><span class="offering-notice-icon" aria-hidden="true"><img :src="noticeIcon"
            alt="" /></span><span>{{ deity.title }} · {{ t('offerings.shrineCaption') }}</span></p>
    </section>
    <!-- 供奉方案与下单表单：选中的方案决定金额与弹窗文案。 -->
    <section class="deity-offering-order offering-paper">
      <OrnateSectionHeading :title="t('offerings.plansTitle')" />
      <p v-if="loading" class="worship-status" role="status">{{ t('offerings.worshipLoading') }}</p>
      <p v-else-if="!worship" class="worship-status" role="status">
        {{ t(loadError ? 'offerings.worshipLoadFailed' : 'offerings.worshipUnavailable') }}
      </p>
      <div v-else class="deity-order-inner">
        <div v-if="plans.length" class="offering-plans" role="group" :aria-label="t('offerings.plansTitle')">
          <button v-for="plan in plans" :key="plan.id" class="offering-plan" type="button"
            :aria-pressed="selectedPlanId === plan.id" @click="selectPlan(plan)">
            <span class="plan-price">${{ formatPrice(plan.price) }}</span>
            <span class="plan-title">{{ plan.useType || plan.name || t('offerings.plansTitle') }}</span>
          </button>
        </div>
        <div class="custom-offering-amount">
          <label for="deity-custom-amount">{{ t('offerings.customAmount') }}</label>
          <div class="custom-offering-amount__input">
            <span aria-hidden="true">$</span>
            <input id="deity-custom-amount" v-model="customAmount" type="number" min="100" step="any"
              inputmode="decimal" :placeholder="t('offerings.customAmountPlaceholder')"
              :aria-invalid="customAmount !== '' && !customAmountValid"
              :aria-describedby="customAmount !== '' && !customAmountValid ? 'deity-custom-amount-error' : undefined"
              @input="onCustomAmountInput" />
          </div>
        </div>
        <p v-if="customAmount !== '' && !customAmountValid" id="deity-custom-amount-error"
          class="custom-offering-amount__error" role="status">
          {{ t('offerings.customAmountRequired') }}
        </p>
        <OfferingOrderForm kind="deity" :amount="selectedAmount" :submit-disabled="!canSubmitOffering"
          @submit="submitOffering" />
      </div>
    </section>
    <!-- details 非空即打开下单确认弹窗，关闭时置空。 -->
    <OfferingDialog v-if="details" kind="deity" :title="deity.title" :amount="selectedAmount"
      :plan-label="selectedPlanLabel" :business-id="worship?.id" :details="details"
      @close="details = null" />
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
import altar from '@/assets/offerings/altar.webp'
import candle from '@/assets/offerings/candle.svg'
import censer from '@/assets/offerings/censer.svg'
import shrineEmblem from '@/assets/offerings/shrine-emblem.svg'
import headingLeft from '@/assets/offerings/heading-left.svg'
import headingRight from '@/assets/offerings/heading-right.svg'
import noticeIcon from '@/assets/offerings/notice-icon.svg'
import { getWorshipByGodName } from '@/api/worship'
import { deityGodNames } from '@/data/deityWorship'
const { t, tm, locale } = useI18n()
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
const selectedPlanId = ref(null)
const customAmount = ref('')
const plans = computed(() => {
  const items = Array.isArray(worship.value?.shopItemsList) ? worship.value.shopItemsList : []
  return items
    .filter((item) => Number(item?.id) > 0
      && (item.type == null || Number(item.type) === 1)
      && Number(item.status) !== 2 && Number.isFinite(Number(item.price)) && Number(item.price) > 0)
    .slice()
    .sort((left, right) => Number(left.seq || 0) - Number(right.seq || 0))
})
const activePlan = computed(() => plans.value.find((plan) => plan.id === selectedPlanId.value) || null)
const customAmountValid = computed(() => {
  const amount = Number(customAmount.value)
  return customAmount.value !== '' && Number.isFinite(amount) && amount >= 100
})
const selectedAmount = computed(() => activePlan.value
  ? Number(activePlan.value.price)
  : customAmountValid.value ? Number(customAmount.value) : 0)
const selectedPlanLabel = computed(() => activePlan.value?.useType || activePlan.value?.name || t('offerings.customAmount'))
const canSubmitOffering = computed(() => activePlan.value
  ? Number(activePlan.value.price) > 0
  : customAmountValid.value)
const details = ref(null)

function formatPrice(value) {
  const price = Number(value)
  return Number.isFinite(price) ? price.toLocaleString(locale.value, { maximumFractionDigits: 2 }) : '0'
}

function selectPlan(plan) {
  selectedPlanId.value = plan.id
  customAmount.value = ''
}

function onCustomAmountInput() {
  selectedPlanId.value = null
}

function submitOffering(formDetails) {
  if (!canSubmitOffering.value) return
  details.value = formDetails
}

let requestSequence = 0
async function loadWorship() {
  const sequence = ++requestSequence
  const godName = deityGodNames[selectedDeityId.value]
  worship.value = null
  loadError.value = false
  details.value = null
  selectedPlanId.value = null
  customAmount.value = ''

  if (!godName) {
    loadError.value = true
    return
  }

  loading.value = true
  try {
    const result = await getWorshipByGodName(godName)
    if (sequence === requestSequence) {
      worship.value = result || null
      selectedPlanId.value = plans.value[plans.value.length - 1]?.id ?? null
    }
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

.deity-order-inner {
  width: 100%;
}

.deity-order-inner .offering-plans {
  display: grid;
  width: min(100%, 1043px);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 41px;
  margin: 0 auto;
  padding-top: 0;
}

.deity-order-inner .offering-plan {
  display: flex;
  min-width: 0;
  min-height: 160px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 18px 10px;
  color: #333;
  text-align: center;
  background: linear-gradient(180deg, #fff 0%, #f8f5f1 100%);
  border: 1px solid #c29f79;
  border-radius: 20px;
  box-shadow: inset 0 0 0 5px #fff, inset 0 0 0 6px #f3d5b5;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.deity-order-inner .offering-plan[aria-pressed='true'] {
  background: linear-gradient(180deg, #fff 0%, #f8f5f1 100%);
  border: 5px solid #d7b591;
  box-shadow: 0 4px 10px rgb(0 0 0 / 12%), inset 0 0 0 1px #f3d5b5;
}

.deity-order-inner .offering-plan:focus-visible {
  outline: 2px solid #c73412;
  outline-offset: 3px;
}

@media (hover: hover) and (pointer: fine) {
  .deity-order-inner .offering-plan:hover {
    transform: translateY(-2px);
  }
}

.deity-order-inner .plan-price {
  margin: 0;
  color: #cc3513;
  font-family: var(--font-calligraphy);
  font-size: 30px;
  line-height: 1.15;
  white-space: nowrap;
}

.deity-order-inner .plan-title {
  overflow: hidden;
  max-width: 100%;
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: 1px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-offering-amount {
  display: grid;
  width: min(100%, 1054px);
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  margin: 30px auto 0;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  letter-spacing: 1px;
}

.custom-offering-amount__input {
  display: flex;
  min-width: 0;
  max-width: 934px;
  height: 60px;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  background: #fff;
  border: 1px solid #c29f79;
  border-radius: 999px;
}

.custom-offering-amount__input > span {
  color: #333;
}

.custom-offering-amount__input input {
  width: 100%;
  min-width: 0;
  padding: 0;
  color: #333;
  font: inherit;
  letter-spacing: 0;
  background: transparent;
  border: 0;
  outline: none;
}

.custom-offering-amount__input input::placeholder {
  color: #a9a9a9;
  opacity: 1;
}

.custom-offering-amount__input:focus-within {
  border-color: #c73412;
  box-shadow: 0 0 0 2px rgb(199 52 18 / 12%);
}

.custom-offering-amount__error {
  width: min(100%, 1054px);
  margin: 8px auto 0;
  color: #a53a24;
  font-size: 13px;
}

@media (max-width: 1100px) {
  .deity-order-inner .offering-plans {
    gap: 20px;
  }
}

@media (max-width: 760px) {
  .deity-order-inner .offering-plans {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .deity-order-inner .offering-plan {
    min-height: 140px;
  }

  .deity-order-inner .plan-price {
    font-size: 26px;
  }

  .custom-offering-amount {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deity-order-inner .offering-plan {
    transition: none;
  }
}
</style>
