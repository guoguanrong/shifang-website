<template>
  <div class="blessings-page">
    <HomeHeader @select-locale="setLocale" />
    <main class="blessings-stage">
      <BlessingsHero />
      <BlessingsServices />
      <BlessingsTests />
      <div class="blessing-quote">
        <p>{{ t('blessings.quote') }}</p><small>{{ t('blessings.quoteSource') }}</small>
      </div>
    </main>
    <HomeFooter />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import BlessingsHero from '@/components/blessings/BlessingsHero.vue'
import BlessingsServices from '@/components/blessings/BlessingsServices.vue'
import BlessingsTests from '@/components/blessings/BlessingsTests.vue'
const { t } = useI18n()
const setLocale = (locale) => setAppLocale(locale)
</script>
<style scoped>
.blessings-page {
  min-width: 320px;
  overflow-x: clip;
  color: #333;
  background: #f3f0e9;
}

.blessings-stage {
  position: relative;
  width: 100%;
  max-width: 1440px;
  height: 1585px;
  margin-inline: auto;
  background: #f3f0e9;
}

.blessing-quote {
  position: absolute;
  z-index: 2;
  top: 1394px;
  left: 50%;
  width: 663px;
  height: 140px;
  padding: 34px 90px 20px;
  font-family: var(--font-calligraphy);
  background: url('@/assets/blessings/quote-scroll.png') center/100% 100% no-repeat;
  transform: translateX(-50%);
}

.blessing-quote p {
  margin: 0;
  color: #9c764d;
  font-size: 32px;
  line-height: 42px;
  text-align: center;
  white-space: nowrap;
}

.blessing-quote small {
  display: block;
  margin-top: 14px;
  color: #9c764d;
  font-size: 16px;
  text-align: right;
}

/* 英文引文更长：缩小字号并允许换行，同时用 grid 让文字在卷轴内垂直居中，
   避免中文版那套 nowrap + 固定 padding 把长句顶出卷轴边框。 */
:global(html[data-locale-layout='international'] .blessing-quote) {
  display: grid;
  align-content: center;
  padding: 30px 80px 18px;
}

:global(html[data-locale-layout='international'] .blessing-quote p) {
  font-family: Georgia, serif;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: 0;
  white-space: normal;
}

:global(html[data-locale-layout='international'] .blessing-quote small) {
  margin-top: 8px;
  font-family: Georgia, serif;
  font-size: 12px;
  letter-spacing: 0;
}

.blessings-page :deep(.site-header) {
  background-image: linear-gradient(rgba(29, 78, 110, .9), rgba(29, 78, 110, .9)), url('@/assets/blessings/header-texture.webp');
  background-position: center;
  background-size: cover;
}

@media (min-width:1281px) {

  .blessings-page :deep(.site-header),
  .blessings-page :deep(.site-footer) {
    /* padding-inline: max(100px, calc((100vw - 1440px)/2)); */
  }


}

@media (max-width:1100px) {
  .blessings-stage {
    height: auto;
    padding-bottom: 70px;
    background-size: auto 1120px;
  }

  .blessing-quote {
    position: relative;
    top: auto;
    left: auto;
    max-width: calc(100% - 32px);
    margin: 58px auto 0;
    transform: none;
  }
}

@media (max-width:700px) {
  .blessing-quote {
    height: auto;
    min-height: 106px;
    padding: 28px 42px 18px;
  }

  .blessing-quote p {
    font-size: 20px;
    line-height: 28px;
    white-space: normal;
  }

  .blessing-quote small {
    margin-top: 8px;
    font-size: 13px;
  }
}
</style>
