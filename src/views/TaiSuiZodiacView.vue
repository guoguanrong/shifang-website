<template>
  <AccountPageShell class="tai-sui-page" :title="t('siteTools.taiSui.title')" :eyebrow="t('siteTools.taiSui.eyebrow')"
    :subtitle="t('siteTools.taiSui.subtitle')">
    <button type="button" class="tai-sui-chart-button" :aria-label="t('siteTools.taiSui.open')" @click="openViewer">
      <TaiSuiWheel :rotation="rotation" :alt="t('siteTools.taiSui.chartAlt')" />
    </button>
    <div class="tai-sui-controls">
      <button type="button" @click="rotation += 30"><img :src="clockwise" alt="" />{{ t('siteTools.taiSui.clockwise')
        }}</button>
      <button type="button" @click="rotation -= 30"><img :src="counterclockwise" alt="" />{{
        t('siteTools.taiSui.counterclockwise') }}</button>
    </div>
    <p class="tai-sui-hint">{{ t('siteTools.taiSui.hint') }}</p>
    <span class="tai-sui-sr-only" role="status">{{ t('siteTools.taiSui.rotation', {
      degrees: ((rotation % 360) + 360) %
        360
    }) }}</span>
    <dialog ref="viewer" class="tai-sui-viewer" aria-labelledby="tai-sui-viewer-title" @close="restorePage"
      @click="closeOnBackdrop">
      <div class="tai-sui-viewer__header">
        <h2 id="tai-sui-viewer-title">{{ t('siteTools.taiSui.dialogTitle') }}</h2>
        <button type="button" class="tai-sui-viewer__close" :aria-label="t('siteTools.taiSui.close')"
          @click="viewer.close()">×</button>
      </div>
      <label class="tai-sui-viewer__zoom">{{ t('siteTools.taiSui.zoom') }}<input v-model.number="zoom" type="range"
          min="1" max="3" step="0.25" /><output>{{ t('siteTools.taiSui.zoomValue', { value: zoom }) }}</output></label>
      <p class="tai-sui-hint">{{ t('siteTools.taiSui.zoomHint') }}</p>
      <div class="tai-sui-viewer__scroll" tabindex="0" :aria-label="t('siteTools.taiSui.chartAlt')">
        <TaiSuiWheel :style="{ width: zoom * 100 + '%' }" :rotation="rotation" :alt="t('siteTools.taiSui.chartAlt')" />
      </div>
    </dialog>
  </AccountPageShell>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import TaiSuiWheel from '@/components/common/TaiSuiWheel.vue'
import clockwise from '@/assets/tai-sui/clockwise.svg'
import counterclockwise from '@/assets/tai-sui/counterclockwise.svg'
import '@/styles/tai-sui.css'

const { t } = useI18n()
const rotation = ref(0)
const zoom = ref(1)
const viewer = ref(null)
let previousOverflow = null

function openViewer() {
  zoom.value = window.innerWidth < 768 ? 2.5 : 1
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  viewer.value.showModal()
}

function restorePage() {
  if (previousOverflow !== null) {
    document.body.style.overflow = previousOverflow
    previousOverflow = null
  }
}

function closeOnBackdrop(event) {
  if (event.target !== viewer.value) return
  const bounds = viewer.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.value.close()
}

onBeforeUnmount(restorePage)
</script>
