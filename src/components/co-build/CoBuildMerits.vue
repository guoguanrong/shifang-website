<template>
  <!-- 共建功德：四张卡片，每张由印章（汉字 + 罗马音）与说明文案组成。 -->
  <section class="merits-section">
    <!-- 背景太极水印，纯装饰不参与交互。 -->
    <img class="taichi-watermark" :src="taichi" alt="" aria-hidden="true" />
    <CoBuildSectionHeading :title="t('coBuild.merits.title')" :subtitle="t('coBuild.merits.subtitle')" />

    <div class="merits-grid">
      <article v-for="(item, index) in merits" :key="item.title" class="merit-card">
        <div class="merit-seal">
          <img :src="virtueEmblems[index]" alt="" aria-hidden="true" />
          <span>{{ item.char }}</span>
          <small>{{ item.roman }}</small>
        </div>
        <div class="merit-copy">
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
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'
import taichi from '@/assets/culture/taichi.webp'
import virtue1 from '@/assets/co-build/virtue-1.svg'
import virtue2 from '@/assets/co-build/virtue-2.svg'
import virtue3 from '@/assets/co-build/virtue-3.svg'
import virtue4 from '@/assets/co-build/virtue-4.svg'

const { t, tm } = useI18n()
// 功德条目取自语言包，与四枚印章图案按索引一一对应。
const merits = computed(() => tm('coBuild.merits.items'))
const virtueEmblems = [virtue1, virtue2, virtue3, virtue4]
</script>

<style scoped>
.merits-section {
  position: relative;
  overflow: hidden;
  padding: 0 20px 80px;
  background: #f3f0e9;
}

/* 超大太极水印：极低透明度，且不拦截鼠标事件。 */
.taichi-watermark {
  position: absolute;
  top: 18px;
  left: max(-164px, calc(50% - 884px));
  width: 734px;
  height: 734px;
  object-fit: contain;
  opacity: .025;
  pointer-events: none;
}

/* 两列固定 700px 卡片，居中排布。 */
.merits-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 700px);
  gap: 30px 40px;
  justify-content: center;
  width: 1440px;
  margin: 14px auto 0;
}

.merit-card {
  display: grid;
  grid-template-columns: 176px 1fr;
  height: 200px;
  align-items: center;
  padding: 0 26px 0 37px;
  background: #fff;
  border-radius: 20px;
  transition: box-shadow .25s ease, transform .25s ease;
}

.merit-card:hover {
  box-shadow: 0 14px 32px rgba(142, 110, 73, .12);
  transform: translateY(-4px);
}

.merit-seal {
  position: relative;
  width: 138px;
  height: 138px;
}

.merit-seal>img {
  position: absolute;
  inset: 0;
  width: 138px;
  height: 138px;
}

.merit-seal span {
  position: absolute;
  top: 9px;
  left: 29px;
  color: #111;
  font-family: var(--font-calligraphy);
  font-size: 80px;
  line-height: 96px;
}

.merit-seal small {
  position: absolute;
  right: 17px;
  bottom: 14px;
  color: #cc3513;
  font-family: Georgia, serif;
  font-size: 16px;
  line-height: 20px;
  text-transform: uppercase;
}

.merit-copy {
  align-self: stretch;
  padding-top: 31px;
}

.merit-copy h3 {
  margin: 0 0 14px;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  font-weight: 400;
  line-height: 34px;
}

.merit-copy p {
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1.6px;
}

:global(html[data-locale-layout='international'] .merit-card) {
  /* 英文版：字号行高更小，卡片高度改为自适应，避免文字溢出。 */
  min-height: 220px;
  height: auto;
}

:global(html[data-locale-layout='international'] .merit-copy) {
  padding-block: 28px;
}

:global(html[data-locale-layout='international'] .merit-copy h3) {
  font-family: Georgia, serif;
  font-size: 22px;
  line-height: 28px;
}

:global(html[data-locale-layout='international'] .merit-copy p) {
  font-size: 18px;
  line-height: 19px;
  letter-spacing: 0;
}

/* 窄于设计稿宽度时改为单列。 */
@media (max-width: 1439px) {
  .merits-grid {
    grid-template-columns: minmax(0, 860px);
    width: min(100%, 860px);
  }
}

@media (max-width: 700px) {
  .merits-section {
    padding: 0 15px 58px;
  }

  .merits-grid {
    gap: 20px;
  }

  .merit-card {
    grid-template-columns: 118px 1fr;
    min-height: 210px;
    height: auto;
    padding: 18px 18px 18px 16px;
  }

  .merit-seal,
  .merit-seal>img {
    width: 108px;
    height: 108px;
  }

  .merit-seal span {
    top: 9px;
    left: 24px;
    font-size: 60px;
    line-height: 72px;
  }

  .merit-seal small {
    right: 11px;
    bottom: 10px;
    font-size: 12px;
  }

  .merit-copy {
    padding: 0 0 0 10px;
    align-self: center;
  }

  .merit-copy h3 {
    margin-bottom: 9px;
    font-size: 21px;
    line-height: 27px;
  }

  .merit-copy p {
    font-size: 13px;
    line-height: 19px;
    letter-spacing: .3px;
  }
}

@media (max-width: 430px) {
  .merit-card {
    display: block;
    text-align: center;
  }

  .merit-seal {
    margin: 0 auto 8px;
  }

  .merit-copy {
    padding-left: 0;
  }
}
</style>
