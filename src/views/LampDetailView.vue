<template>
  <OfferingPageShell class="lamp-detail-page" :title="lamp.title" :eyebrow="lamp.eyebrow" :subtitle="lamp.description"
    :section="t('lampDetail.section')" section-to="/blessings/lamps">
    <section class="lamp-detail-profile offering-paper">
      <img class="lamp-detail-profile__shell" :src="profilePanelUnion" alt="" aria-hidden="true" />
      <div class="lamp-detail-profile__background" aria-hidden="true">
        <img class="lamp-detail-profile__glow" :src="profileGlow" alt="" />
        <img class="lamp-detail-profile__fill" :src="profilePanelFill" alt="" />
      </div>
      <div class="lamp-detail-profile__content">
        <div class="lamp-detail-profile__portrait">
          <img class="lamp-detail-profile__ring" :src="profileLampRing" alt="" />
          <img class="lamp-detail-profile__lamp" :src="portrait" :alt="lamp.title" />
        </div>
        <div class="lamp-detail-copy">
          <h2>{{ t('offerings.lampMeaning') }} · {{ lamp.title }}</h2>
          <p v-for="paragraph in description" :key="paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </section>
    <section class="lamp-detail-merits">
      <OrnateSectionHeading :title="t('offerings.detailMeritsTitle')" />
      <ul>
        <li v-for="(merit, index) in tm('lampDetail.merits')" :key="merit.title">
          <!-- 功德章为整图：图内已含花瓣底与书法字，按当前语言取图。 -->
          <img class="merit-symbol" :src="meritSymbolImages[index]" :alt="merit.symbol" />
          <p>{{ merit.text }}</p>
        </li>
      </ul>
    </section>
    <section class="lamp-detail-order offering-paper">
      <OrnateSectionHeading :title="t('offerings.orderTitle')" />
      <div class="lamp-material-package">
        <div class="lamp-materials">
          <article v-for="(material, index) in materials" :key="material.id || material.name || material.title || index"
            class="lamp-material" :class="{ 'is-incense': index === 1 }">
            <div class="lamp-material-visual">
              <img :src="material.displayImage" alt="" />
              <span class="lamp-material-fade" aria-hidden="true" />
              <h3>{{ material.displayName }}</h3>
            </div>
            <p>{{ material.displayText }}</p>
          </article>
        </div>

        <img class="lamp-package-divider" :src="packageDivider" alt="" aria-hidden="true" />

        <dl class="lamp-package-details">
          <div class="lamp-package-row">
            <dt>{{ t('lampDetail.packageInfo.lampName') }}</dt>
            <dd>{{ lamp.title }}</dd>
          </div>
          <div class="lamp-package-row">
            <dt>{{ t('lampDetail.packageInfo.incenseLabel') }}</dt>
            <dd>{{ t('lampDetail.packageInfo.incenseValue') }}</dd>
          </div>
          <div class="lamp-package-row">
            <dt>{{ t('lampDetail.packageInfo.waterLabel') }}</dt>
            <dd>{{ t('lampDetail.packageInfo.waterValue') }}</dd>
          </div>
          <div class="lamp-package-row">
            <dt>{{ t('lampDetail.packageInfo.prayerLabel') }}</dt>
            <dd>{{ t('lampDetail.packageInfo.prayerValue') }}</dd>
          </div>
          <div class="lamp-package-row lamp-package-select-row">
            <dt>{{ t('lampDetail.packageInfo.selectType') }}</dt>
            <dd class="lamp-plan-options" role="group" :aria-label="t('lampDetail.packageInfo.selectType')">
              <button type="button" class="lamp-plan-option" :class="{ 'is-selected': selectedPlan === 'daily' }"
                :aria-pressed="selectedPlan === 'daily'" @click="selectPlan('daily')">
                <strong>{{ t('lampDetail.packageInfo.daily') }}</strong>
                <small>{{ t('lampDetail.packageInfo.dailyPrice', { price: formatMoney(planPrices.daily) }) }}</small>
              </button>
              <button type="button" class="lamp-plan-option" :class="{ 'is-selected': selectedPlan === 'monthly' }"
                :aria-pressed="selectedPlan === 'monthly'" @click="selectPlan('monthly')">
                <strong>{{ t('lampDetail.packageInfo.monthly') }}</strong>
                <small>{{ t('lampDetail.packageInfo.monthlyPrice') }}</small>
              </button>
              <button type="button" class="lamp-plan-option" :class="{ 'is-selected': selectedPlan === 'yearly' }"
                :aria-pressed="selectedPlan === 'yearly'" @click="selectPlan('yearly')">
                <strong>{{ t('lampDetail.packageInfo.yearly') }}</strong>
                <small>{{ t('lampDetail.packageInfo.yearlyPrice') }}</small>
              </button>
              <label class="lamp-plan-option is-custom" :class="{ 'is-selected': selectedPlan === 'custom' }">
                <strong>$</strong>
                <input id="lamp-custom-amount" v-model="customAmount" type="number" min="0.01" step="0.01"
                  inputmode="decimal" :placeholder="t('lampDetail.packageInfo.customAmount')"
                  :aria-label="t('lampDetail.packageInfo.customAmount')"
                  :aria-invalid="selectedPlan === 'custom' && !customAmountValid"
                  :aria-describedby="selectedPlan === 'custom' && !customAmountValid ? 'lamp-custom-amount-error' : undefined"
                  @focus="selectPlan('custom')" @input="selectPlan('custom')" />
              </label>
            </dd>
          </div>
          <div class="lamp-package-row lamp-package-select-row">
            <dt>{{ t('lampDetail.packageInfo.selectDays') }}</dt>
            <dd class="lamp-day-adjuster">
              <button type="button" :aria-label="t('lampDetail.packageInfo.minus')" :disabled="durationCount <= 1"
                @click="adjustDuration(-1)"><img :src="dayMinus" alt="" /></button>
              <input v-model="durationInput" type="number" min="1" step="1" inputmode="numeric"
                :aria-label="t('lampDetail.packageInfo.selectDays')" :aria-valuetext="durationLabel"
                @change="normalizeDuration" @blur="normalizeDuration" />
              <button type="button" :aria-label="t('lampDetail.packageInfo.plus')" @click="adjustDuration(1)">
                <img :src="dayPlus" alt="" />
              </button>
            </dd>
          </div>
        </dl>

        <div v-if="!lightLoading && (staticLamp || currentLight)" class="lamp-package-total">
          <span>{{ t('lampDetail.packageInfo.packageTotal') }}</span>
          <strong>${{ formattedTotal }} <small>/ {{ durationLabel }}</small></strong>
        </div>
        <p v-if="selectedPlan === 'custom' && !customAmountValid" id="lamp-custom-amount-error" class="lamp-custom-amount-error" role="status">
          {{ t('lampDetail.packageInfo.customAmountRequired') }}
        </p>
      </div>
      <div v-if="lightLoading" class="lamp-detail-loading" role="status" aria-label="Loading lamp information"><span />
      </div>
      <OfferingOrderForm v-else-if="currentLight || (staticLamp && !route.query.lightId)"
        :key="`${lampId}-${route.query.lightId || ''}`" class="lamp-detail-form" :amount="totalAmount" hide-total
        :submit-disabled="!canSubmitOffering" @submit="details = $event" />
    </section>
    <OfferingNotices :title="t('lampDetail.noticesTitle')" />
    <OfferingDialog v-if="details" :title="lamp.title" :amount="totalAmount" :period="durationLabel"
      :business-id="businessId" :details="details" @close="details = null" />
  </OfferingPageShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getLightById } from '@/api/light'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingOrderForm from '@/components/offerings/OfferingOrderForm.vue'
import OfferingDialog from '@/components/offerings/OfferingDialog.vue'
import OfferingNotices from '@/components/offerings/OfferingNotices.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import profileGlow from '@/assets/offerings/lamp-detail-profile-v2/profile-glow.png'
import profileLampRing from '@/assets/offerings/lamp-detail-profile-v2/profile-lamp-ring.svg'
import profilePanelFill from '@/assets/offerings/lamp-detail-profile-v2/profile-panel-fill.svg'
import profilePanelUnion from '@/assets/offerings/lamp-detail-profile-v2/profile-panel-union.svg'
import guangming from '@/assets/offerings/lamp-detail.png'
import guangmingSecond from '@/assets/offerings/lamp-guangming-second.png'
import taisui from '@/assets/offerings/lamp-taisui.png'
import wenchang from '@/assets/offerings/lamp-wenchang.png'
// 供奉功德章：整图（图内已含花瓣底与书法字），按当前语言取图；「顺」「福」暂无多语言图，三语共用。
import symbolShun from '@/assets/offerings/merit-symbols/merit-symbol-shun-zh-CN.png'
import symbolAnZhCN from '@/assets/offerings/merit-symbols/merit-symbol-an-zh-CN.png'
import symbolAnEn from '@/assets/offerings/merit-symbols/merit-symbol-an-en.png'
import symbolFu from '@/assets/offerings/merit-symbols/merit-symbol-fu-zh-CN.png'
import lampMaterialImage from '@/assets/offerings/lamp-package/lamp.webp'
import incenseMaterialImage from '@/assets/offerings/lamp-package/incense.webp'
import waterMaterialImage from '@/assets/offerings/lamp-package/water.webp'
import prayerMaterialImage from '@/assets/offerings/lamp-package/prayer.webp'
import packageDivider from '@/assets/offerings/lamp-package/divider.svg'
import dayMinus from '@/assets/offerings/lamp-package/minus.svg'
import dayPlus from '@/assets/offerings/lamp-package/plus.svg'
import '@/styles/lamp-detail.css'

const props = defineProps({ lampId: { type: String, required: true } })
const { t, tm, locale } = useI18n()
const route = useRoute()
const currentLight = ref(null)
const lightLoading = ref(false)
const details = ref(null)
const staticLamp = computed(() => tm('offerings.lamps').find(item => item.id === props.lampId))
const lamp = computed(() => ({
  id: props.lampId,
  title: currentLight.value?.name || staticLamp.value?.title || t('offerings.lampTitle'),
  eyebrow: staticLamp.value?.eyebrow || t('offerings.lampEyebrow'),
  description: staticLamp.value?.description || currentLight.value?.matchCrowd || '',
  audience: staticLamp.value?.audience || '',
}))
const portrait = computed(() => currentLight.value?.picture || ({ guangming, taisui, wenchang, caishen: guangmingSecond })[props.lampId] || guangming)
// 独立长文仅提供光明灯；其他灯种沿用自身介绍，不套用光明灯的道场资料。
const description = computed(() => props.lampId === 'guangming' ? tm('lampDetail.guangmingDescription') : [lamp.value.description, lamp.value.audience])
// 功德章映射：顺序与语言包 lampDetail.merits 一致（顺、福、安）。
// 「顺」「福」暂无独立多语言章图，三语共用简体图；「安」有单独英文章图。
const MERIT_SYMBOL_KEYS = ['shun', 'fu', 'an']
const MERIT_SYMBOLS = {
  shun: { 'zh-CN': symbolShun, 'zh-TW': symbolShun, en: symbolShun },
  fu: { 'zh-CN': symbolFu, 'zh-TW': symbolFu, en: symbolFu },
  an: { 'zh-CN': symbolAnZhCN, 'zh-TW': symbolAnZhCN, en: symbolAnEn },
}
const meritSymbolImages = computed(() => tm('lampDetail.merits').map((item, index) => {
  const set = MERIT_SYMBOLS[MERIT_SYMBOL_KEYS[index]] || {}
  return set[locale.value] || set['zh-CN'] || ''
}))
const materialImages = [lampMaterialImage, incenseMaterialImage, waterMaterialImage, prayerMaterialImage]
const materials = computed(() => {
  const defaults = tm('lampDetail.materials')
  const configuredMaterials = currentLight.value?.shopItemsList
  const source = Array.isArray(configuredMaterials) ? configuredMaterials : []
  const count = Math.max(defaults.length, source.length)

  return Array.from({ length: count }, (_, index) => {
    const material = source[index] || defaults[index] || {}
    const fallback = defaults[index] || {}
    return {
      ...material,
      displayName: material.name || material.title || fallback.title || '',
      displayText: material.useType || material.text || material.unit || fallback.text || '',
      displayImage: material.picture || material.image || materialImages[index % materialImages.length],
    }
  })
})
const selectedPlan = ref('daily')
const durationInput = ref(1)
const customAmount = ref('')
const planPrices = computed(() => {
  const configuredDailyPrice = Number(currentLight.value?.price)
  return {
    daily: currentLight.value?.price !== undefined && currentLight.value?.price !== null && Number.isFinite(configuredDailyPrice) && configuredDailyPrice > 0
      ? configuredDailyPrice
      : 10,
    monthly: 288,
    yearly: 3300,
  }
})
const durationCount = computed(() => {
  const count = Math.floor(Number(durationInput.value))
  return Number.isFinite(count) ? Math.max(1, count) : 1
})
const customAmountValid = computed(() => {
  const amount = Number(customAmount.value)
  return customAmount.value !== '' && Number.isFinite(amount) && amount > 0
})
const unitPrice = computed(() => selectedPlan.value === 'custom'
  ? (customAmountValid.value ? Number(customAmount.value) : 0)
  : planPrices.value[selectedPlan.value])
const totalAmount = computed(() => Math.round(unitPrice.value * durationCount.value * 100) / 100)
const formattedTotal = computed(() => new Intl.NumberFormat(locale.value, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(totalAmount.value))
const durationLabel = computed(() => {
  const period = selectedPlan.value === 'monthly' ? 'month' : selectedPlan.value === 'yearly' ? 'year' : 'day'
  const plural = durationCount.value === 1 ? '' : 's'
  const unit = t(`lampDetail.packageInfo.${period}${plural}`)
  return ['zh-CN', 'zh-TW'].includes(locale.value) ? `${durationCount.value}${unit}` : `${durationCount.value} ${unit}`
})
const canSubmitOffering = computed(() => selectedPlan.value !== 'custom' || customAmountValid.value)

function formatMoney(amount) {
  return new Intl.NumberFormat(locale.value, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount)
}

function selectPlan(plan) {
  selectedPlan.value = plan
}

function normalizeDuration() {
  durationInput.value = durationCount.value
}

function adjustDuration(change) {
  durationInput.value = durationCount.value + change
}

const businessId = computed(() => currentLight.value?.id || (/^\d+$/.test(String(props.lampId)) ? props.lampId : null))
const requestedLightId = computed(() => /^\d+$/.test(String(props.lampId)) ? props.lampId : (route.query.lightId || ''))

let lightRequestVersion = 0
watch(requestedLightId, async (id) => {
  const requestVersion = ++lightRequestVersion
  currentLight.value = null
  details.value = null
  lightLoading.value = Boolean(id)
  if (!id) return
  try {
    const light = await getLightById(id)
    if (requestVersion === lightRequestVersion) currentLight.value = light
  } catch {
    if (requestVersion === lightRequestVersion) currentLight.value = null
  } finally {
    if (requestVersion === lightRequestVersion) lightLoading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.lamp-detail-loading {
  display: grid;
  min-height: 72px;
  place-items: center;
}

.lamp-detail-loading span {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(141, 104, 58, .2);
  border-top-color: #8d683a;
  border-radius: 50%;
  animation: lamp-loading-spin .7s linear infinite;
}

@keyframes lamp-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
