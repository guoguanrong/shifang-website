<template>
  <section class="tests">
    <OrnateSectionHeading :title="t('blessings.testsTitle')" />
    <div class="test-grid">
      <article v-for="(item, index) in items" :key="item.title" class="test-card">
        <img :src="icons[index]" alt="" />
        <h3>{{ item.title }}</h3>
        <p><span v-for="line in item.lines" :key="line">{{ line }}</span></p>
        <CeremonialButton :label="item.action" @click="router.push({ name: testRoutes[index] })" />
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
const items = computed(() => tm('blessings.tests'))
</script>
<style scoped>
.tests {
  position: absolute;
  z-index: 2;
  top: 852px;
  left: 50%;
  width: 1238px;
  transform: translateX(-50%);
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(4, 290px);
  gap: 26px;
  margin-top: -16px;
}

.test-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 360px;
  padding: 38px 16px 0;
  text-align: center;
  background: url('@/assets/blessings/test-card.webp') center/290px 360px no-repeat;
  transition: transform .25s ease, filter .25s ease;
}

.test-card img {
  width: auto;
  height: 97px;
  object-fit: contain;
  transition: transform .25s ease;
}

.test-card h3 {
  margin: 22px 0 11px;
  color: #050505;
  font: 28px/1.15 var(--font-calligraphy);
  white-space: nowrap;
}

.test-card p {
  display: flex;
  flex-direction: column;
  min-height: 69px;
  margin: 0;
  color: #333;
  font: 16px/20px var(--font-calligraphy);
  letter-spacing: .5px;
}

.test-card :deep(.ceremonial-button) {
  min-width: 158px;
  margin-top: auto;
  margin-bottom: 37px;
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
  min-height: 40px;
  margin: 14px 0 8px;
  place-items: center;
  font-size: 20px;
  overflow-wrap: break-word;
  white-space: normal;
}

:global(html[data-locale-layout='international'] .test-card p) {
  font-size: 15px;
  line-height: 17px;
}

/* 正文换成英文后会多出一到两行，收紧纵向间距，保证按钮仍落在卡片边框内。 */
:global(html[data-locale-layout='international'] .test-card) {
  padding-top: 24px;
}

:global(html[data-locale-layout='international'] .test-card .ceremonial-button) {
  margin-bottom: 28px;
}

@media (max-width:1100px) {
  .tests {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    padding: 52px 24px 0;
    transform: none;
  }

  .test-grid {
    grid-template-columns: repeat(2, 290px);
    justify-content: center;
  }
}

@media (max-width:650px) {
  .tests {
    padding-inline: 12px;
  }

  .test-grid {
    grid-template-columns: 290px;
  }
}
</style>
