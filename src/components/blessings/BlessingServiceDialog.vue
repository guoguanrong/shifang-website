<template>
  <!-- 祈福服务弹窗：kind 决定符咒/节气文案，cancel 为真时切换成「取消确认」话术。 -->
  <Teleport to="body">
    <dialog ref="dialog" class="blessing-service-dialog" :class="{ 'is-talisman': kind === 'talisman', 'is-cancel': cancel }"
      :aria-labelledby="titleId" :aria-describedby="previewId" @close="emit('close')" @click="onBackdrop">
      <div class="service-dialog-content">
        <button class="service-dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()"><img :src="closeIcon" alt="" /></button>
        <header class="service-dialog-heading"><img :src="emblem" alt="" aria-hidden="true" />
          <h2 :id="titleId">{{ t(`blessingDetails.dialog.${cancel ? 'cancelTitle' : kind === 'talisman' ? 'talismanTitle' : 'enableTitle'}`) }}</h2>
        </header>
        <!-- 三种文案分支：取消确认 / 电子护身符 / 节气提醒。 -->
        <div class="service-dialog-copy">
          <template v-if="cancel"><p>{{ t('blessingDetails.dialog.cancelQuestion') }}</p><p>{{ t('blessingDetails.dialog.cancelText') }}</p></template>
          <template v-else-if="kind === 'talisman'">
            <p>{{ t('blessingDetails.dialog.talismanRequested') }}</p>
            <p>{{ t('blessingDetails.dialog.talismanConsecration') }}</p>
            <p>{{ t('blessingDetails.dialog.talismanWallpaper') }}</p>
          </template>
          <template v-else>
            <p>{{ t('blessingDetails.dialog.enabled') }}</p>
            <p>{{ t('blessingDetails.dialog.seasonalText') }}</p>
          </template>
        </div>
        <p class="service-dialog-blessing">{{ t(`blessingDetails.dialog.${kind === 'talisman' ? 'blessing' : 'seasonalBlessing'}`) }}</p>
        <!-- 下载按钮为演示用途：aria-disabled 但仍可点击，点击后提示暂未开放。 -->
        <button v-if="kind === 'talisman'" class="service-dialog-download" type="button" aria-disabled="true"
          @click="downloadNotice = true">{{ t('blessingDetails.dialog.download') }}</button>
        <p v-if="downloadNotice" class="service-dialog-download-notice" role="status">{{ t('blessingDetails.dialog.downloadUnavailable') }}</p>
        <div class="service-dialog-actions">
          <CeremonialButton :label="t(cancel ? 'blessingDetails.dialog.confirm' : 'offerings.completedBlessing')" @click="emit('confirm')" />
          <button v-if="cancel" type="button" class="service-dialog-reconsider" @click="dialog.close()">{{ t('offerings.reconsider') }}</button>
        </div>
        <p :id="previewId" class="service-dialog-preview">{{ t('blessingDetails.dialog.preview') }}</p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import closeIcon from '@/assets/blessing-details/service-dialog-close.svg'
import emblem from '@/assets/blessing-details/service-dialog-emblem.svg'
import '@/styles/blessing-service-dialog.css'

// kind 决定文案分支（talisman 等）；cancel 表示这是取消服务的确认框。
defineProps({ kind: { type: String, required: true }, cancel: Boolean })
const emit = defineEmits(['close', 'confirm'])
const { t } = useI18n()
// 用 useId 生成无障碍标签所需的唯一 id。
const titleId = useId()
const previewId = useId()
const dialog = ref(null)
// 点击下载后的提示是否已展示。
const downloadNotice = ref(false)
// 记住打开前的焦点与页面滚动状态，关闭后原样恢复。
let previousFocus
let previousOverflow
onMounted(() => {
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
})
onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  previousFocus?.focus({ preventScroll: true })
})
// 点击对话框之外的遮罩区域时关闭（dialog 元素本身也会收到点击）。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}
</script>
