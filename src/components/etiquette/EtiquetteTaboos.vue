<template>
  <!-- 参访禁忌：六条卡片，图标与文案按索引一一对应。 -->
  <section class="taboos-section">
    <h2>{{ t('etiquette.taboos.title') }}</h2>
    <div class="taboo-grid">
      <article v-for="(item, index) in items" :key="item.title">
        <img :src="images[index]" alt="" />
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import tabooPoint from '@/assets/etiquette/taboo-point.webp'
import tabooMiddleGate from '@/assets/etiquette/taboo-middle-gate.webp'
import tabooThreshold from '@/assets/etiquette/taboo-threshold.webp'
import tabooPhoto from '@/assets/etiquette/taboo-photo.webp'
import tabooBlow from '@/assets/etiquette/taboo-blow.webp'
import tabooBack from '@/assets/etiquette/taboo-back.webp'

const { t, tm } = useI18n()
// 禁忌条目取自语言包，与本地六张配图按顺序对应。
const items = computed(() => tm('etiquette.taboos.items'))
const images = [tabooPoint, tabooMiddleGate, tabooThreshold, tabooPhoto, tabooBlow, tabooBack]
</script>

<style scoped>
.taboos-section {
  padding: 44px 24px 80px;
  background: #f8f5ed;
}

h2 {
  position: relative;
  width: fit-content;
  margin: 0 auto 32px;
  color: #555;
  font-family: var(--font-calligraphy);
  font-size: 31px;
  font-weight: 400;
  letter-spacing: 2px;
}

h2::before {
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  width: 138px;
  height: 138px;
  content: '';
  background: radial-gradient(circle, rgba(242, 210, 175, .52), transparent 65%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* 三列卡片，窄屏依次降为两列、一列。 */
.taboo-grid {
  display: grid;
  grid-template-columns: repeat(3, 456.67px);
  gap: 24px 35px;
  justify-content: center;
  width: min(1440px, 100%);
  margin: auto;
}
.taboo-grid p {
    font-family: var(--font-calligraphy);
}
.taboo-grid h3 {
    font-family: var(--font-calligraphy);
}
/* 单条禁忌：左侧图标、右侧说明。 */
article {
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: center;
  min-height: 120px;
  padding: 12px 16px 12px 10px;
  background: rgba(255, 255, 255, .92);
  border: 1px solid rgba(232, 214, 193, .55);
  border-radius: 10px;
  box-shadow: 0 8px 22px rgba(92, 68, 43, .05);
  transition: transform .22s ease, box-shadow .22s ease;
}

article:hover {
  box-shadow: 0 12px 28px rgba(92, 68, 43, .11);
  transform: translateY(-4px);
}

img {
  width: 78px;
  height: 78px;
  object-fit: contain;
}

/* 第六张图标（背对神像）原图主体偏小，单独放大一档；同步放大图标列避免挤压文字。 */
article:nth-child(6) {
  grid-template-columns: 110px 1fr;
}

article:nth-child(6) img {
  width: 98px;
  height: 98px;
}

h3 {
  margin: 0 0 7px;
  color: #d33a1c;
  font-size: 17px;
  font-weight: 600;
}

p {
  margin: 0;
  color: #333;
  font-size: 13px;
  line-height: 1.55;
}

/* 窄于设计稿宽度时改为两列。 */
@media (max-width: 1439px) {
  .taboo-grid {
    grid-template-columns: repeat(2, minmax(300px, 390px));
  }
}

@media (max-width: 700px) {
  .taboos-section {
    padding-inline: 14px;
  }

  h2 {
    margin-bottom: 40px;
    font-size: 24px;
    text-align: center;
  }

  .taboo-grid {
    grid-template-columns: minmax(0, 430px);
    gap: 14px;
  }

  article {
    grid-template-columns: 76px 1fr;
  }

  img {
    width: 66px;
    height: 66px;
  }

  article:nth-child(6) {
    grid-template-columns: 92px 1fr;
  }

  article:nth-child(6) img {
    width: 78px;
    height: 78px;
  }
}

:global(html[data-locale-layout='international'] .taboos-section h2) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .taboos-section article) {
  min-height: 138px;
}

:global(html[data-locale-layout='international'] .taboos-section h3),
:global(html[data-locale-layout='international'] .taboos-section p) {
  font-family: Georgia, serif;
}
</style>
