<template>
  <div class="page-hero-background" aria-hidden="true">
    <img class="page-hero-art" :src="heroArt" alt="" />
  </div>
</template>

<script setup>
import heroArt from '@/assets/deities/hero-art.webp'
</script>

<style scoped>
/* 与 /deities 的首屏一致；背景高度不随长正文拉伸，避免云纹变形。 */
.page-hero-background {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 50%;
  width: 100vw;
  height: 474px;
  overflow: hidden;
  pointer-events: none;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #fff8ef 0%, #f9f3eb 72%, #f3f0e9 100%);
}
.page-hero-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
}
@media (max-width: 760px) {
  .page-hero-background { height: 392px; }
  .page-hero-art { opacity: .24; }
}
@media (max-width: 760px) {
  :global(html[data-locale-layout='international'] .page-hero-background) { height: 420px; }
}
</style>
