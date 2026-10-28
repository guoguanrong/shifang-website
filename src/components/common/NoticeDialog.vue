<template>
  <!-- 通用金额/信息提示弹窗：标题 + 祝福语 + 补充说明 + 确认按钮，视觉沿用捐赠提示弹窗。 -->
  <Teleport to="body">
    <dialog ref="dialog" class="offering-dialog is-deity-confirmation donation-dialog donation-dialog-message notice-dialog"
      tabindex="-1" :aria-labelledby="titleId" @close="emit('close')" @click="onBackdrop">
      <div class="offering-dialog-content">
        <button class="dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()">
          <img :src="closeIcon" alt="" />
        </button>
        <div class="dialog-heading">
          <img :src="emblem" alt="" aria-hidden="true" />
          <h2 :id="titleId">{{ title }}</h2>
        </div>
        <div class="donation-validation" role="status">
          <p>{{ message }}</p>
          <p v-if="hint">{{ hint }}</p>
          <CeremonialButton :label="confirmLabel" @click="dialog.close()" />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import closeIcon from '@/assets/donation/close.svg'
import emblem from '@/assets/donation/confirm-emblem.svg'
import '@/styles/deity-offering-dialog.css'
import '@/styles/donation-dialog.css'

defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  hint: { type: String, default: '' },
  confirmLabel: { type: String, required: true },
})
const emit = defineEmits(['close'])
const { t } = useI18n()
const titleId = useId()
const dialog = ref(null)
let previousOverflow
let previousFocus

onMounted(() => {
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  // 焦点交给对话框容器，避免 Safari 打开时在关闭按钮上绘制蓝色焦点圈。
  dialog.value.focus({ preventScroll: true })
})

onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  previousFocus?.focus({ preventScroll: true })
})

// 点击对话框之外的遮罩区域时关闭。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}
</script>

<style scoped>
/* 焦点交给对话框容器后，Safari 会为容器绘制默认焦点圈，这里不展示。 */
.notice-dialog:focus,
.notice-dialog:focus-visible {
  outline: none;
}
</style>
