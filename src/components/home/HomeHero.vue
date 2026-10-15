<template>
  <section id="top" class="hero-section" :data-viewport="viewport">
    <!-- 背景图按当前语言与视口档位切换，文案、徽章与按钮均已绘制在图内。 -->
    <img class="hero-image" :src="heroImage" alt="" />
    <div class="hero-overlay" />

    <!-- 图内按钮的可点击热区：位置随视口档位对齐图内构图，承接原有跳转交互。 -->
    <div class="hero-content">
      <div class="hero-hotspots">
        <button class="hotspot hotspot-primary" type="button" :aria-label="t('hero.ctaPrimary')"
          @click="$emit('primary-action')" />
        <button class="hotspot hotspot-secondary" type="button" :aria-label="t('hero.ctaSecondary')" />
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

defineEmits(['primary-action'])

// 首屏全部可见文案都随当前语言实时切换。
const { t, locale } = useI18n()

// 背景图映射：视口档位 × 语言。文案与按钮都已绘制在图内，切换语言即切换整图。
const HERO_IMAGES = {
  wide: { 'zh-CN': heroWideZhCN, 'zh-TW': heroWideZhTW, en: heroWideEn },
  desktop: { 'zh-CN': heroDesktopZhCN, 'zh-TW': heroDesktopZhTW, en: heroDesktopEn },
  mobile: { 'zh-CN': heroMobileZhCN, 'zh-TW': heroMobileZhTW, en: heroMobileEn },
}

// 视口档位与样式断点保持一致：≤760 移动端，≥1441 桌面宽屏，其余桌面标准。
const viewport = ref('desktop')

function updateViewport() {
  const width = window.innerWidth
  viewport.value = width <= 760 ? 'mobile' : width >= 1441 ? 'wide' : 'desktop'
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
})

// 按当前语言与视口取背景图；未知语言回退简体。
const heroImage = computed(() => HERO_IMAGES[viewport.value][locale.value] || HERO_IMAGES[viewport.value]['zh-CN'])
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
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  z-index: -1;
  background: linear-gradient(180deg, rgba(12, 46, 75, 0.05), rgba(12, 46, 75, 0.28));
}

.hero-content {
  position: absolute;
  inset: 0;
  width: 100%;
}

/* 图内按钮热区：透明区域对齐背景图中绘制的按钮，覆盖点击与无障碍标签。 */
.hero-hotspots {
  position: absolute;
  inset: 0;
}

.hotspot {
  position: absolute;
  background: transparent;
  border: 0;
  cursor: pointer;
}

/* 桌面标准/宽屏图（横构图）：两枚按钮并排位于图内约 42%-50% 高度、中心对称。 */
.hotspot-primary {
  top: 42%;
  left: 37%;
  width: 12.5%;
  height: 8%;
}

.hotspot-secondary {
  top: 42%;
  left: 50.5%;
  width: 12.5%;
  height: 8%;
}

/* 移动端竖图（750×1200）：两枚按钮并排位于约 48%-57% 高度。 */
.hero-section[data-viewport='mobile'] .hotspot-primary {
  top: 47.5%;
  left: 8%;
  width: 39%;
  height: 9%;
}

.hero-section[data-viewport='mobile'] .hotspot-secondary {
  top: 47.5%;
  left: 53%;
  width: 39%;
  height: 9%;
}

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
@media (max-width: 760px) {
  .hero-section { min-height: max(680px, calc(100svh - 64px)); }
  .scroll-hint { bottom: 20px; --trail-start: 12px; --trail-end: 35px; }
  .scroll-hint::after { height: 35px; }
  .scroll-hint::before { bottom: 35px; height: 12px; }
}
</style>
