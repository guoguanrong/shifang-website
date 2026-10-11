<template>
  <header class="ritual-heading">
    <!-- 切图内已包含标题、副标题与两侧纹样，直接整图展示，无需再拼装布局。 -->
    <img v-if="headingImage" class="heading-image" :src="headingImage" :alt="`${title} ${subtitle}`" />

    <!-- 未提供切图的语言仍沿用文字排版，避免出现「图是中文、页面是英文」的错位。 -->
    <template v-else>
      <!-- Figma 标题背景由纹理图片经过渐隐遮罩形成。 -->
      <span class="heading-medallion" aria-hidden="true">
        <img :src="headingTexture" alt="" />
      </span>

      <div class="heading-row">
        <img class="heading-line" :src="headingLineLeft" alt="" />
        <h2>{{ title }}</h2>
        <img class="heading-line" :src="headingLineRight" alt="" />
      </div>
      <p>{{ subtitle }}</p>
    </template>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import headingTexture from '@/assets/etiquette/heading-texture.webp'
import headingMask from '@/assets/etiquette/heading-mask.svg'
import headingLineLeft from '@/assets/etiquette/heading-line-left.svg'
import headingLineRight from '@/assets/etiquette/heading-line-right.svg'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  // 图片文字已烧录在切图中，故按语言传入：{ 'zh-CN': 图片 }，繁体与英文待补图。
  images: { type: Object, default: () => ({}) },
})

const { locale } = useI18n()
const headingImage = computed(() => props.images[locale.value] ?? '')
</script>

<style scoped>
.ritual-heading {
  position: relative;
  z-index: 2;
  height: 152px;
  text-align: center;
}

/* 切图原始尺寸 1080×301，按 1× 即 540px 展示，与旧文字排版的整体宽度一致。 */
.heading-image {
  display: block;
  width: min(540px, 100%);
  height: auto;
  margin: 0 auto;
}

.heading-medallion {
  position: absolute;
  top: 0;
  left: 50%;
  width: 204px;
  height: 152px;
  -webkit-mask-image: v-bind(headingMask);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-image: v-bind(headingMask);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  transform: translateX(-50%);
}

.heading-medallion img {
  position: absolute;
  top: 6px;
  left: 33px;
  display: block;
  width: 139px;
  height: 139px;
  object-fit: cover;
}

.heading-row {
  position: absolute;
  top: 59px;
  left: 50%;
  display: grid;
  grid-template-columns: 177px auto 177px;
  align-items: start;
  gap: 8px;
  transform: translateX(-50%);
}

.heading-line {
  display: block;
  width: 177px;
  height: 9.5px;
  margin-top: 16px;
}

h2 {
  min-width: 175px;
  margin: 0;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 28px;
  white-space: nowrap;
  letter-spacing: 2.1px;
}

p {
  position: absolute;
  top: 120px;
  left: 50%;
  width: min(363px, 90vw);
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 1;
  transform: translateX(-50%);
}

@media (max-width: 760px) {
  .ritual-heading { height: 128px; }

  .heading-medallion {
    width: 170px;
    height: 127px;
  }

  .heading-medallion img {
    top: 5px;
    left: 28px;
    width: 116px;
    height: 116px;
  }

  .heading-row {
    top: 47px;
    grid-template-columns: min(22vw, 95px) auto min(22vw, 95px);
    gap: 7px;
  }

  .heading-line {
    width: 100%;
    height: auto;
    margin-top: 12px;
  }

  h2 {
    min-width: auto;
    font-size: 30px;
    line-height: 28px;
    letter-spacing: 1.5px;
  }

  p {
    top: 98px;
    padding-inline: 18px;
    font-size: 13px;
  }
}

:global(html[data-locale-layout='international'] .ritual-heading .heading-row) {
  grid-template-columns: min(13vw, 177px) auto min(13vw, 177px);
}

:global(html[data-locale-layout='international'] .ritual-heading h2) {
  font-family: Georgia, serif;
  font-size: 31px;
  line-height: 30px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .ritual-heading p) { letter-spacing: .3px; }

@media (max-width: 760px) {
  :global(html[data-locale-layout='international'] .ritual-heading .heading-row) {
    grid-template-columns: min(12vw, 75px) minmax(0, auto) min(12vw, 75px);
  }

  :global(html[data-locale-layout='international'] .ritual-heading h2) {
    max-width: 58vw;
    overflow-wrap: anywhere;
    font-size: 24px;
    line-height: 26px;
    white-space: normal;
  }
}
</style>
