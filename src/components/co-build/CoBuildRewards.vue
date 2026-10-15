<template>
  <section class="rewards-section">
    <CoBuildSectionHeading :title="t('coBuild.rewards.title')" />

    <div class="rewards-grid">
      <article v-for="(item, index) in rewards" :key="item.title" class="reward-card">
        <img class="reward-frame reward-frame-outer" :src="rewardFrameOuter" alt="" aria-hidden="true" />
        <img class="reward-frame reward-frame-inner" :src="rewardFrameInner" alt="" aria-hidden="true" />
        <div class="reward-icon-box">
          <img :class="`reward-icon reward-icon-${index + 1}`" :src="rewardIcons[index]" alt="" aria-hidden="true" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'
import rewardFrameOuter from '@/assets/co-build/reward-frame-outer.svg'
import rewardFrameInner from '@/assets/co-build/reward-frame-inner.svg'
import reward1 from '@/assets/co-build/reward-1.png'
import reward2 from '@/assets/co-build/reward-2.png'
import reward3 from '@/assets/co-build/reward-3.png'
import reward4 from '@/assets/co-build/reward-4.png'
import reward5 from '@/assets/co-build/reward-5.png'
import reward6 from '@/assets/co-build/reward-6.png'
import reward7 from '@/assets/co-build/reward-7.png'
import reward8 from '@/assets/co-build/reward-8.png'
import reward9 from '@/assets/co-build/reward-9.png'

const { t, tm } = useI18n()
const rewards = computed(() => tm('coBuild.rewards.items'))
const rewardIcons = [reward1, reward2, reward3, reward4, reward5, reward6, reward7, reward8, reward9]
</script>

<style scoped>
.rewards-section {
  padding: 80px 20px;
  background: #f8f5ed;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(3, 466.67px);
  gap: 53px 20px;
  justify-content: center;
  width: 1440px;
  margin: 16px auto 0;
}

.reward-card {
  position: relative;
  height: 300px;
  padding: 0 20px;
  color: #333;
  text-align: center;
  transition: transform .25s ease, filter .25s ease;
}

.reward-card:hover {
  filter: brightness(1.02);
  transform: translateY(-5px);
}

/* 两层装饰框尺寸一致并完全重叠（inner 在后自然叠在 outer 之上），随卡片宽度自适应。 */
.reward-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.reward-icon-box {
  position: relative;
  display: flex;
  height: 151px;
  align-items: flex-end;
  justify-content: center;
}

.reward-icon {
  object-fit: contain;
}

.reward-icon-1 {
  width: 110px;
  height: 78px;
}

.reward-icon-2 {
  width: 109px;
  height: 88px;
}

.reward-icon-3 {
  width: 138px;
  height: 97px;
}

.reward-icon-4 {
  width: 127px;
  height: 72px;
}

.reward-icon-5 {
  width: 75px;
  height: 80px;
}

.reward-icon-6 {
  width: 90px;
  height: 73px;
}

.reward-icon-7 {
  width: 99px;
  height: 78px;
}

.reward-icon-8 {
  width: 106px;
  height: 77px;
}

.reward-icon-9 {
  width: 124px;
  height: 73px;
}

.reward-card h3 {
  position: relative;
  margin: 25px 0 0;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  font-weight: 400;
  line-height: 34px;
}

/* 正文按设计宽度 361px 上限、配合 auto 外边距始终居中。 */
.reward-card p {
  position: relative;
  width: min(100%, 361px);
  min-height: 80px;
  margin: 14px auto 0;
  overflow: hidden;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

:global(html[data-locale-layout='international'] .reward-card) {
  height: 330px;
}

:global(html[data-locale-layout='international'] .reward-card h3) {
  min-height: 54px;
  margin-top: 17px;
  font-family: Georgia, serif;
  font-size: 21px;
  line-height: 27px;
}

:global(html[data-locale-layout='international'] .reward-card p) {
  min-height: 0;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: 0;
}

@media (max-width: 1439px) {
  .rewards-grid {
    grid-template-columns: repeat(2, 400px);
    width: min(100%, 820px);
  }
}

@media (max-width: 860px) {
  .rewards-section {
    padding-top: 58px;
  }

  .rewards-grid {
    grid-template-columns: 400px;
    width: 400px;
    gap: 30px;
  }
}

@media (max-width: 430px) {
  .rewards-section {
    padding-inline: 15px;
  }

  .rewards-grid {
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }

  .reward-card {
    height: 290px;
    padding-inline: 16px;
    background: #fff;
    border: 1px solid #f2d2af;
    border-radius: 18px;
  }

  .reward-frame {
    display: none;
  }

  .reward-icon-box {
    height: 138px;
  }

  .reward-card h3 {
    margin-top: 20px;
    font-size: 24px;
  }

  .reward-card p {
    width: 100%;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: .5px;
  }

  :global(html[data-locale-layout='international'] .reward-card) {
    height: auto;
    min-height: 310px;
    padding-bottom: 24px;
  }
}
</style>
