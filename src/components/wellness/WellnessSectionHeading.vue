<template>
  <header class="wellness-heading">
    <!-- 三行标题严格对应设计稿中的英文引题、中文主标题和说明文字。 -->
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p class="subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup>
// 全页四个主章节共用相同标题比例，避免视觉规格在组件间漂移。
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
})
</script>

<style scoped>
.wellness-heading { position: relative; height: 102px; text-align: center; }
.wellness-heading p, .wellness-heading h2 { position: absolute; left: 50%; width: min(512px, calc(100vw - 32px)); margin: 0; transform: translateX(-50%); }
.eyebrow { top: 0; color: #d0a06d; font-size: 24px; line-height: 22px; }
h2 { top: 34px; color: #1d4e6e; font-family: var(--font-calligraphy); font-size: 42px; font-weight: 400; line-height: 44px; letter-spacing: 2px; }
.subtitle { top: 87px; color: #333; font-size: 16px; line-height: 15px; letter-spacing: .6px; }

@media (max-width: 760px) {
  .wellness-heading { height: 91px; }
  .eyebrow { font-size: 18px; line-height: 20px; }
  h2 { top: 27px; font-size: 30px; line-height: 36px; letter-spacing: 1px; }
  .subtitle { top: 70px; font-size: 13px; line-height: 18px; }
}

:global(html[data-locale-layout='international'] .wellness-heading h2) { width: min(780px, calc(100vw - 40px)); font-family: Georgia, serif; font-size: 34px; line-height: 39px; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .wellness-heading .subtitle) { width: min(650px, calc(100vw - 32px)); letter-spacing: 0; }

@media (max-width: 760px) {
  :global(html[data-locale-layout='international'] .wellness-heading) { height: 136px; }
  :global(html[data-locale-layout='international'] .wellness-heading h2) { top: 27px; font-size: 25px; line-height: 30px; }
  :global(html[data-locale-layout='international'] .wellness-heading .subtitle) { top: 96px; line-height: 20px; }
}
</style>
