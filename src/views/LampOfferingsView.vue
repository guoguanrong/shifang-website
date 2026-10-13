<template>
  <OfferingPageShell :title="t('offerings.lampTitle')" :eyebrow="t('offerings.lampEyebrow')" :subtitle="t('offerings.lampSubtitle')" :section="t('offerings.section')" section-to="/blessings">
    <p class="lamp-intro">{{ t('offerings.lampIntro') }}</p>
    <section class="lamp-selection">
      <OrnateSectionHeading :title="t('offerings.selectionTitle')" />
      <div class="lamp-grid">
        <article v-for="(lamp, index) in lamps" :key="index" class="lamp-card">
          <RouterLink class="lamp-card-link" :to="{ name: 'lamp-detail', params: { lampId: lamp.id } }" :aria-label="lamp.title" />
          <img class="lamp-card-art" :src="cardArt" alt="" aria-hidden="true" />
          <img class="lamp-card-outline" :src="cardOutline" alt="" aria-hidden="true" />
          <div class="lamp-portrait"><img class="lamp-portrait-border" :src="portraitBorder" alt="" /><img :src="lamp.image" :alt="lamp.title" width="230" height="230" /></div>
          <span v-if="index === 1" class="lamp-recommended">{{ t('offerings.recommended') }}</span>
          <h2>{{ lamp.title }}</h2><p>{{ lamp.description }}<br />{{ lamp.audience }}</p>
          <p class="lamp-period">{{ t('offerings.yearOffering') }}</p>
          <CeremonialButton :label="t('offerings.offerLamp')" @click="router.push({ name: 'lamp-detail', params: { lampId: lamp.id } })" />
        </article>
      </div>
    </section>
    <section class="lamp-steps offering-paper">
      <OrnateSectionHeading :title="t('offerings.stepsTitle')" />
      <ol class="offering-four-columns"><li v-for="step in tm('offerings.steps')" :key="step.roman"><div class="step-symbol"><img :src="stepEmblem" alt="" /><span>{{ step.symbol }}</span><small>{{ step.roman }}</small></div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></li></ol>
    </section>
    <section class="lamp-merits">
      <OrnateSectionHeading :title="t('offerings.meritsTitle')" />
      <ul class="offering-four-columns"><li v-for="(merit, index) in tm('offerings.merits')" :key="merit.title"><div class="merit-symbol"><img class="merit-border" :src="meritBorder" alt="" /><img class="merit-leaf" :src="meritImages[index]" alt="" /><span>{{ merit.symbol }}</span></div><h3>{{ merit.title }}</h3><p>{{ merit.text }}</p></li></ul>
      <p class="merit-quote">{{ t('offerings.meritQuote') }}</p>
    </section>
    <OfferingNotices />
  </OfferingPageShell>
</template>
<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingNotices from '@/components/offerings/OfferingNotices.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import cardArt from '@/assets/offerings/lamp-card.webp'
import cardOutline from '@/assets/offerings/lamp-outline.svg'
import portraitBorder from '@/assets/offerings/lamp-border.svg'
import guangming from '@/assets/offerings/lamp-guangming.png'
import taisui from '@/assets/offerings/lamp-taisui.png'
import wenchang from '@/assets/offerings/lamp-wenchang.png'
import caishenArt from '@/assets/offerings/lamp-guangming-second.png'
import wenchangSecond from '@/assets/offerings/lamp-wenchang-second.png'
import stepEmblem from '@/assets/offerings/step-emblem.svg'
import meritBorder from '@/assets/offerings/merit-border.svg'
import wisdom from '@/assets/offerings/merit-wisdom.png'
import longevity from '@/assets/offerings/merit-longevity.png'
import wealth from '@/assets/offerings/merit-wealth.png'
import peace from '@/assets/offerings/merit-peace.png'
const { t, tm } = useI18n()
const router = useRouter()
const meritImages = [wisdom, longevity, wealth, peace]
// 设计稿为五张卡片：光明、太岁、文昌、财神、文昌（第二版图）；财神灯文案已在语言包补齐。
const lamps = computed(() => {
  const types = tm('offerings.lamps')
  return [0, 1, 2, 3, 2].map((type, index) => ({ ...types[type], image: [guangming, taisui, wenchang, caishenArt, wenchangSecond][index] }))
})
</script>
