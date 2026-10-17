<template>
  <OfferingPageShell class="lamp-detail-page" :title="lamp.title" :eyebrow="lamp.eyebrow" :subtitle="lamp.description"
    :section="t('lampDetail.section')" section-to="/blessings/lamps">
    <section class="lamp-detail-profile offering-paper">
      <div class="lamp-portrait"><img class="lamp-portrait-border" :src="portraitBorder" alt="" /><img :src="portrait"
          :alt="lamp.title" width="230" height="230" /></div>
      <div class="lamp-detail-copy">
        <h2>{{ t('offerings.lampMeaning') }} · {{ lamp.title }}</h2>
        <p v-for="paragraph in description" :key="paragraph">{{ paragraph }}</p>
        <div class="lamp-detail-quote"><span class="offering-notice-icon" aria-hidden="true"><img :src="noticeIcon"
              alt="" /></span>
          <p>{{ t('offerings.lampMeaningText') }}</p>
        </div>
      </div>
    </section>
    <section class="lamp-detail-merits">
      <OrnateSectionHeading :title="t('offerings.detailMeritsTitle')" />
      <ul>
        <li v-for="(merit, index) in tm('lampDetail.merits')" :key="merit.title">
          <!-- 功德章为整图：图内已含花瓣底与书法字，按当前语言取图。 -->
          <img class="merit-symbol" :src="meritSymbolImages[index]" :alt="merit.symbol" />
          <h3>{{ merit.title }}</h3>
          <p>{{ merit.text }}</p>
        </li>
      </ul>
    </section>
    <section class="lamp-detail-order offering-paper">
      <OrnateSectionHeading :title="t('offerings.orderTitle')" />
      <div class="lamp-material-package">
        <dl>
          <div>
            <dt>{{ t('offerings.lampType') }}</dt>
            <dd>{{ lamp.title }}</dd>
          </div>
          <div>
            <dt>{{ t('offerings.lighting') }}</dt>
            <dd class="lamp-free">{{ t('offerings.free') }}</dd>
          </div>
          <div>
            <dt>{{ t('offerings.materials') }}</dt>
            <dd>{{ t('offerings.materialPackage') }}</dd>
          </div>
        </dl>
        <div class="lamp-materials">
          <article v-for="(material, index) in materials" :key="material.id || material.title || material.name"
            class="lamp-material" :class="{ 'is-incense': index === 1 }">
            <img :src="material.picture || materialImages[index % materialImages.length]" alt="" />
            <div class="lamp-material-caption">
              <h3>{{ material.name || material.title }}</h3>
              <p>{{ material.useType || material.text || material.unit }}</p>
            </div>
          </article>
        </div>
        <div v-if="!lightLoading && (staticLamp || currentLight)" class="lamp-package-total"><span>{{
          t('lampDetail.total') }}</span><strong>${{ price }}</strong></div>
      </div>
      <div v-if="lightLoading" class="lamp-detail-loading" role="status" aria-label="Loading lamp information"><span />
      </div>
      <OfferingOrderForm v-else-if="currentLight || (staticLamp && !route.query.lightId)"
        :key="`${lampId}-${route.query.lightId || ''}`" class="lamp-detail-form" :amount="price" hide-total
        :submit-label="`${t('offerings.pay')}  $${price}`" @submit="details = $event" />
    </section>
    <OfferingNotices :title="t('lampDetail.noticesTitle')" />
    <OfferingDialog v-if="details" :title="lamp.title" :amount="price" :business-id="businessId" :details="details"
      @close="details = null" />
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
import portraitBorder from '@/assets/offerings/lamp-border.svg'
import guangming from '@/assets/offerings/lamp-detail.png'
import guangmingSecond from '@/assets/offerings/lamp-guangming-second.png'
import taisui from '@/assets/offerings/lamp-taisui.png'
import wenchang from '@/assets/offerings/lamp-wenchang.png'
import noticeIcon from '@/assets/offerings/notice-icon.svg'
// 供奉功德章：整图（图内已含花瓣底与书法字），按当前语言取图；「福」暂无多语言图，三语共用。
import symbolHuiZhCN from '@/assets/offerings/merit-symbols/merit-symbol-hui-zh-CN.png'
import symbolHuiEn from '@/assets/offerings/merit-symbols/merit-symbol-hui-en.png'
import symbolAnZhCN from '@/assets/offerings/merit-symbols/merit-symbol-an-zh-CN.png'
import symbolAnEn from '@/assets/offerings/merit-symbols/merit-symbol-an-en.png'
import symbolFu from '@/assets/offerings/merit-symbols/merit-symbol-fu-zh-CN.png'
import oil from '@/assets/offerings/oil.webp'
import incense from '@/assets/offerings/incense.webp'
import prayer from '@/assets/offerings/prayer.webp'
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
  description: staticLamp.value?.description || currentLight.value?.matchGod || '',
  audience: staticLamp.value?.audience || '',
}))
const portrait = computed(() => currentLight.value?.picture || ({ guangming, taisui, wenchang, caishen: guangmingSecond })[props.lampId] || guangming)
// 独立长文仅提供光明灯；其他灯种沿用自身介绍，不套用光明灯的道场资料。
const description = computed(() => props.lampId === 'guangming' ? tm('lampDetail.guangmingDescription') : [lamp.value.description, lamp.value.audience])
// 功德章映射：顺序与语言包 lampDetail.merits 一致（慧、安、福）；简繁同形回退简体图。
const MERIT_SYMBOL_KEYS = ['hui', 'an', 'fu']
const MERIT_SYMBOLS = {
  hui: { 'zh-CN': symbolHuiZhCN, 'zh-TW': symbolHuiZhCN, en: symbolHuiEn },
  an: { 'zh-CN': symbolAnZhCN, 'zh-TW': symbolAnZhCN, en: symbolAnEn },
  fu: { 'zh-CN': symbolFu, 'zh-TW': symbolFu, en: symbolFu },
}
const meritSymbolImages = computed(() => tm('lampDetail.merits').map((item, index) => {
  const set = MERIT_SYMBOLS[MERIT_SYMBOL_KEYS[index]] || {}
  return set[locale.value] || set['zh-CN'] || ''
}))
const materialImages = [oil, incense, prayer]
const materials = computed(() => {
  const configuredMaterials = currentLight.value?.shopItemsList
  if (currentLight.value && Array.isArray(configuredMaterials)) return configuredMaterials
  return tm('lampDetail.materials')
})
const price = computed(() => {
  const configuredPrice = Number(currentLight.value?.price)
  return Number.isFinite(configuredPrice) && currentLight.value?.price !== undefined ? configuredPrice : 88
})

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
