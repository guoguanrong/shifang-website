<template>
  <blockquote class="wellness-quote" :class="{ 'is-closing': closing }">
    <!-- 卷轴为 Figma 原始切图；文本保持可翻译、可被搜索引擎读取。 -->
    <img :src="closing ? quoteBottom : quoteTop" alt="" />
    <p>{{ quote }}</p>
    <cite>{{ source }}</cite>
  </blockquote>
</template>

<script setup>
import quoteBottom from '@/assets/wellness/quote-bottom.webp'
import quoteTop from '@/assets/wellness/quote-top.webp'

defineProps({
  quote: { type: String, required: true },
  source: { type: String, required: true },
  closing: { type: Boolean, default: false },
})
</script>

<style scoped>
.wellness-quote { position: relative; display: grid; align-content: center; width: 707px; height: 162px; padding: 28px 58px 18px; margin: 0; color: #8e6e49; text-align: center; }
.wellness-quote img { position: absolute; z-index: 0; inset: 0; width: 100%; height: 100%; object-fit: fill; }
.wellness-quote p, .wellness-quote cite { position: relative; z-index: 1; }
.wellness-quote p { margin: 0; font-family: var(--font-calligraphy); font-size: 32px; line-height: 36px; white-space: pre-line; }
.wellness-quote cite { margin-top: 13px; padding-right: 8px; font-family: var(--font-dyming-a); font-size: 16px; font-style: normal; line-height: 20px; text-align: right; }
.wellness-quote.is-closing { padding-top: 21px; }

@media (max-width: 760px) {
  .wellness-quote { width: min(100%, 620px); height: 138px; padding: 23px 8vw 13px; }
  .wellness-quote p { font-size: 19px; line-height: 27px; }
  .wellness-quote cite { margin-top: 8px; padding: 0; font-size: 11px; line-height: 15px; text-align: center; }
}

:global(html[data-locale-layout='international'] .wellness-quote) { padding-inline: 70px; }
:global(html[data-locale-layout='international'] .wellness-quote p) { font-family: Georgia, serif; font-size: 21px; line-height: 27px; }
:global(html[data-locale-layout='international'] .wellness-quote cite) { font-family: Georgia, serif; font-size: 12px; }

@media (max-width: 760px) {
  :global(html[data-locale-layout='international'] .wellness-quote) { height: 158px; padding-inline: 11vw; }
  :global(html[data-locale-layout='international'] .wellness-quote p) { font-size: 15px; line-height: 20px; }
  :global(html[data-locale-layout='international'] .wellness-quote cite) { font-size: 10px; line-height: 13px; }
}
</style>
