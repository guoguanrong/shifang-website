<template>
  <!-- 共建理由：三列卡片，序号由索引补零生成。 -->
  <section class="reasons-section">
    <CoBuildSectionHeading :title="t('coBuild.reasons.title')" :subtitle="t('coBuild.reasons.subtitle')" />

    <div class="reasons-grid">
      <article v-for="(item, index) in reasons" :key="item.title">
        <header>
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ item.title }}</h3>
        </header>
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'

const { t, tm } = useI18n()
// 理由条目全部来自语言包。
const reasons = computed(() => tm('coBuild.reasons.items'))
</script>

<style scoped>
.reasons-section {
  padding: 0 20px 40px;
  background: #f3f0e9;
}

/* 三列固定宽度卡片，居中排布。 */
.reasons-grid {
  display: grid;
  grid-template-columns: repeat(3, 466.67px);
  gap: 30px 20px;
  justify-content: center;
  width: 1440px;
  margin: 12px auto 0;
}

.reasons-grid article {
  height: 160px;
  overflow: hidden;
  background: #fff;
  border-radius: 20px;
  transition: box-shadow .25s ease, transform .25s ease;
}

.reasons-grid article:hover {
  box-shadow: 0 12px 28px rgba(142, 110, 73, .1);
  transform: translateY(-4px);
}

.reasons-grid header {
  display: flex;
  height: 70px;
  align-items: center;
  gap: 10px;
  padding: 0 26px;
  background: linear-gradient(0deg, #fff, #ffe9d2);
}

.reasons-grid header span {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 20px;
  line-height: 1;
  background: #caab89;
  border-radius: 50%;
}

.reasons-grid h3 {
  margin: 0;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  font-weight: 400;
  line-height: 30px;
}

.reasons-grid article>p {
  margin: 0;
  padding: 0 26px;
  color: #333;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1.6px;
}

:global(html[data-locale-layout='international'] .reasons-grid article) {
  /* 英文版：调整字号与行高，卡片高度改为自适应。 */
  min-height: 176px;
  height: auto;
}

:global(html[data-locale-layout='international'] .reasons-grid h3) {
  font-family: Georgia, serif;
  font-size: 19px;
  line-height: 24px;
}

:global(html[data-locale-layout='international'] .reasons-grid article > p) {
  padding-bottom: 20px;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0;
}

@media (max-width: 1439px) {
  .reasons-grid {
    grid-template-columns: repeat(2, minmax(0, 400px));
    width: min(100%, 820px);
  }
}

@media (max-width: 700px) {
  .reasons-section {
    padding: 0 15px 34px;
  }

  .reasons-grid {
    grid-template-columns: 1fr;
    width: min(100%, 440px);
    gap: 18px;
  }

  .reasons-grid article {
    min-height: 160px;
    height: auto;
  }

  .reasons-grid header {
    padding-inline: 20px;
  }

  .reasons-grid h3 {
    font-size: 21px;
  }

  .reasons-grid article>p {
    padding: 0 20px 20px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: .4px;
  }
}
</style>
