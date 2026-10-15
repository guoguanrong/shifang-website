<template>
  <!-- 参与机缘：四项，左侧徽章显示汉字与罗马音。 -->
  <section class="opportunities">
    <header>
      <h2>{{ t('events.opportunities.title') }}</h2>
      <p>{{ t('events.opportunities.subtitle') }}</p>
    </header>
    <div class="opportunity-grid">
      <article v-for="(item, index) in items" :key="item.numeral">
        <div class="medallion">
          <img class="medallion-background" :src="medallion" alt="" aria-hidden="true" />
          <img class="medallion-glyph" :src="glyphs[index]" :alt="item.numeral" />
          <small>{{ item.roman }}</small>
        </div>
        <div class="opportunity-copy">
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
import medallion from '@/assets/events/opportunity-medallion.svg'
import yi from '@/assets/events/design/yi.webp'
import er from '@/assets/events/design/er.webp'
import san from '@/assets/events/design/san.webp'
import si from '@/assets/events/design/si.webp'

const { t, tm } = useI18n()
const items = computed(() => tm('events.opportunities.items'))
// 四枚徽章汉字图，顺序与语言包 items 一致。
const glyphs = [yi, er, san, si]
</script>

<style scoped>
/* 红底区块：纹理与渐变分别由 ::before / ::after 叠加。 */
.opportunities {
  position: relative;
  isolation: isolate;
  width: min(1240px, calc(100% - 48px));
  min-height: 612px;
  padding: 35px 40px 50px 100px;
  margin: 0 auto;
  color: #fff;
  background: #d45f45;
  font-family: var(--font-calligraphy);
}

.opportunities::before,
.opportunities::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: '';
  pointer-events: none;
}

.opportunities::before {
  opacity: .05;
  background: url('@/assets/events/red-texture.webp') left top / 512px 512px repeat;
  mix-blend-mode: luminosity;
}

.opportunities::after {
  background: linear-gradient(#cc3513, rgb(180 41 12 / 0%));
}

.opportunities header {
  margin-left: -60px;
  text-align: center;
}

.opportunities h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 400;
  line-height: 42px;
}

.opportunities header p {
  margin: 4px 0 0;
  font-size: 16px;
  line-height: 24px;
}

.opportunity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 500px));
  gap: 50px 100px;
  margin-top: 47px;
}

.opportunity-grid article {
  position: relative;
  min-width: 0;
  min-height: 180px;
  padding: 25px 34px 25px 105px;
  color: #333;
  background: #fff;
  border-radius: 20px;
}

/* 徽章绝对定位，故意压在卡片左边缘之外。 */
.medallion {
  position: absolute;
  left: -63px;
  top: 21px;
  width: 138px;
  height: 138px;
}

.medallion-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.medallion-glyph {
  position: absolute;
  top: 28px;
  left: 50%;
  width: auto;
  height: 70px;
  transform: translateX(-50%);
}

.medallion small {
  position: absolute;
  left: 69px;
  bottom: 15px;
  color: #cc3513;
  font: 16px/1 var(--font-dyming-a);
  text-transform: uppercase;
}

.opportunity-grid h3 {
  margin: 0 0 14px;
  color: #000;
  font-size: 28px;
  font-weight: 400;
  line-height: 34px;
}

.opportunity-grid p {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1.6px;
}

@media (max-width: 1200px) {
  .opportunities {
    padding-left: 76px;
    padding-right: 24px;
  }

  .opportunities header {
    margin-left: -52px;
  }

  .opportunity-grid {
    gap: 36px 80px;
  }

  .opportunity-grid article {
    padding: 24px 20px 24px 80px;
  }

  .medallion {
    width: 120px;
    height: 120px;
    left: -55px;
  }

  .medallion-glyph {
    height: 60px;
    top: 24px;
  }

  .medallion small {
    left: 60px;
    bottom: 13px;
    font-size: 14px;
  }

  .opportunity-grid h3 {
    font-size: 24px;
    line-height: 30px;
  }

  .opportunity-grid p {
    letter-spacing: .5px;
  }
}

@media (max-width: 900px) {
  .opportunities {
    width: calc(100% - 40px);
    padding: 34px 24px 40px 72px;
  }

  .opportunities header {
    margin-left: -48px;
  }

  .opportunity-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    margin-top: 32px;
  }

  .opportunity-grid article {
    min-height: 180px;
    padding-left: 90px;
  }
}

@media (max-width: 520px) {
  .opportunities {
    width: calc(100% - 24px);
    padding: 30px 14px 32px 46px;
  }

  .opportunities header {
    margin-left: -32px;
  }

  .opportunities h2 {
    font-size: 25px;
    line-height: 34px;
  }

  .opportunities header p {
    font-size: 13px;
    line-height: 22px;
  }

  .opportunity-grid article {
    padding: 24px 14px 24px 62px;
  }

  .medallion {
    left: -34px;
    top: 24px;
    width: 90px;
    height: 90px;
  }

  .medallion-glyph {
    height: 46px;
    top: 16px;
  }

  .medallion small {
    left: 45px;
    bottom: 9px;
    font-size: 11px;
  }

  .opportunity-grid h3 {
    font-size: 21px;
    line-height: 28px;
    margin-bottom: 10px;
  }

  .opportunity-grid p {
    font-size: 14px;
    line-height: 23px;
    letter-spacing: 0;
  }
}

:global(html[data-locale-layout='international'] .opportunities h3) {
  font-size: 22px;
  line-height: 30px;
}

:global(html[data-locale-layout='international'] .opportunities .opportunity-copy p) {
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
}

@media (max-width: 520px) {
  :global(html[data-locale-layout='international'] .opportunities h3) {
    font-size: 19px;
    line-height: 26px;
  }
}
</style>
