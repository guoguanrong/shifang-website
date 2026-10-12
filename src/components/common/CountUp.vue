<template>
  <span class="count-up">{{ display }}</span>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  duration: { type: Number, default: 700 },
  active: { type: Boolean, default: false },
})

const display = ref(0)
let frame = 0

function stop() {
  if (!frame) return
  cancelAnimationFrame(frame)
  frame = 0
}

function animate(target) {
  stop()
  const to = Number.isFinite(target) ? Math.max(0, Math.round(target)) : 0
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!props.active) {
    display.value = 0
    return
  }
  if (to === 0 || reduceMotion) {
    display.value = to
    return
  }
  const start = performance.now()
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.round(to * eased)
    if (progress < 1) frame = requestAnimationFrame(tick)
    else display.value = to
  }
  frame = requestAnimationFrame(tick)
}

watch(() => [props.active, props.value], () => {
  animate(props.value)
}, { immediate: true })

onBeforeUnmount(stop)
</script>
