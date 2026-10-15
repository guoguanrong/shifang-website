<template>
  <OfferingPageShell :title="t('offerings.lampTitle')" :eyebrow="t('offerings.lampEyebrow')"
    :subtitle="t('offerings.lampSubtitle')" :section="t('offerings.section')" section-to="/blessings">
    <p class="lamp-intro">{{ t('offerings.lampIntro') }}</p>
    <section class="lamp-selection">
      <OrnateSectionHeading :title="t('offerings.selectionTitle')" />
      <div v-if="loading" class="lamp-list-loading" role="status"><span /></div>
      <EmptyData v-else-if="!lamps.length" :label="emptyLabel" />
      <div v-else class="lamp-grid">
        <article v-for="lamp in lamps" :key="lamp.id" class="lamp-card">
          <RouterLink class="lamp-card-link" :to="lampTo(lamp)" :aria-label="lamp.name" />
          <img class="lamp-card-art" :src="cardArt" alt="" aria-hidden="true" />
          <img class="lamp-card-outline" :src="cardOutline" alt="" aria-hidden="true" />
          <div class="lamp-portrait"><img class="lamp-portrait-border" :src="portraitBorder" alt="" /><img
              :src="lamp.picture || fallbackImage" :alt="lamp.name" width="230" height="230" /></div>
          <h2>{{ lamp.name }}</h2>
          <p v-if="lamp.matchGod">{{ lamp.matchGod }}</p>
          <p class="lamp-period">{{ t('offerings.yearOffering') }}</p>
          <CeremonialButton :label="t('offerings.offerLamp')" @click="router.push(lampTo(lamp))" />
        </article>
      </div>
    </section>
    <section class="lamp-steps offering-paper">
      <OrnateSectionHeading :title="t('offerings.stepsTitle')" />
      <ol class="offering-four-columns">
        <li v-for="(step, index) in tm('offerings.steps')" :key="step.roman">
          <!-- 序号随语言切换：中文用「壹贰叁肆 + 拼音」，其他语言用阿拉伯数字 + 英文序数词。 -->
          <div class="step-symbol"><img :src="stepEmblem" alt="" /><span>{{ stepSymbol(step, index)
              }}</span><small>{{ stepRoman(step, index) }}</small></div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>
    <section class="lamp-merits">
      <OrnateSectionHeading :title="t('offerings.meritsTitle')" />
      <ul class="offering-four-columns">
        <li v-for="(merit, index) in tm('offerings.merits')" :key="merit.title">
          <!-- 功德章为整图：图内已含花瓣底、颜色与书法字，按当前语言取图。 -->
          <img class="merit-symbol" :src="meritSymbolImages[index]" :alt="merit.symbol" />
          <h3>{{ merit.title }}</h3>
          <p>{{ merit.text }}</p>
        </li>
      </ul>
      <p class="merit-quote">{{ t('offerings.meritQuote') }}</p>
    </section>
    <OfferingNotices />
  </OfferingPageShell>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getLightList } from '@/api/light'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingNotices from '@/components/offerings/OfferingNotices.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import EmptyData from '@/components/common/EmptyData.vue'
import cardArt from '@/assets/offerings/lamp-card.webp'
import cardOutline from '@/assets/offerings/lamp-outline.svg'
import portraitBorder from '@/assets/offerings/lamp-border.svg'
import fallbackImage from '@/assets/offerings/lamp-guangming.png'
import stepEmblem from '@/assets/offerings/step-emblem.svg'
// 功德章为整图（图内含花瓣底、颜色与书法字），按当前语言取图。
import symbolHuiZhCN from '@/assets/offerings/merit-symbols/merit-symbol-hui-zh-CN.png'
import symbolHuiEn from '@/assets/offerings/merit-symbols/merit-symbol-hui-en.png'
import symbolShouZhCN from '@/assets/offerings/merit-symbols/merit-symbol-shou-zh-CN.png'
import symbolShouZhTW from '@/assets/offerings/merit-symbols/merit-symbol-shou-zh-TW.png'
import symbolShouEn from '@/assets/offerings/merit-symbols/merit-symbol-shou-en.png'
import symbolCaiZhCN from '@/assets/offerings/merit-symbols/merit-symbol-cai-zh-CN.png'
import symbolCaiZhTW from '@/assets/offerings/merit-symbols/merit-symbol-cai-zh-TW.png'
import symbolCaiEn from '@/assets/offerings/merit-symbols/merit-symbol-cai-en.png'
import symbolAnZhCN from '@/assets/offerings/merit-symbols/merit-symbol-an-zh-CN.png'
import symbolAnEn from '@/assets/offerings/merit-symbols/merit-symbol-an-en.png'
const { t, tm, locale } = useI18n()
const router = useRouter()

// 功德章映射：顺序与语言包 offerings.merits 一致（慧、寿、财、安）。
// 「慧」「安」简繁同形，繁体复用简体图；「壽」「財」有独立繁体图。
const MERIT_SYMBOL_KEYS = ['hui', 'shou', 'cai', 'an']
const MERIT_SYMBOLS = {
  hui: { 'zh-CN': symbolHuiZhCN, 'zh-TW': symbolHuiZhCN, en: symbolHuiEn },
  shou: { 'zh-CN': symbolShouZhCN, 'zh-TW': symbolShouZhTW, en: symbolShouEn },
  cai: { 'zh-CN': symbolCaiZhCN, 'zh-TW': symbolCaiZhTW, en: symbolCaiEn },
  an: { 'zh-CN': symbolAnZhCN, 'zh-TW': symbolAnZhCN, en: symbolAnEn },
}
const meritSymbolImages = computed(() => tm('offerings.merits').map((item, index) => {
  const set = MERIT_SYMBOLS[MERIT_SYMBOL_KEYS[index]] || {}
  return set[locale.value] || set['zh-CN'] || ''
}))
const lamps = ref([])
const loading = ref(true)
const emptyLabel = ref('')

// 步骤序号随语言切换（语言包中的 symbol/roman 为中文数字与拼音，仅中文界面使用）。
const isInternational = computed(() => !locale.value.toLowerCase().startsWith('zh'))
const STEP_SYMBOLS = ['1', '2', '3', '4']
const STEP_ROMANS = ['ONE', 'TWO', 'THREE', 'FOUR']

function stepSymbol(step, index) {
  return isInternational.value ? STEP_SYMBOLS[index] || '' : step.symbol
}

function stepRoman(step, index) {
  return isInternational.value ? STEP_ROMANS[index] || '' : step.roman
}

function lampTo(lamp) {
  return { name: 'lamp-detail', params: { lampId: String(lamp.id) } }
}

onMounted(async () => {
  emptyLabel.value = t('offerings.lampEmpty')
  try {
    const result = await getLightList({ status: 1, page: 1, pageSize: 50 }, { silent: true })
    lamps.value = result?.list || result?.records || result?.rows || []
  } catch (error) {
    lamps.value = []
    if (error?.code === 1005 || error?.code === 1003) emptyLabel.value = t('offerings.lampLogin')
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.lamp-list-loading {
  display: grid;
  min-height: 160px;
  place-items: center;
}

.lamp-list-loading span {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(141, 104, 58, .2);
  border-top-color: #8d683a;
  border-radius: 50%;
  animation: lamp-list-spin .7s linear infinite;
}

@keyframes lamp-list-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
