<template>
  <Teleport to="body">
    <dialog v-if="open" ref="dialog" class="offering-dialog is-deity-confirmation donation-dialog is-completed"
      aria-labelledby="paypal-return-title" @close="finish" @click="onBackdrop">
      <div class="offering-dialog-content">
        <button class="dialog-close" type="button" :disabled="checking" :aria-label="t('offerings.close')" @click="dialog.close()">
          <img :src="closeIcon" alt="" />
        </button>
        <div class="dialog-heading">
          <img :src="emblem" alt="" aria-hidden="true" />
          <h2 id="paypal-return-title">{{ t(paid ? (pending.flow === 'offering' ? 'offerings.completedTitle' : 'donation.dialog.thanksTitle') : 'offerings.paymentResultTitle') }}</h2>
        </div>
        <div v-if="checking" class="offering-completed" role="status">
          <p>{{ t('offerings.paymentChecking') }}</p>
        </div>
        <div v-else-if="paid" class="offering-completed" role="status">
          <template v-if="pending.flow === 'offering'">
            <p>{{ t('offerings.completedThanks') }}</p>
            <p v-if="pending.name && pending.title">{{ t('offerings.completedDedication', { name: pending.name, deity: pending.title }) }}</p>
            <p>{{ t('offerings.completedService') }}</p>
          </template>
          <template v-else>
            <p>{{ t('donation.dialog.thanks') }}</p>
            <p>{{ t('donation.dialog.paidWith', { method: 'PayPal' }) }}</p>
            <p>{{ t('donation.dialog.recorded') }}</p>
          </template>
          <p class="completed-blessing">{{ t('offerings.completedBlessing') }}！</p>
          <CeremonialButton :label="t(pending.flow === 'offering' ? 'offerings.completedBlessing' : 'donation.dialog.acknowledge')" @click="dialog.close()" />
        </div>
        <div v-else class="offering-completed" role="alert">
          <p>{{ message || t('offerings.paymentFailed') }}</p>
          <CeremonialButton v-if="pendingPaypalOrderId" :label="checking ? t('offerings.paying') : t('offerings.retryPayment')"
            :disabled="checking" @click="retryCapture" />
          <CeremonialButton :label="t('donation.dialog.acknowledge')" @click="dialog.close()" />
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
import { capturePaypalPayment } from '@/api/paypal'
import closeIcon from '@/assets/donation/close.svg'
import emblem from '@/assets/donation/confirm-emblem.svg'
import '@/styles/deity-offering-dialog.css'
import '@/styles/donation-dialog.css'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const dialog = ref(null)
const open = ref(false)
const checking = ref(false)
const paid = ref(false)
const message = ref('')
const pendingPaypalOrderId = ref('')
const pending = ref({})
const seen = new Set()
let previousOverflow = ''

function firstQueryValue(value) {
  const result = Array.isArray(value) ? value[0] : value
  return typeof result === 'string' ? result : ''
}

function paypalOrderIdFromQuery(query) {
  return firstQueryValue(query.token || query.paypalOrderId || query.paypal_order_id)
}

function isCancelledReturn(query) {
  return [query.cancel, query.cancelled, query.status]
    .map(firstQueryValue)
    .some(value => /^(1|true|yes|cancel|cancelled)$/i.test(value))
}

function returnKey(query) {
  if (isCancelledReturn(query)) return 'cancelled'
  const orderId = paypalOrderIdFromQuery(query)
  if (orderId) return `capture:${orderId}`
  const payerId = firstQueryValue(query.PayerID || query.payerId)
  return payerId ? `capture:pending:${payerId}` : ''
}

function readPending() {
  try {
    return JSON.parse(sessionStorage.getItem('shifang-paypal-return') || '{}')
  } catch {
    return {}
  }
}

watch(() => returnKey(route.query), async (key) => {
  if (!key || seen.has(key)) return
  seen.add(key)

  pending.value = readPending()
  open.value = true
  checking.value = true
  paid.value = false
  message.value = ''
  pendingPaypalOrderId.value = ''
  await nextTick()
  if (dialog.value && !dialog.value.open) dialog.value.showModal()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  try {
    if (key === 'cancelled') {
      message.value = t('offerings.paymentUnpaid')
      return
    }
    pendingPaypalOrderId.value = paypalOrderIdFromQuery(route.query) || pending.value.paypalOrderId || ''
    if (!pendingPaypalOrderId.value) {
      message.value = t('offerings.paymentFailed')
      return
    }
    await capturePaypalPayment(pendingPaypalOrderId.value, { silent: true })
    paid.value = true
    pendingPaypalOrderId.value = ''
  } catch (error) {
    message.value = error?.message || t('offerings.paymentFailed')
  } finally {
    checking.value = false
    clearReturn(paid.value || key === 'cancelled' || !pendingPaypalOrderId.value)
  }
}, { immediate: true })

async function retryCapture() {
  if (!pendingPaypalOrderId.value || checking.value) return
  checking.value = true
  message.value = ''
  try {
    await capturePaypalPayment(pendingPaypalOrderId.value, { silent: true })
    paid.value = true
    pendingPaypalOrderId.value = ''
    removePending()
  } catch (error) {
    message.value = error?.message || t('offerings.paymentFailed')
  } finally {
    checking.value = false
  }
}

function removePending() {
  try {
    sessionStorage.removeItem('shifang-paypal-return')
  } catch {
    // The capture result remains visible for this page session.
  }
}

function clearReturn(clearPending) {
  if (clearPending) removePending()
  const query = { ...route.query }
  for (const key of ['token', 'paypalOrderId', 'paypal_order_id', 'PayerID', 'payerId', 'cancel', 'cancelled']) {
    delete query[key]
  }
  if (isCancelledReturn(route.query)) delete query.status
  router.replace({ query }).catch(() => {})
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
