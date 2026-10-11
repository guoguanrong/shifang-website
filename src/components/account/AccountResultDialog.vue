<template>
  <Teleport to="body">
    <dialog ref="dialog" class="blessing-service-dialog account-result-dialog" :class="variantClass" :aria-labelledby="titleId" :aria-describedby="descriptionId"
      @close="emit('close')" @cancel.prevent="close" @click="onBackdrop">
      <div class="service-dialog-content">
        <button class="service-dialog-close" type="button" autofocus :aria-label="t('portal.common.close')" @click="close"><img :src="closeIcon" alt="" /></button>
        <header class="service-dialog-heading"><img :src="emblem" alt="" /><h2 :id="titleId">{{ title }}</h2></header>
        <div :id="descriptionId" class="service-dialog-copy">
          <slot />
        </div>
        <p class="service-dialog-blessing">{{ blessing }}</p>
        <div class="service-dialog-actions"><CeremonialButton :label="confirmLabel" @click="close" /></div>
        <p v-if="$slots.notice" class="service-dialog-preview"><slot name="notice" /></p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import closeIcon from '@/assets/verification/result/close.svg'
import emblem from '@/assets/verification/result/emblem.svg'
import '@/styles/blessing-service-dialog.css'
import '@/styles/account-result-dialog.css'

defineProps({ title: String, blessing: String, confirmLabel: String, variantClass: String })
const emit = defineEmits(['close'])
const { t } = useI18n()
const dialog = ref(null)
const titleId = useId()
const descriptionId = useId()
let previousOverflow = ''
let previousFocus

function close() {
  document.body.style.overflow = previousOverflow
  dialog.value?.close()
}

function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const bounds = dialog.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close()
}

onMounted(() => {
  previousOverflow = document.body.style.overflow
  previousFocus = document.activeElement
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
})

onBeforeUnmount(() => {
  close()
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
})
</script>
