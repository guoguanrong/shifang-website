<template>
  <header class="co-build-heading" :class="{ 'has-eyebrow': eyebrow }">
    <!-- 138px 章纹来自 Figma，标题覆盖其中心形成统一章节视觉。 -->
    <img :src="sectionEmblem" alt="" aria-hidden="true" />
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup>
import sectionEmblem from '@/assets/co-build/section-emblem.svg'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
})
</script>

<style scoped>
.co-build-heading {
  position: relative;
  width: min(100%, 760px);
  min-height: 138px;
  margin: 0 auto;
  padding-top: 50px;
  color: #333;
  text-align: center;
}

.co-build-heading > img {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 50%;
  width: 138px;
  height: 138px;
  transform: translateX(-50%);
}

.co-build-heading :is(h2, p) { position: relative; z-index: 1; }
.co-build-heading h2 { margin: 0; font-family: var(--font-calligraphy); font-size: 32px; font-weight: 400; line-height: 38px; }
.co-build-heading .subtitle { margin: 8px 0 0; font-size: 16px; line-height: 20px; letter-spacing: 1.6px; }
.co-build-heading .eyebrow { margin: -34px 0 4px; color: #d0a06d; font-family: var(--font-dyming-a); font-size: 14px; line-height: 18px; }
.co-build-heading.has-eyebrow { padding-top: 50px; }

:global(html[data-locale-layout='international'] .co-build-heading) { width: min(100%, 850px); }
:global(html[data-locale-layout='international'] .co-build-heading h2) { font-family: Georgia, serif; font-size: 29px; line-height: 36px; }
:global(html[data-locale-layout='international'] .co-build-heading .subtitle) { font-size: 14px; line-height: 20px; letter-spacing: 0; }

@media (max-width: 600px) {
  .co-build-heading { min-height: 116px; padding: 42px 12px 0; }
  .co-build-heading > img { width: 116px; height: 116px; }
  .co-build-heading h2 { font-size: 26px; line-height: 32px; }
  .co-build-heading .subtitle { font-size: 14px; letter-spacing: .5px; }
}
</style>
