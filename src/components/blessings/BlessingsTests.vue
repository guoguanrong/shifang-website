<template>
  <section class="tests">
    <OrnateSectionHeading :title="t('blessings.testsTitle')" />
    <div class="test-grid">
      <article v-for="card in cards" :key="card.title" class="test-card">
        <img :src="card.icon" alt="" />
        <h3>{{ card.title }}</h3>
        <p><span v-for="line in card.lines" :key="line">{{ line }}</span></p>
        <CeremonialButton :label="card.action" @click="router.push({ name: card.route })" />
      </article>
    </div>
  </section>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import five from '@/assets/blessings/test-five-elements.png'
import lots from '@/assets/blessings/test-lots.png'
import fortune from '@/assets/blessings/test-fortune.png'
import zodiac from '@/assets/blessings/test-zodiac.png'
const icons = [lots, five, fortune, zodiac]
const testRoutes = ['five-elements-test', 'taoist-lots', 'fortune-review', 'taoist-zodiac']
const router = useRouter()
const { t, tm } = useI18n()
// 本期暂不开放的测试：下期上线时从名单移除即可恢复（语言包文案与路由配置均保留，未删除）。
const HIDDEN_TESTS = ['five-elements-test']
// 图标/路由与语言包 tests 数组按下标一一对应，组合后再按隐藏名单过滤，避免过滤后下标错位。
const cards = computed(() => tm('blessings.tests')
  .map((item, index) => ({ ...item, icon: icons[index], route: testRoutes[index] }))
  .filter((card) => !HIDDEN_TESTS.includes(card.route)))
</script>
<style scoped>
.tests {
  position: absolute;
  z-index: 2;
  top: 852px;
  left: 50%;
  width: 1240px;
  transform: translateX(-50%);
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(3, 400px);
  justify-content: center;
  gap: 20px;
  margin-top: -16px;
}

.test-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 518px;
  padding: 50px 24px 0;
  text-align: center;
  background: url('@/assets/blessings/test-card-v2.webp') center/400px 518px no-repeat;
  transition: transform .25s ease, filter .25s ease;
}

.test-card img {
  width: auto;
  height: 132px;
  object-fit: contain;
  transition: transform .25s ease;
}

.test-card h3 {
  margin: 28px 0 14px;
  color: #050505;
  font: 32px/1.15 var(--font-calligraphy);
  white-space: nowrap;
}

.test-card p {
  display: flex;
  flex-direction: column;
  min-height: 88px;
  margin: 0;
  color: #333;
  font: 16px/22px var(--font-calligraphy);
  letter-spacing: .5px;
}

.test-card :deep(.ceremonial-button) {
  min-width: 158px;
  margin-top: auto;
  margin-bottom: 52px;
}

/* 悬停整卡上浮并投影、图标轻抬放大，与 BlessingsServices 卡片保持同一套手感。 */
@media (hover: hover) and (pointer: fine) {
  .test-card:hover {
    filter: drop-shadow(0 16px 18px rgba(90, 58, 30, .18));
    transform: translateY(-6px);
  }

  .test-card:hover img {
    transform: translateY(-4px) scale(1.05);
  }
}

/* 键盘 Tab 到卡片内按钮时保持同样的抬升，避免只有鼠标用户看得到反馈。 */
.test-card:focus-within {
  filter: drop-shadow(0 16px 18px rgba(90, 58, 30, .18));
  transform: translateY(-6px);
}

.test-card:focus-within img {
  transform: translateY(-4px) scale(1.05);
}

/* 英文标题更长：用 grid 承载文字，超宽时按空格换行，而不是顶出卡片边框。
   原先的 display: flex 会让文字变成不可换行的匿名 flex 项，长标题必然溢出。
   注意 :global() 必须把整条选择器包进去：写成 :global(前缀) 后代 时，Vite 会把后代部分丢掉。 */
:global(html[data-locale-layout='international'] .test-card h3) {
  display: grid;
  min-height: 48px;
  margin: 22px 0 12px;
  place-items: center;
  font-size: 22px;
  overflow-wrap: break-word;
  white-space: normal;
}

:global(html[data-locale-layout='international'] .test-card p) {
  font-size: 15px;
  line-height: 19px;
}

/* 正文换成英文后会多出一到两行，收紧纵向间距，保证按钮仍落在卡片边框内。 */
:global(html[data-locale-layout='international'] .test-card) {
  padding-top: 40px;
}

:global(html[data-locale-layout='international'] .test-card .ceremonial-button) {
  margin-bottom: 44px;
}

@media (max-width:1239px) {
  .tests {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    padding: 52px 24px 0;
    transform: none;
  }

  .test-grid {
    grid-template-columns: repeat(2, 400px);
    justify-content: center;
  }
}

@media (max-width:880px) {
  .test-grid {
    grid-template-columns: 400px;
  }
}

@media (max-width:650px) {
  .tests {
    padding-inline: 12px;
  }

  .test-grid {
    grid-template-columns: 400px;
    justify-content: center;
  }
}

/* 小屏等比缩小整张卡片，避免 400px 固定宽度在手机上横向溢出。 */
@media (max-width:460px) {
  .test-grid {
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }

  .test-card {
    width: 100%;
    height: auto;
    aspect-ratio: 400 / 518;
    padding: 34px 16px 0;
    background-size: 100% 100%;
  }

  .test-card img {
    height: 104px;
  }

  .test-card h3 {
    margin: 18px 0 10px;
    font-size: 24px;
  }

  .test-card p {
    min-height: 60px;
    font-size: 14px;
    line-height: 20px;
  }

  .test-card :deep(.ceremonial-button) {
    margin-bottom: 28px;
  }
}
</style>
