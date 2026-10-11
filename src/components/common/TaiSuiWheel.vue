<template>
  <div class="tai-sui-wheel">
    <img class="tai-sui-wheel__ornament" :src="ornament" alt="" />
    <img class="tai-sui-wheel__chart" :src="wheel" :alt="alt" :style="{ transform: 'rotate(' + (15.88 + rotation) + 'deg)' }" />
    <img class="tai-sui-wheel__center" :src="taiji" alt="" />
  </div>
</template>

<script setup>
import wheel from '@/assets/tai-sui/wheel.webp'
import ornament from '@/assets/tai-sui/ornament.webp'
import taiji from '@/assets/tai-sui/taiji.webp'

defineProps({ rotation: { type: Number, default: 0 }, alt: { type: String, required: true } })
</script>

<style scoped>
.tai-sui-wheel { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; }
.tai-sui-wheel img { position: absolute; display: block; object-fit: contain; pointer-events: none; }
.tai-sui-wheel__ornament { inset: 0; width: 100%; height: 100%; }
.tai-sui-wheel__chart { inset: 2.1%; width: 95.8%; height: 95.8%; transition: transform .4s ease; }
.tai-sui-wheel__center { inset: 43.2%; width: 13.6%; height: 13.6%; }
@media (prefers-reduced-motion: reduce) { .tai-sui-wheel__chart { transition: none; } }
</style>
