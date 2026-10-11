<template>
  <button class="back-to-top" type="button" :aria-label="label" :title="label" @click="scrollToTop">
    <img :src="background" alt="" class="back-to-top__background" />
    <img :src="arrow" alt="" class="back-to-top__arrow" />
  </button>
</template>

<script setup>
import background from '@/assets/site-tools/top-background.svg'
import arrow from '@/assets/site-tools/top-arrow.svg'

defineProps({ label: { type: String, required: true } })

function scrollToTop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
}
</script>

<style scoped>
.back-to-top { position: relative; display: grid; width: 60px; height: 60px; padding: 0; place-items: center; border: 0; border-radius: 50%; background: transparent; cursor: pointer; }
.back-to-top__background { position: absolute; inset: 0; width: 100%; height: 100%; }
.back-to-top__arrow { position: relative; width: 44%; height: 44%; }
.back-to-top:focus-visible { outline: 2px solid #9b713b; outline-offset: 4px; }
@media (max-width: 767px), (max-height: 600px) { .back-to-top { width: 44px; height: 44px; } }
</style>
