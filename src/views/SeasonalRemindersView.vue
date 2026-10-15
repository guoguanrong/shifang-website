<template>
  <!-- 节气提醒详情页：四季卡片与节气指引均来自语言包。 -->
  <OfferingPageShell class="blessing-detail-page seasonal-reminders-page" :title="t('blessingDetails.seasonal.title')"
    :eyebrow="t('blessingDetails.seasonal.eyebrow')" :subtitle="t('blessingDetails.seasonal.subtitle')"
    :section="t('offerings.section')" section-to="/blessings">
    <section class="seasonal-intro offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessingDetails.seasonal.introTitle')" />
      <p>{{ t('blessingDetails.seasonal.intro') }}</p>
    </section>
    <section class="seasonal-principles">
      <OrnateSectionHeading :art="heading" :title="t('blessingDetails.seasonal.seasonsTitle')" />
      <div class="seasonal-card-grid">
        <!-- 卡片由底图、渐隐层与描边三层叠加出纸质效果。 -->
        <article v-for="(season, index) in tm('blessingDetails.seasonal.seasons')" :key="season.title"
          class="seasonal-card">
          <img class="seasonal-card-image" :src="images[index]" alt="" aria-hidden="true" />
          <img class="seasonal-card-fade" :src="fade" alt="" aria-hidden="true" />
          <img class="seasonal-card-outline" :src="outline" alt="" aria-hidden="true" />
          <div class="seasonal-card-copy" :class="{ 'is-english': locale === 'en' }">
            <h3>{{ season.title }}</h3>
            <p>{{ season.text }}</p>
          </div>
        </article>
      </div>
    </section>
    <OfferingNotices :art="heading" :title="t('blessingDetails.seasonal.guideTitle')"
      :items="tm('blessingDetails.seasonal.guide')" />
    <BlessingServiceAction kind="seasonal" :label="t('blessingDetails.seasonal.action')" />
  </OfferingPageShell>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingNotices from '@/components/offerings/OfferingNotices.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import BlessingServiceAction from '@/components/blessings/BlessingServiceAction.vue'
import heading from '@/assets/blessing-details/heading.svg'
import spring from '@/assets/blessing-details/spring.webp'
import summer from '@/assets/blessing-details/summer.webp'
import autumn from '@/assets/blessing-details/autumn.webp'
import winter from '@/assets/blessing-details/winter.webp'
import fade from '@/assets/blessing-details/season-fade.svg'
import outline from '@/assets/blessing-details/season-outline.svg'
import '@/styles/blessing-details.css'

const { t, tm, locale } = useI18n()
// 四季配图，顺序与语言包 seasons 保持一致。
const images = [spring, summer, autumn, winter]
</script>
