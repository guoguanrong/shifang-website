<template>
  <section id="organization" class="organization-section" aria-labelledby="admonitions-title">
    <img class="organization-background" :src="organizationBackground" alt="" aria-hidden="true" />
    <div class="organization-content">
      <header class="admonitions-heading">
        <p>{{ t('admonitions.en') }}</p>
        <h2 id="admonitions-title">{{ t('admonitions.title') }}</h2>
        <span>{{ t('admonitions.subtitle') }}</span>
      </header>

      <div class="admonitions-grid">
        <div class="admonitions-column">
          <article v-for="item in leftItems" :key="item.title">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>

        <img class="yin-yang" :src="yinYang" alt="" aria-hidden="true" />

        <div class="admonitions-column">
          <article v-for="item in rightItems" :key="item.title">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import organizationBackground from '@/assets/home/admonitions/background.webp'
import yinYang from '@/assets/home/admonitions/yin-yang.webp'

const { t, tm } = useI18n()
const admonitions = computed(() => tm('admonitions.items'))
const leftItems = computed(() => admonitions.value.slice(0, 2))
const rightItems = computed(() => admonitions.value.slice(2, 4))
</script>

<style scoped>
.organization-section {
  position: relative;
  z-index: 3;
  height: 1350px;
  overflow: hidden;
  color: #fff;
}

.organization-background {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 1349px;
  max-width: none;
  object-fit: fill;
  pointer-events: none;
  transform: translateX(-50%) rotate(0);
}

.organization-content {
  position: relative;
  z-index: 1;
  width: 1112px;
  max-width: calc(100% - 48px);
  margin: 0 auto;
  padding-top: 336px;
  box-sizing: border-box;
}

.admonitions-heading {
  position: relative;
  height: 111px;
  text-align: center;
}

.admonitions-heading p,
.admonitions-heading h2,
.admonitions-heading span {
  position: absolute;
  left: 50%;
  width: max-content;
  max-width: 100%;
  margin: 0;
  transform: translateX(-50%);
}

.admonitions-heading p {
  top: 0;
  font-size: 24px;
  line-height: 30px;
}

.admonitions-heading h2 {
  top: 38px;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 1.1;
  white-space: nowrap;
}

.admonitions-heading span {
  top: 95px;
  font-size: 16px;
  line-height: 20px;
}

.admonitions-grid {
  display: grid;
  grid-template-columns: 300px 352px 300px;
  align-items: center;
  gap: 80px;
  margin-top: 80px;
}

.admonitions-column {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.admonitions-column article {
  min-width: 0;
}

.admonitions-column h3 {
  margin: 0 0 21px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
}

.admonitions-column p {
  margin: 0;
  color: rgba(255, 255, 255, .8);
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
  text-wrap: pretty;
}

.yin-yang {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  transform: scaleX(-1);
}

html[data-locale-layout='international'] .admonitions-heading h2 {
  font-family: var(--font-serif-cn);
  font-size: 34px;
}

html[data-locale-layout='international'] .admonitions-column h3 {
  font-family: var(--font-serif-cn);
  font-size: 26px;
}

html[data-locale-layout='international'] .admonitions-column p {
  font-family: var(--font-serif-cn);
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0;
}

@media (max-width: 1200px) and (min-width: 761px) {
  .organization-content { width: 100%; max-width: calc(100% - 48px); }
  .admonitions-grid {
    grid-template-columns: minmax(0, 1fr) minmax(220px, 32vw) minmax(0, 1fr);
    gap: clamp(24px, 5.56vw, 80px);
  }
  .admonitions-column h3 { font-size: 28px; }
  .admonitions-column p { font-size: 14px; line-height: 1.6; letter-spacing: 1px; }
}

@media (max-width: 760px) {
  .organization-section {
    height: auto;
    min-height: 0;
    padding: 70px 20px 80px;
  }

  .organization-background {
    top: 50%;
    width: 145%;
    height: 120%;
    transform: translate(-50%, -50%) rotate(-5.82deg);
  }

  .organization-content {
    width: 100%;
    max-width: 100%;
    padding-top: 0;
  }

  .admonitions-heading { height: 105px; }
  .admonitions-heading p { font-size: 18px; }
  .admonitions-heading h2 { top: 34px; font-size: 32px; }
  .admonitions-heading span { top: 81px; width: 100%; font-size: 13px; white-space: normal; }
  html[data-locale-layout='international'] .admonitions-heading h2 { width: 100%; font-size: 24px; white-space: normal; }

  .admonitions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 36px 24px;
    margin-top: 25px;
  }

  .yin-yang {
    grid-column: 1 / -1;
    grid-row: 1;
    width: min(290px, 70vw);
    margin: 0 auto;
  }

  .admonitions-column { gap: 36px; }
  .admonitions-column h3 { margin-bottom: 12px; font-size: 22px; }
  .admonitions-column p { font-size: 13px; line-height: 1.7; letter-spacing: .4px; }
}

@media (max-width: 480px) {
  .admonitions-grid {
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .yin-yang { order: -1; width: min(250px, 68vw); }
  .admonitions-column { width: 100%; gap: 30px; }
  .admonitions-column h3 { font-size: 24px; }
  .admonitions-column p { font-size: 14px; }
}
</style>
