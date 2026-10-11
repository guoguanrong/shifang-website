<template>
  <section class="principles-section">
    <WellnessSectionHeading
      :eyebrow="t('wellness.principles.eyebrow')"
      :title="t('wellness.principles.title')"
      :subtitle="t('wellness.principles.subtitle')"
    />

    <div class="principles-grid">
      <article v-for="(item, index) in items" :key="item.title">
        <!-- 印章外框与内部朱砂纹理由 Figma 图层叠合。 -->
        <div class="principle-seal">
          <img class="seal-frame" :src="sealFrame" alt="" aria-hidden="true" />
          <img class="seal-fill" :src="sealFills[index]" alt="" aria-hidden="true" />
          <i class="diamond left" /><i class="diamond right" />
          <img v-if="sealGlyphs[item.char]" class="seal-glyph" :src="sealGlyphs[item.char]" :alt="item.char" />
          <span v-else>{{ item.char }}</span>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import sealFrame from '@/assets/wellness/seal-frame.svg'
import sealJing from '@/assets/wellness/seal-jing.png'
import sealQi from '@/assets/wellness/seal-qi.png'
import sealShen from '@/assets/wellness/seal-shen.png'
import glyphJing from '@/assets/wellness/design/glyph-jing.webp'
import glyphQi from '@/assets/wellness/design/glyph-qi.webp'
import glyphShen from '@/assets/wellness/design/glyph-shen.webp'
import WellnessSectionHeading from './WellnessSectionHeading.vue'

const { t, tm } = useI18n()
const items = computed(() => tm('wellness.principles.items'))
const sealFills = [sealJing, sealQi, sealShen]
// 仅使用字形一致的原稿书法切图，繁体“氣”仍按当前语言渲染。
const sealGlyphs = { 精: glyphJing, 气: glyphQi, 神: glyphShen }
</script>

<style scoped>
.principles-section { min-height: 574px; padding: 0 24px 60px; font-family: var(--font-calligraphy); background: linear-gradient(#f5f2ed, #f3f0e9 242px); }
.principles-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 270px)); justify-content: space-between; gap: 40px; width: min(1098px, 100%); margin: 63px auto 0; }
.principles-grid article { min-width: 0; text-align: center; }
.principle-seal { position: relative; width: 154px; height: 154px; margin: 0 auto; }
.seal-frame { position: absolute; inset: 0; width: 100%; height: 100%; }
.seal-fill { position: absolute; top: 8px; left: 8px; width: 138px; height: 138px; }
.seal-glyph { position: absolute; top: 40px; left: 50%; width: auto; height: 65px; transform: translateX(-50%); }
.principle-seal span { position: absolute; z-index: 2; top: 8px; left: 50%; color: #fff; font-family: var(--font-calligraphy); font-size: 80px; line-height: 126px; transform: translateX(-50%); }
.diamond { position: absolute; z-index: 3; top: 73px; width: 6px; height: 6px; background: linear-gradient(#f2d2af, #d7b591); transform: rotate(45deg); }
.diamond.left { left: -3px; }.diamond.right { right: -3px; }
h3 { margin: 26px 0 14px; color: #333; font-family: var(--font-calligraphy); font-size: 32px; font-weight: 400; line-height: 39px; }
article > p { margin: 0; color: #333; font-size: 16px; line-height: 20px; text-align: justify; letter-spacing: 1.6px; }

@media (max-width: 760px) { .principles-section { padding-bottom: 62px; }.principles-grid { grid-template-columns: 1fr; width: min(420px, 100%); margin-top: 45px; gap: 50px; }.principles-grid article { display: grid; grid-template-columns: 100px minmax(0, 1fr); column-gap: 16px; text-align: left; }.principle-seal { grid-row: 1 / 3; width: 100px; height: 100px; }.seal-fill { top: 6px; left: 6px; width: 88px; height: 88px; }.principle-seal span { top: 3px; font-size: 54px; line-height: 89px; }.diamond { top: 47px; }.principles-grid h3 { align-self: end; margin: 0 0 10px; font-size: 27px; }.principles-grid article > p { font-size: 14px; line-height: 22px; letter-spacing: 0; } }

:global(html[data-locale-layout='international'] .principles-section h3) { font-family: Georgia, serif; font-size: 23px; line-height: 28px; }
:global(html[data-locale-layout='international'] .principles-section article > p) { font-family: Georgia, serif; font-size: 14px; line-height: 20px; letter-spacing: 0; text-align: left; }
@media (max-width: 760px) { :global(html[data-locale-layout='international'] .principles-section .principles-grid article) { display: block; text-align: center; }:global(html[data-locale-layout='international'] .principles-section .principle-seal) { margin-bottom: 20px; }:global(html[data-locale-layout='international'] .principles-section h3) { margin-bottom: 10px; }:global(html[data-locale-layout='international'] .principles-section article > p) { text-align: left; } }
@media (max-width: 760px) {
  .seal-glyph { top: 26px; height: 43px; }
  .principles-section :deep(.wellness-heading) { height: auto; display: grid; gap: 8px; }
  .principles-section :deep(.wellness-heading p), .principles-section :deep(.wellness-heading h2) { position: static; width: 100%; transform: none; }
  .principles-section :deep(.wellness-heading h2) { font-size: 28px; line-height: 1.3; }
}
</style>
