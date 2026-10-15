<template>
  <!-- 电子护身符详情页：介绍、功效、佩戴步骤与注意事项全部由语言包驱动。 -->
  <OfferingPageShell class="blessing-detail-page talisman-page" :title="t('blessingDetails.talisman.title')"
    :eyebrow="t('blessingDetails.talisman.eyebrow')" :subtitle="t('blessingDetails.talisman.subtitle')"
    :section="t('offerings.section')" section-to="/blessings">
    <!-- 顶部介绍：左侧文案、右侧符图。 -->
    <section class="talisman-intro" aria-labelledby="talisman-intro-title">
      <div class="talisman-intro-copy">
        <h2 id="talisman-intro-title">{{ t('blessingDetails.talisman.introTitle') }}</h2>
        <p v-for="paragraph in tm('blessingDetails.talisman.intro')" :key="paragraph">{{ paragraph }}</p>
      </div>
      <figure class="talisman-portrait"><img :src="talisman" :alt="t('blessingDetails.talisman.title')" /></figure>
    </section>
    <!-- 三大功效卡片，图标按索引与语言包条目一一对应。 -->
    <section class="talisman-benefits offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessingDetails.talisman.benefitsTitle')" />
      <div class="talisman-benefit-grid">
        <article v-for="(benefit, index) in tm('blessingDetails.talisman.benefits')" :key="benefit.title"
          class="talisman-benefit offering-paper">
          <div class="talisman-benefit-icon"><img :class="`benefit-icon-${index}`" :src="icons[index]" alt=""
              aria-hidden="true" /></div>
          <h3>{{ benefit.title }}</h3>
          <p>{{ benefit.text }}</p>
        </article>
      </div>
    </section>
    <!-- 佩戴/启用步骤，序号为装饰性文字（对读屏隐藏）。 -->
    <section class="talisman-steps">
      <OrnateSectionHeading :art="heading" :title="t('blessingDetails.talisman.stepsTitle')" />
      <ol>
        <li v-for="(step, index) in tm('blessingDetails.talisman.steps')" :key="step.title">
          <div class="talisman-step-symbol"><img :src="stepArt" alt="" aria-hidden="true" /><span aria-hidden="true">{{
            stepSymbols[index] }}</span><small aria-hidden="true">{{ stepRomans[index] }}</small></div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>
    <OfferingNotices :art="heading" :title="t('blessingDetails.talisman.noticesTitle')"
      :items="tm('blessingDetails.talisman.notices')" />
    <BlessingServiceAction kind="talisman" :label="t('blessingDetails.talisman.action')" />
  </OfferingPageShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingNotices from '@/components/offerings/OfferingNotices.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import BlessingServiceAction from '@/components/blessings/BlessingServiceAction.vue'
import talisman from '@/assets/blessing-details/talisman.webp'
import heading from '@/assets/blessing-details/heading.svg'
import stepArt from '@/assets/blessing-details/step.svg'
import scriptIcon from '@/assets/blessing-details/script.png'
import protection from '@/assets/blessing-details/protection.png'
import consecration from '@/assets/blessing-details/consecration.png'
import '@/styles/blessing-details.css'

const { t, tm, locale } = useI18n()
// 功效图标，顺序与语言包 benefits 一致。
const icons = [scriptIcon, protection, consecration]
// 步骤序号随语言切换：中文用「壹贰叁 + 罗马音」，其他语言用阿拉伯数字 + 英文序数词，仅作装饰。
const isInternational = computed(() => !locale.value.toLowerCase().startsWith('zh'))
const stepSymbols = computed(() => (isInternational.value ? ['1', '2', '3'] : ['壹', '贰', '叁']))
const stepRomans = computed(() => (isInternational.value ? ['ONE', 'TWO', 'THREE'] : ['YI', 'ER', 'SAN']))
</script>
