<template>
  <!-- 通用提示弹窗：标题 + 单条说明 + 确认按钮，用于表单校验等轻量提示。 -->
  <Teleport to="body">
    <dialog ref="dialog" class="blessing-service-dialog" tabindex="-1" :aria-labelledby="titleId"
      @close="emit('close')" @click="onBackdrop">
      <div class="service-dialog-content">
        <button class="service-dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()">
          <img :src="closeIcon" alt="" />
        </button>
        <header class="service-dialog-heading">
          <img :src="emblem" alt="" aria-hidden="true" />
          <h2 :id="titleId">{{ title }}</h2>
        </header>
        <div class="service-dialog-copy">
          <p>{{ message }}</p>
        </div>
        <div class="service-dialog-actions">
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
import closeIcon from '@/assets/blessing-details/service-dialog-close.svg'
import emblem from '@/assets/blessing-details/service-dialog-emblem.svg'
import '@/styles/blessing-service-dialog.css'

defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
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
