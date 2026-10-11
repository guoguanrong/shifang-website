<template>
  <section id="top" class="hero-section">
    <!-- 背景图与遮罩独立分层，确保文字在不同画面区域仍清晰可读。 -->
    <img class="hero-image" :src="heroBackground" alt="" />
    <div class="hero-overlay" />

    <!-- 首屏主文案与核心行动按钮。 -->
    <div class="hero-content">
      <p class="eyebrow" :style="eyebrowStyle">{{ t('hero.badge') }}</p>
      <h1>{{ t('footer.logo') }}</h1>
      <p class="hero-slogan">{{ t('footer.slogan') }}</p>
      <div class="hero-actions">
        <button class="button button-primary" type="button" :style="primaryButtonStyle" @click="$emit('primary-action')">
          {{ t('hero.ctaPrimary') }}
        </button>
        <button class="button button-secondary" type="button" :style="secondaryButtonStyle">
          {{ t('hero.ctaSecondary') }}
        </button>
      </div>
      
    </div>

    <!-- 无需 JavaScript 的锚点入口，键盘用户也可以直接访问神殿规划。 -->
    <a class="scroll-hint" href="#temple-plan">
      {{ t('hero.scroll') }}
      <span class="scroll-hint-arrow" aria-hidden="true">↓</span>
    </a>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import heroBackground from '@/assets/images/bg-hero.webp'
import heroBadgeBg from '@/assets/cuts/hero-badge-bg.png'
import heroButtonPrimary from '@/assets/cuts/hero-button-primary.png'
import heroButtonSecondary from '@/assets/cuts/hero-button-secondary.png'
import heroDivider from '@/assets/cuts/hero-divider.svg'

defineEmits(['primary-action'])

// 首屏全部可见文案都随当前语言实时切换。
const { t } = useI18n()
// 将打包后的背景图通过 CSS 变量传给对应元素。
const eyebrowStyle = { '--eyebrow-bg': `url("${heroBadgeBg}")` }
const primaryButtonStyle = { '--button-bg': `url("${heroButtonPrimary}")` }
const secondaryButtonStyle = { '--button-bg': `url("${heroButtonSecondary}")` }
const dividerStyle = { '--divider-line': `url("${heroDivider}")` }
</script>

<style scoped>
.hero-section {
  position: relative;
  display: grid;
  min-height: 1083px;
  place-items: center;
  isolation: isolate;
  color: #fff;
  text-align: center;
  overflow: hidden;
  background: #e7e8e5;
}

.hero-section::before {
  position: absolute;
  z-index: -3;
  inset: -28px;
  content: '';
  background: url('@/assets/images/bg-hero.webp') center / cover no-repeat;
  filter: blur(22px) saturate(.78);
  opacity: 0;
  transform: scale(1.035);
}

.hero-image,
.hero-overlay {
  position: absolute;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  z-index: -1;
  background: linear-gradient(180deg, rgba(12, 46, 75, 0.05), rgba(12, 46, 75, 0.28));
}

/*
 * 原始主视觉为 1448 × 1086。宽屏上不再使用 cover 放大主体，
 * 保持原图完整居中，两侧由柔化背景自然延展。
 */
@media (min-width: 1441px) {
  .hero-section::before {
    opacity: .5;
  }

  .hero-image {
    top: 0;
    left: 50%;
    width: min(100%, 1448px);
    max-width: none;
    object-fit: contain;
    transform: translateX(-50%);
  }
}

.hero-content {
  position: absolute;
  inset: 0;
  width: 100%;
}

/* 背景图原始比例为 920x104（约 8.9:1），尺寸尽量贴近以减少拉伸变形。 */
.eyebrow {
  position: absolute;
  top: 86px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 460px;
  height: 52px;
  margin: 0;
  padding: 0 2rem;
  color: #8F0000;
  font-family: Alike, Georgia, serif;
  font-size: 24px;
  letter-spacing: 0;
  background-image: var(--eyebrow-bg);
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transform: translateX(-50%);
}

h1 {
  display: none;
  font-family: var(--font-calligraphy);
  font-size: clamp(3.5rem, 9vw, 7.5rem);
  font-weight: 400;
  letter-spacing: 0.15em;
}

.hero-slogan {
  display: none;
}

.hero-actions {
  position: absolute;
  top: 444px;
  left: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  transform: translateX(-50%);
}

/* 竖线装饰位于徽章（底部 138px）与按钮（顶部 444px）之间的视觉中点。 */
.hero-divider {
  position: absolute;
  top: 261px;
  left: 50%;
  width: 1px;
  height: 60px;
  background-image: var(--divider-line);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transform: translateX(-50%) scaleY(0);
  transform-origin: top center;
  animation: divider-grow 1.1s .3s cubic-bezier(.22, .61, .36, 1) forwards;
}

/* 一道柔光自上而下沿竖线流动，循环呼吸。 */
.hero-divider::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, .95), transparent);
  background-size: 100% 300%;
  background-repeat: no-repeat;
  animation: divider-shine 2.6s 1.4s ease-in-out infinite;
  opacity: 0;
}

@keyframes divider-grow {
  from { transform: translateX(-50%) scaleY(0); opacity: 0; }
  60% { opacity: 1; }
  to { transform: translateX(-50%) scaleY(1); opacity: 1; }
}

@keyframes divider-shine {
  0% { background-position: 0 -100%; opacity: 0; }
  15% { opacity: 1; }
  55% { background-position: 0 100%; opacity: 1; }
  70%, 100% { background-position: 0 100%; opacity: 0; }
}

/* 两张按钮背景图原始比例均为 560x128（4.375:1），与 min-width 280px / min-height 64px 正好一致。 */
.button {
  min-width: 280px;
  min-height: 64px;
  padding: 14px 2rem;
  color: #fff;
  font: inherit;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  background-color: #cc3513;
  background-image: var(--button-bg);
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: filter .18s ease, transform .18s ease;
}

.button:hover {
  filter: brightness(1.08);
}

.button:active {
  filter: brightness(.95);
  transform: scale(.98);
}

.button-primary { background-color: #cc3513; }
.button-secondary { background-color: #2b59a2; }

/* “向下探索”文字 + 竖线整体在背景图正中下方；底部背景偏浅，用深蓝保证可读。 */
.scroll-hint {
  /* 光点行程：起点为自身高度（贴竖线顶端），终点为竖线高度。 */
  --trail-start: 18px;
  --trail-end: 60px;
  position: absolute;
  bottom: 164px;
  left: 50%;
  color: #2E4C7C;
  font-size: 14px;
  letter-spacing: 0;
  text-decoration: none;
  transform: translateX(-50%);
  animation: hint-in .8s .45s cubic-bezier(.22, .61, .36, 1) both;
}
.scroll-hint::after { display: block; width: 1px; height: 60px; margin: 12px auto 0; content: ''; background: currentColor; }

/* 金色光点沿竖线自上而下循环坠落，强化“向下”的引导感。 */
.scroll-hint::before {
  position: absolute;
  bottom: 60px;
  left: 50%;
  width: 3px;
  height: 18px;
  margin-left: -1.5px;
  content: '';
  border-radius: 999px;
  background: linear-gradient(180deg, transparent, #e0a33c, transparent);
  animation: hint-trail 2.4s .9s ease-in-out infinite;
}

.scroll-hint-arrow {
  display: inline-block;
  margin-left: 2px;
  animation: hint-arrow 1.6s ease-in-out infinite;
}

@keyframes hint-in {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes hint-trail {
  0% { opacity: 0; transform: translateY(var(--trail-start)); }
  15%, 60% { opacity: 1; }
  100% { opacity: 0; transform: translateY(var(--trail-end)); }
}

@keyframes hint-arrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
@media (max-width: 760px) { .hero-section { min-height: max(680px, calc(100svh - 64px)); } .eyebrow { top: 65px; min-width: 0; font-size: 14px; white-space: nowrap; } .hero-actions { top: 55%; gap: 10px; } .hero-divider { top: 33%; } .button { min-width: min(100%, 260px); min-height: 50px; font-size: 18px; } .scroll-hint { bottom: 20px; } .scroll-hint::after { height: 35px; } .scroll-hint::before { bottom: 35px; height: 12px; } .scroll-hint { --trail-start: 12px; --trail-end: 35px; } }
</style>
