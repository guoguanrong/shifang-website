<template>
  <!-- 共建功德：四张卡片，每张由印章（汉字 + 罗马音）与说明文案组成。 -->
  <section class="merits-section">
    <!-- 背景太极水印，纯装饰不参与交互。 -->
    <CoBuildSectionHeading :title="t('coBuild.merits.title')" :subtitle="t('coBuild.merits.subtitle')" />

    <div class="merits-grid">
      <article v-for="(item, index) in merits" :key="item.title" class="merit-card">
        <!-- 印章整体为图片：图内已含梅花底、书法字与拼音角标，按当前语言取图。 -->
        <div class="merit-seal">
          <img class="merit-seal-img" :src="meritSeals[index]" :alt="item.title" />
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
import meritZengZhCN from '@/assets/co-build/merits/merit-zeng-zh-CN.png'
import meritZengZhTW from '@/assets/co-build/merits/merit-zeng-zh-TW.png'
import meritZengEn from '@/assets/co-build/merits/merit-zeng-en.png'
import meritYinZhCN from '@/assets/co-build/merits/merit-yin-zh-CN.png'
import meritYinZhTW from '@/assets/co-build/merits/merit-yin-zh-TW.png'
import meritYinEn from '@/assets/co-build/merits/merit-yin-en.png'
import meritYunZhCN from '@/assets/co-build/merits/merit-yun-zh-CN.png'
import meritYunZhTW from '@/assets/co-build/merits/merit-yun-zh-TW.png'
import meritYunEn from '@/assets/co-build/merits/merit-yun-en.png'
import meritBaoZhCN from '@/assets/co-build/merits/merit-bao-zh-CN.png'
import meritBaoZhTW from '@/assets/co-build/merits/merit-bao-zh-TW.png'
import meritBaoEn from '@/assets/co-build/merits/merit-bao-en.png'

const { t, tm, locale } = useI18n()
// 功德条目取自语言包，与四枚印章图按索引一一对应。
const merits = computed(() => tm('coBuild.merits.items'))

// 印章为整图（图内含梅花底、书法字与拼音角标），按当前语言取图。
const MERIT_SEAL_KEYS = ['zeng', 'yin', 'yun', 'bao']
const MERIT_SEALS = {
  zeng: { 'zh-CN': meritZengZhCN, 'zh-TW': meritZengZhTW, en: meritZengEn },
  yin: { 'zh-CN': meritYinZhCN, 'zh-TW': meritYinZhTW, en: meritYinEn },
  yun: { 'zh-CN': meritYunZhCN, 'zh-TW': meritYunZhTW, en: meritYunEn },
  bao: { 'zh-CN': meritBaoZhCN, 'zh-TW': meritBaoZhTW, en: meritBaoEn },
}
const meritSeals = computed(() => tm('coBuild.merits.items').map((item, index) => {
  const set = MERIT_SEALS[MERIT_SEAL_KEYS[index]] || {}
  return set[locale.value] || set['zh-CN'] || ''
}))
</script>

<style scoped>
.merits-section {
  position: relative;
  overflow: hidden;
  padding: 0 20px 80px;
  background: #f8f5ed;
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

/* 印章为整图（图内含梅花底、书法字与拼音角标）。 */
.merit-seal-img {
  display: block;
  width: 138px;
  height: 138px;
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
  .merit-seal-img {
    width: 108px;
    height: 108px;
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
