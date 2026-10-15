<template>
  <!-- 祈福页顶部横幅：背景由公共组件绘制，文案绝对居中。 -->
  <section class="blessings-hero">
    <PageHeroBackground />
    <div class="hero-copy">
      <p>{{ t('blessings.hero.eyebrow') }}</p>
      <h1>{{ t('blessings.hero.title') }}</h1>
      <small>{{ t('blessings.hero.subtitle') }}</small>
    </div>
  </section>
</template>
<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<style scoped>
/* 横幅绝对定位在页面顶部，与下方内容重叠；窄屏改为相对定位并降低高度。 */
.blessings-hero {
  isolation: isolate;
  position: absolute;
  inset: 0 0 auto;
  height: 567px;
  background: #f8f5ed;
}

.hero-copy {
  position: absolute;
  top: 114px;
  left: 50%;
  width: min(92%, 520px);
  text-align: center;
  transform: translateX(-50%);
  font-family: var(--font-calligraphy);
}

.hero-copy p {
  margin: 0 0 3px;
  color: #d0a06d;
  font-size: 24px;
  line-height: 30px;
}

.hero-copy h1 {
  margin: 0;
  color: #1d4e6e;
  font-size: 42px;
  font-weight: 400;
  line-height: 52px;
  letter-spacing: 2px;
}

.hero-copy small {
  display: block;
  color: #333;
  font-size: 16px;
  line-height: 20px;
}

@media (max-width:900px) {
  .blessings-hero {
    position: relative;
    height: 300px;
    background-position: center top;
  }

  .hero-copy {
    top: 82px;
  }

  .hero-copy p {
    font-size: 18px;
  }

  .hero-copy h1 {
    font-size: 34px;
  }

  .hero-copy small {
    font-size: 14px;
  }
}
</style>
