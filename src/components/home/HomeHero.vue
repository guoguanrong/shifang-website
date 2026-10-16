<template>
  <section id="top" ref="heroSection" class="hero-section" :data-viewport="viewport">
    <!-- 背景图按当前语言与视口档位切换。 -->
    <img class="hero-image" :src="heroImage" alt="" />
    <div class="hero-overlay" />

    <!-- 按钮在与背景图等比例缩放的画布中排版，避免 object-fit: cover 裁切时位置走偏。 -->
    <div class="hero-action-canvas" :style="heroArtworkStyle">
      <div class="hero-actions" :style="heroActionLayout">
        <button class="hero-action" type="button" :aria-label="t('hero.ctaPrimary')" @click="topage()">
          <img :src="heroButtons.primary" alt="" draggable="false" />
        </button>
        <button class="hero-action" type="button" :aria-label="t('hero.ctaSecondary')" @click="topage2()">
          <img :src="heroButtons.secondary" alt="" draggable="false" />
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// 首屏主视觉：三种视口（移动 ≤760 / 桌面标准 / 桌面宽屏 ≥1441）× 三种语言，各自独立出图。
import heroWideZhCN from '@/assets/hero/hero-wide-zh-CN.webp'
import heroWideZhTW from '@/assets/hero/hero-wide-zh-TW.webp'
import heroWideEn from '@/assets/hero/hero-wide-en.webp'
import heroDesktopZhCN from '@/assets/hero/hero-desktop-zh-CN.webp'
import heroDesktopZhTW from '@/assets/hero/hero-desktop-zh-TW.webp'
import heroDesktopEn from '@/assets/hero/hero-desktop-en.webp'
import heroMobileZhCN from '@/assets/hero/hero-mobile-zh-CN.webp'
import heroMobileZhTW from '@/assets/hero/hero-mobile-zh-TW.webp'
import heroMobileEn from '@/assets/hero/hero-mobile-en.webp'
import heroButtonPrimaryZhCN from '@/assets/hero/buttons/hero-button-primary-zh-CN.png'
import heroButtonSecondaryZhCN from '@/assets/hero/buttons/hero-button-secondary-zh-CN.png'
import heroButtonPrimaryZhTW from '@/assets/hero/buttons/hero-button-primary-zh-TW.png'
import heroButtonSecondaryZhTW from '@/assets/hero/buttons/hero-button-secondary-zh-TW.png'
import heroButtonPrimaryEn from '@/assets/hero/buttons/hero-button-primary-en.png'
import heroButtonSecondaryEn from '@/assets/hero/buttons/hero-button-secondary-en.png'



// 首屏全部可见文案都随当前语言实时切换。
const { t, locale } = useI18n()

// 背景图映射：视口档位 × 语言，切换语言时同步切换首屏文案。
const HERO_IMAGES = {
  wide: { 'zh-CN': heroWideZhCN, 'zh-TW': heroWideZhTW, en: heroWideEn },
  desktop: { 'zh-CN': heroDesktopZhCN, 'zh-TW': heroDesktopZhTW, en: heroDesktopEn },
  mobile: { 'zh-CN': heroMobileZhCN, 'zh-TW': heroMobileZhTW, en: heroMobileEn },
}

const HERO_BUTTONS = {
  'zh-CN': { primary: heroButtonPrimaryZhCN, secondary: heroButtonSecondaryZhCN },
  'zh-TW': { primary: heroButtonPrimaryZhTW, secondary: heroButtonSecondaryZhTW },
  en: { primary: heroButtonPrimaryEn, secondary: heroButtonSecondaryEn },
}

const HERO_IMAGE_DIMENSIONS = {
  wide: { width: 5120, height: 2172 },
  desktop: { width: 2880, height: 2172 },
  mobile: { width: 1500, height: 2400 },
}

const HERO_ACTION_LAYOUTS = {
  wide: {
    top: { 'zh-CN': '47.7%', 'zh-TW': '47.7%', en: '52.5%' },
    width: '22.5%',
    gap: '2.8%',
  },
  desktop: {
    top: { 'zh-CN': '45.8%', 'zh-TW': '45.8%', en: '50.7%' },
    width: '40%',
    gap: '3%',
  },
  mobile: {
    top: { 'zh-CN': '57.5%', 'zh-TW': '57.5%', en: '57.5%' },
    width: '77.5%',
    gap: '4.8%',
  },
}

// 视口档位与样式断点保持一致：≤760 移动端，≥1441 桌面宽屏，其余桌面标准。
const viewport = ref('desktop')
const heroSection = ref(null)
const heroArtworkSize = ref({ width: 0, height: 0 })
let heroSectionResizeObserver

const heroButtons = computed(() => HERO_BUTTONS[locale.value] || HERO_BUTTONS['zh-CN'])
const heroActionLayout = computed(() => {
  const layout = HERO_ACTION_LAYOUTS[viewport.value]
  const top = layout.top[locale.value] || layout.top['zh-CN']

  return { top, width: layout.width, gap: layout.gap }
})
const heroArtworkStyle = computed(() => ({
  width: `${heroArtworkSize.value.width}px`,
  height: `${heroArtworkSize.value.height}px`,
}))

function updateHeroArtworkSize() {
  const section = heroSection.value
  if (!section) return

  const { width: imageWidth, height: imageHeight } = HERO_IMAGE_DIMENSIONS[viewport.value]
  const { width, height } = section.getBoundingClientRect()
  const scale = Math.max(width / imageWidth, height / imageHeight)

  heroArtworkSize.value = {
    width: imageWidth * scale,
    height: imageHeight * scale,
  }
}

function updateViewport() {
  const width = window.innerWidth
  viewport.value = width <= 760 ? 'mobile' : width >= 1441 ? 'wide' : 'desktop'
  updateHeroArtworkSize()
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)

  if (typeof ResizeObserver !== 'undefined' && heroSection.value) {
    heroSectionResizeObserver = new ResizeObserver(updateHeroArtworkSize)
    heroSectionResizeObserver.observe(heroSection.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
  heroSectionResizeObserver?.disconnect()
})

// 按当前语言与视口取背景图；未知语言回退简体。
const heroImage = computed(() => HERO_IMAGES[viewport.value][locale.value] || HERO_IMAGES[viewport.value]['zh-CN'])

const router = useRouter()

// 主按钮跳转共建页。
function topage() {
  router.push({ name: 'co-build' })
}

function topage2() {
  router.push({ path: '/culture-origins' })
}
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

.hero-image,
.hero-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hero-image {
  z-index: -2;
  object-fit: cover;
}

.hero-overlay {
  z-index: -1;
  background: linear-gradient(180deg, rgba(12, 46, 75, 0.05), rgba(12, 46, 75, 0.28));
}

.hero-action-canvas {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hero-actions {
  position: absolute;
  top: 45%;
  left: 50%;
  display: flex;
  width: 40%;
  max-width: calc(100vw - 24px);
  gap: 3%;
  align-items: center;
  transform: translateX(-50%);
}

.hero-action {
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: none;
  cursor: pointer;
  line-height: 0;
  pointer-events: auto;
  transition: filter .18s ease, transform .18s ease;
}

.hero-action img {
  display: block;
  width: 100%;
  height: auto;
}

.hero-action:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

.hero-action:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 4px;
}

/* “向下探索”文字 + 竖线整体在背景图正中下方；底部背景偏浅，用深蓝保证可读。 */
.scroll-hint {
  /* 光点行程：起点为自身高度（贴竖线顶端），终点为竖线高度。 */
  --trail-start: 18px;
  --trail-end: 60px;
  position: absolute;
  z-index: 1;
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
@media (max-width: 760px) {
  .hero-section { min-height: max(680px, calc(100svh - 64px)); }
  .scroll-hint { bottom: 20px; --trail-start: 12px; --trail-end: 35px; }
  .scroll-hint::after { height: 35px; }
  .scroll-hint::before { bottom: 35px; height: 12px; }
}
</style>
