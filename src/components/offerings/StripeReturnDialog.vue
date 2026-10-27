<template>
  <Teleport to="body">
    <dialog v-if="open" ref="dialog" class="offering-dialog is-completed" aria-labelledby="stripe-return-title" @close="finish" @click="onBackdrop">
      <div class="offering-dialog-content">
        <button class="dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()"><img :src="closeIcon" alt="" /></button>
        <div class="dialog-heading"><img :src="emblem" alt="" />
          <h2 id="stripe-return-title">{{ t(paid ? 'offerings.completedTitle' : 'offerings.paymentResultTitle') }}</h2>
        </div>
        <div v-if="checking" class="offering-completed" role="status"><p>{{ t('offerings.paymentChecking') }}</p></div>
        <div v-else-if="paid" class="offering-completed" role="status">
          <p>{{ t('offerings.completedThanks') }}</p>
          <p v-if="pending.name && pending.title">{{ t('offerings.completedDedication', { name: pending.name, deity: pending.title }) }}</p>
          <p v-if="statusText">{{ statusText }}</p>
          <p>{{ t('offerings.completedService') }}</p>
          <p class="completed-blessing">{{ t('offerings.completedBlessing') }}！</p>
          <CeremonialButton :label="t(pending.kind === 'deity' ? 'offerings.completedBlessingDeity' : 'offerings.completedBlessingLamp')" @click="dialog.close()" />
        </div>
        <div v-else class="offering-completed" role="alert">
          <p>{{ message }}</p>
          <CeremonialButton :label="t('offerings.close')" @click="dialog.close()" />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { checkStripePayment } from '@/api/stripe'
import closeIcon from '@/assets/offerings/close.svg'
import emblem from '@/assets/events/section-emblem.svg'
import '@/styles/offerings.css'
import '@/styles/deity-offering-dialog.css'

const FAILED = /^(unpaid|open|expired|canceled|cancelled|failed|fail|incomplete)$/i
const STATUS_CODE = /^(paid|complete|completed|success|succeeded|ok)$/i
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const dialog = ref(null)
const open = ref(false)
const checking = ref(false)
const paid = ref(false)
const message = ref('')
const statusText = ref('')
const pending = ref({})
const seen = new Set()
let previousOverflow = ''

function sessionIdOf(query) {
  const value = query.session_id || query.sessionId
  return Array.isArray(value) ? value[0] : (value || '')
}

function readPending() {
  try {
    return JSON.parse(sessionStorage.getItem('shifang-stripe-return') || '{}')
  } catch {
    return {}
  }
}

watch(() => sessionIdOf(route.query), async (sessionId) => {
  if (!sessionId || seen.has(sessionId)) return
  seen.add(sessionId)
  pending.value = readPending()
  open.value = true
  checking.value = true
  paid.value = false
  message.value = ''
  statusText.value = ''
  await nextTick()
  if (dialog.value && !dialog.value.open) dialog.value.showModal()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  try {
    const data = await checkStripePayment(sessionId, { silent: true })
    const text = typeof data === 'string' ? data.trim() : ''
    if (FAILED.test(text) || /未支付|失败|未完成|已取消|已过期/.test(text)) {
      message.value = text && !FAILED.test(text) ? text : t('offerings.paymentUnpaid')
    } else {
      paid.value = true
      statusText.value = text && !STATUS_CODE.test(text) ? text : ''
    }
  } catch (error) {
    message.value = error?.message || t('offerings.paymentFailed')
  } finally {
    checking.value = false
    clearReturn()
  }
}, { immediate: true })

function clearReturn() {
  try { sessionStorage.removeItem('shifang-stripe-return') } catch { /* 结果已经展示 */ }
  const query = { ...route.query }
  if (!query.session_id && !query.sessionId) return
  delete query.session_id
  delete query.sessionId
  router.replace({ query })
}

function finish() {
  open.value = false
  document.body.style.overflow = previousOverflow
}

function onBackdrop(event) {
  if (event.target !== dialog.value || checking.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}

onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
})
</script>
