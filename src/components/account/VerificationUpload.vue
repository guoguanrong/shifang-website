<template>
  <div class="verification-upload-field">
    <div class="verification-upload" :class="{ 'has-image': preview, 'has-error': errorKey }" :aria-busy="busy">
      <img v-if="preview" class="verification-upload-preview" :src="preview" :alt="t('accountDetails.verification.previewAlt', { side: label })" />
      <label class="verification-upload-target" :for="inputId">
        <img v-if="!preview" class="verification-upload-icon" :src="icon" alt="" />
        <strong v-if="!preview">{{ label }}</strong>
        <span v-if="preview" class="verification-upload-status"><span aria-hidden="true">✓</span>{{ t('accountDetails.verification.uploaded') }}</span>
        <span v-else>{{ t(busy ? 'accountDetails.verification.processing' : 'accountDetails.verification.upload') }}</span>
      </label>
      <input :id="inputId" ref="input" class="verification-file-input" type="file" accept="image/jpeg,image/png,image/webp"
        :aria-label="t('accountDetails.verification.uploadLabel', { side: label })" :aria-invalid="Boolean(errorKey)"
        :aria-describedby="errorKey ? `${inputId}-error` : undefined" @change="chooseFile" />
      <button v-if="preview" class="verification-upload-remove" type="button"
        :aria-label="t('accountDetails.verification.removeLabel', { side: label })" @click="remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></svg>
        {{ t('accountDetails.verification.remove') }}
      </button>
    </div>
    <p v-if="errorKey" :id="`${inputId}-error`" class="account-field-error" role="alert">{{ t(errorKey) }}</p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ modelValue: { type: File, default: null }, label: String, icon: String, requiredError: Boolean })
const emit = defineEmits(['update:modelValue', 'busy'])
const { t } = useI18n()
const inputId = `verification-file-${useId()}`
const input = ref(null)
const preview = ref('')
const busy = ref(false)
const localError = ref('')
const errorKey = computed(() => localError.value || (props.requiredError ? 'accountDetails.verification.photoError' : ''))
let selection = 0

// 预览仅使用内存中的对象 URL；切换证件方式或离开页面时立即释放。
watch(() => props.modelValue, file => {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = file ? URL.createObjectURL(file) : ''
}, { immediate: true })

async function chooseFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  const current = ++selection
  localError.value = ''
  busy.value = false
  emit('busy', false)
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    localError.value = 'accountDetails.verification.formatError'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    localError.value = 'accountDetails.verification.sizeError'
    return
  }
  busy.value = true
  emit('busy', true)
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    if (current === selection) emit('update:modelValue', file)
  } catch {
    if (current === selection) localError.value = 'accountDetails.verification.readError'
  } finally {
    URL.revokeObjectURL(url)
    if (current === selection) {
      busy.value = false
      emit('busy', false)
    }
  }
}

function remove() {
  selection++
  busy.value = false
  emit('busy', false)
  localError.value = ''
  emit('update:modelValue', null)
  input.value?.focus()
}

onBeforeUnmount(() => {
  selection++
  if (preview.value) URL.revokeObjectURL(preview.value)
})
</script>
