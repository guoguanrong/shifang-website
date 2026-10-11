<template>
  <OfferingPageShell class="lamp-detail-page" :title="lamp.title" :eyebrow="lamp.eyebrow" :subtitle="lamp.description" :section="t('lampDetail.section')" section-to="/blessings/lamps">
    <section class="lamp-detail-profile offering-paper">
      <div class="lamp-portrait"><img class="lamp-portrait-border" :src="portraitBorder" alt="" /><img :src="portrait" :alt="lamp.title" width="230" height="230" /></div>
      <div class="lamp-detail-copy">
        <h2>{{ t('offerings.lampMeaning') }} · {{ lamp.title }}</h2>
        <p v-for="paragraph in description" :key="paragraph">{{ paragraph }}</p>
        <div class="lamp-detail-quote"><span class="offering-notice-icon" aria-hidden="true"><img :src="noticeIcon" alt="" /></span><p>{{ t('offerings.lampMeaningText') }}</p></div>
      </div>
    </section>
    <section class="lamp-detail-merits">
      <OrnateSectionHeading :title="t('offerings.detailMeritsTitle')" />
      <ul><li v-for="(merit, index) in tm('lampDetail.merits')" :key="merit.title">
        <div class="merit-symbol"><img class="merit-border" :src="meritBorder" alt="" /><img class="merit-leaf" :src="meritImages[index]" alt="" /><span>{{ merit.symbol }}</span></div>
        <h3>{{ merit.title }}</h3><p>{{ merit.text }}</p>
      </li></ul>
    </section>
    <section class="lamp-detail-order offering-paper">
      <OrnateSectionHeading :title="t('offerings.orderTitle')" />
      <div class="lamp-material-package">
        <dl><div><dt>{{ t('offerings.lampType') }}</dt><dd>{{ lamp.title }}</dd></div><div><dt>{{ t('offerings.lighting') }}</dt><dd class="lamp-free">{{ t('offerings.free') }}</dd></div><div><dt>{{ t('offerings.materials') }}</dt><dd>{{ t('offerings.materialPackage') }}</dd></div></dl>
        <div class="lamp-materials"><article v-for="(material, index) in tm('lampDetail.materials')" :key="material.title" class="lamp-material" :class="{ 'is-incense': index === 1 }">
          <img :src="materialImages[index]" alt="" /><div class="lamp-material-caption"><h3>{{ material.title }}</h3><p>{{ material.text }}</p></div>
        </article></div>
        <div class="lamp-package-total"><span>{{ t('lampDetail.total') }}</span><strong>$88</strong></div>
      </div>
      <OfferingOrderForm :key="lampId" class="lamp-detail-form" :amount="88" hide-total :submit-label="`${t('offerings.pay')}  $88`" @submit="details = $event" />
    </section>
    <OfferingNotices :title="t('lampDetail.noticesTitle')" />
    <OfferingDialog v-if="details" :title="lamp.title" :amount="88" :details="details" @close="details = null" />
  </OfferingPageShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingOrderForm from '@/components/offerings/OfferingOrderForm.vue'
import OfferingDialog from '@/components/offerings/OfferingDialog.vue'
import OfferingNotices from '@/components/offerings/OfferingNotices.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import portraitBorder from '@/assets/offerings/lamp-border.svg'
import guangming from '@/assets/offerings/lamp-detail.png'
import taisui from '@/assets/offerings/lamp-taisui.png'
import wenchang from '@/assets/offerings/lamp-wenchang.png'
import noticeIcon from '@/assets/offerings/notice-icon.svg'
import meritBorder from '@/assets/offerings/merit-border.svg'
import wisdom from '@/assets/offerings/merit-wisdom.png'
import peace from '@/assets/offerings/merit-longevity.png'
import fortune from '@/assets/offerings/merit-fortune.png'
import oil from '@/assets/offerings/oil.webp'
import incense from '@/assets/offerings/incense.webp'
import prayer from '@/assets/offerings/prayer.webp'
import '@/styles/lamp-detail.css'

const props = defineProps({ lampId: { type: String, required: true } })
const { t, tm } = useI18n()
const lamp = computed(() => tm('offerings.lamps').find(item => item.id === props.lampId))
const portrait = computed(() => ({ guangming, taisui, wenchang })[props.lampId])
// 独立长文仅提供光明灯；其他灯种沿用自身介绍，不套用光明灯的道场资料。
const description = computed(() => props.lampId === 'guangming' ? tm('lampDetail.guangmingDescription') : [lamp.value.description, lamp.value.audience])
const meritImages = [wisdom, peace, fortune]
const materialImages = [oil, incense, prayer]
const details = ref(null)
watch(() => props.lampId, () => { details.value = null })
</script>
