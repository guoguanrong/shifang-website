<template>
  <OfferingPageShell :title="t('offerings.lampTitle')" :eyebrow="t('offerings.lampEyebrow')" :subtitle="t('offerings.lampSubtitle')" :section="t('offerings.section')" section-to="/blessings">
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
          <div class="lamp-portrait"><img class="lamp-portrait-border" :src="portraitBorder" alt="" /><img :src="lamp.picture || fallbackImage" :alt="lamp.name" width="230" height="230" /></div>
          <h2>{{ lamp.name }}</h2>
          <p v-if="lamp.matchGod">{{ lamp.matchGod }}</p>
          <p class="lamp-period">{{ t('offerings.yearOffering') }}</p>
          <CeremonialButton :label="t('offerings.offerLamp')" @click="router.push(lampTo(lamp))" />
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
import { onMounted, ref } from 'vue'
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
import meritBorder from '@/assets/offerings/merit-border.svg'
import wisdom from '@/assets/offerings/merit-wisdom.png'
import longevity from '@/assets/offerings/merit-longevity.png'
import wealth from '@/assets/offerings/merit-wealth.png'
import peace from '@/assets/offerings/merit-peace.png'
const { t, tm } = useI18n()
const router = useRouter()
const meritImages = [wisdom, longevity, wealth, peace]
const lamps = ref([])
const loading = ref(true)
const emptyLabel = ref('')

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
  to { transform: rotate(360deg); }
}
</style>
