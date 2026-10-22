<template>
  <!-- 供奉/点灯下单弹窗：先填表单（form），再确认支付（confirm），支付成功后进入完成态。 -->
  <Teleport to="body">
    <dialog ref="dialog" class="offering-dialog" :class="{ 'is-deity-confirmation': kind === 'deity', 'is-completed': paymentConfirmed }" :aria-labelledby="titleId" @close="emit('close')" @click="onBackdrop">
      <div class="offering-dialog-content">
        <button class="dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()"><img
            :src="closeIcon" alt="" /></button>
        <div class="dialog-heading"><img :src="kind === 'deity' ? confirmEmblem : emblem" alt="" />
          <h2 :id="titleId">{{ t(paymentConfirmed ? 'offerings.completedTitle' : stage === 'form' ? 'offerings.orderTitle' : 'offerings.confirmTitle') }}</h2>
        </div>
        <div v-if="paymentConfirmed" class="offering-completed" role="status">
          <p>{{ t('offerings.completedThanks') }}</p>
          <p>{{ t('offerings.completedDedication', { name: order.name, deity: title }) }}</p>
          <p>{{ t('offerings.completedService') }}</p>
          <p class="completed-blessing">{{ t('offerings.completedBlessing') }}！</p>
          <CeremonialButton :label="t('offerings.completedBlessing')" @click="dialog.close()" />
        </div>
        <!-- 未支付时：先展示订单摘要，再按 stage 展示表单或确认信息。 -->
        <template v-else>
          <dl class="order-summary">
            <div>
              <dt>{{ t(kind === 'lamp' ? 'offerings.lampType' : 'offerings.deityLabel') }}</dt>
              <dd>{{ title }}</dd>
            </div>
            <template v-if="kind === 'lamp'">
              <div>
                <dt>{{ t('offerings.lighting') }}</dt>
                <dd>{{ t('offerings.free') }}</dd>
              </div>
              <div>
                <dt>{{ t('offerings.materials') }}</dt>
                <dd>{{ t('offerings.materialPackage') }}</dd>
              </div>
            </template>
            <div v-if="kind === 'lamp'">
              <dt>{{ t('offerings.total') }}</dt>
              <dd>${{ amount }}<span v-if="period"> / {{ period }}</span></dd>
            </div>
          </dl>
          <OfferingOrderForm v-if="stage === 'form'" :kind="kind" :amount="amount" :initial-details="order" compact
            @submit="confirm" />
          <template v-else>
            <dl class="devotee-summary">
              <div>
                <dt>{{ t(kind === 'deity' ? 'offerings.devoteeLabel' : 'offerings.name') }}</dt>
                <dd>{{ order.name }}</dd>
              </div>
              <div v-if="kind === 'deity'">
                <dt>{{ t('offerings.planLabel') }}</dt>
                <dd>{{ planLabel }}（${{ amount }}）</dd>
              </div>
              <div v-if="order.birth">
                <dt>{{ t('offerings.birth') }}</dt>
                <dd>{{ order.birth }}</dd>
              </div>
              <div v-if="order.wish">
                <dt>{{ t(kind === 'deity' ? 'offerings.wishLabel' : 'offerings.wish') }}</dt>
                <dd>{{ order.wish }}</dd>
              </div>
            </dl>
            <p class="payment-caption">{{ t(kind === 'deity' ? 'offerings.deityPaymentPrompt' : 'offerings.paymentPrompt') }}</p>
            <div class="payment-options" role="group" :aria-label="t('offerings.paymentMethod')">
              <button v-for="method in methods" :key="method.id" :class="method.id" type="button"
                :disabled="paying" :aria-pressed="payment === method.id" @click="payment = method.id">
                <img v-if="method.image" :src="method.image" :alt="method.label" />
                <span v-else class="payment-brand stripe-brand">{{ method.label }}</span>
                <span v-if="kind === 'deity' && method.id === 'paypal'" class="payment-recommended">{{ t('offerings.paymentRecommended') }}</span>
              </button>
            </div>
            <div class="dialog-actions">
              <CeremonialButton :label="paying ? t('offerings.paying') : `${t('offerings.pay')}  $${amount}`" :disabled="paying" @click="pay" /><button
                class="dialog-cancel" type="button" :disabled="paying" @click="cancel">{{ t('offerings.reconsider') }}</button>
            </div>
            <p v-if="payError" class="payment-unavailable" role="alert">{{ payError }}</p>
            <p v-else-if="unavailable" class="payment-unavailable" role="status">{{ t('offerings.paymentUnavailable') }}</p>
            <p class="payment-notice">{{ t('offerings.paymentNotice') }}</p>
          </template>
        </template>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import OfferingOrderForm from './OfferingOrderForm.vue'
import { createOrder } from '@/api/order'
import { createPaypalPayment } from '@/api/paypal'
import { createStripePayment } from '@/api/stripe'
import { useUserSession } from '@/composables/useUserSession'
import paypal from '@/assets/offerings/paypal.png'
import closeIcon from '@/assets/offerings/close.svg'
import emblem from '@/assets/events/section-emblem.svg'
import confirmEmblem from '@/assets/offerings/confirm-emblem.svg'
import '@/styles/deity-offering-dialog.css'
// paymentConfirmed 仅供后续经过服务端核验的支付结果驱动，不能在支付按钮点击时置为 true。
const props = defineProps({ title: String, amount: Number, period: String, planLabel: String, paymentConfirmed: Boolean, businessId: [Number, String], cycleType: Number, kind: { type: String, default: 'lamp' }, details: { type: Object, default: null } })
const emit = defineEmits(['close'])
const { t } = useI18n()
const titleId = useId()
const dialog = ref(null)
// form 填写资料 → confirm 确认支付；传入 details 时直接进入确认态。
const stage = ref(props.details ? 'confirm' : 'form')
const order = ref(props.details || {})
// 选中的支付方式与「支付暂未开放」提示。
const { user, ensureVisitorId } = useUserSession()
const payment = ref('paypal')
const unavailable = ref(false)
const paying = ref(false)
const payError = ref('')
// const methods = [{ id: 'paypal', image: paypal, label: 'PayPal' }, { id: 'stripe', label: 'Stripe' }]
const methods = [{ id: 'stripe', label: 'Stripe' }]
// 记住打开前的焦点与页面滚动状态，关闭后原样恢复。
let previousOverflow
let previousFocus
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
// 表单提交后进入确认态，并滚回弹窗顶部查看订单摘要。
function confirm(details) { order.value = details; stage.value = 'confirm'; payError.value = ''; dialog.value.scrollTop = 0 }
function orderNumber(data) {
  if (typeof data === 'string' || typeof data === 'number') return String(data)
  return data?.orderNo || data?.id || ''
}
function paymentUrl(data) {
  if (typeof data === 'string') return /^https?:\/\//.test(data) ? data : ''
  if (!data || typeof data !== 'object') return ''
  const named = data.approvalUrl || data.url || data.checkoutUrl || data.sessionUrl || data.payUrl
  if (named) return /^https?:\/\//i.test(named) ? named : ''
  return Object.values(data).find(value => typeof value === 'string' && /^https?:\/\//i.test(value)) || ''
}
async function pay() {
  if (paying.value) return
  if (props.kind !== 'lamp' && props.kind !== 'deity') {
    unavailable.value = true
    return
  }
  if (!props.businessId) {
    payError.value = t(props.kind === 'lamp' ? 'offerings.missingLamp' : 'offerings.worshipUnavailable')
    return
  }
  paying.value = true
  payError.value = ''
  unavailable.value = false
  try {
    const member = user.value
    const deity = props.kind === 'deity'
    const created = await createOrder({
      type: deity ? 2 : 1,
      businessId: Number(props.businessId),
      memberId: member?.id || undefined,
      uvid: ensureVisitorId(),
      username: order.value.name,
      mobile: member?.phone || undefined,
      email: member?.email || undefined,
      birthday: order.value.birth || undefined,
      prayWish: order.value.wish || undefined,
      amount: props.amount,
      number: 1,
      cycleType: deity ? props.cycleType : undefined,
    }, { silent: true })
    const orderNo = orderNumber(created)
    if (!orderNo) throw new Error(t('offerings.paymentFailed'))

    const pendingPayment = { flow: 'offering', title: props.title, name: order.value.name }
    const paymentResult = payment.value === 'paypal'
      ? await createPaypalPayment({ orderNo, amount: Number(props.amount), pageUrl: window.location.href }, { silent: true })
      : await createStripePayment({ orderNo, amount: Number(props.amount), pageUrl: window.location.href }, { silent: true })
    const url = paymentUrl(paymentResult)
    if (!url) {
      payError.value = t('offerings.paymentRedirectMissing')
      return
    }
    try {
      if (payment.value === 'paypal') {
        sessionStorage.setItem('shifang-paypal-return', JSON.stringify({
          ...pendingPayment,
          paypalOrderId: paymentResult?.paypalOrderId || '',
          orderNo,
        }))
      } else {
        sessionStorage.setItem('shifang-stripe-return', JSON.stringify(pendingPayment))
      }
    } catch {
      // The payment provider returns the order id for callback handling if storage is unavailable.
    }
    window.location.assign(url)
  } catch (error) {
    payError.value = error?.message || t('offerings.paymentFailed')
  } finally {
    paying.value = false
  }
}
// 「再想想」：由外部传入订单时直接关闭，否则退回填写表单。
function cancel() { if (props.details) dialog.value.close(); else stage.value = 'form' }
// 点击对话框之外的遮罩区域时关闭。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}
</script>
