<template>
  <!-- 祈福测算页通用布局：标题取自 blessings.details.<kind>，具体答题区由插槽提供。 -->
  <OfferingPageShell class="blessing-test-page" :class="`${kind}-test-page`" :title="t(`${prefix}.title`)"
    :eyebrow="t(`${prefix}.eyebrow`)" :subtitle="t(`${prefix}.subtitle`)"
    :section="t('blessings.hero.title')" section-to="/blessings">
    <section class="test-intro offering-paper">
      <OrnateSectionHeading :art="heading" :title="t(`${prefix}.introTitle`)" />
      <div class="test-intro-copy"><p v-for="paragraph in tm(`${prefix}.intro`)" :key="paragraph">{{ paragraph }}</p></div>
    </section>
    <slot />
  </OfferingPageShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import heading from '@/assets/blessing-tests/heading.svg'
import '@/styles/blessing-tests.css'

// kind 决定读取哪一组文案（如 lots / zodiac / five / fortune）。
const props = defineProps({ kind: { type: String, required: true } })
// 所有标题、引导语都按这个前缀从语言包中取。
const prefix = computed(() => `blessings.details.${props.kind}`)
const { t, tm } = useI18n()
</script>
