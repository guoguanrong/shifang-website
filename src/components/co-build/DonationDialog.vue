<template>
  <!-- 捐赠结果弹窗：state 决定文案（confirm 确认 / name 缺姓名 / amount 金额非法），支付成功后进入完成态。 -->
  <Teleport to="body">
    <dialog ref="dialog" class="offering-dialog is-deity-confirmation donation-dialog"
      :class="{ 'donation-dialog-message': state !== 'confirm' || paymentConfirmed, 'is-completed': paymentConfirmed }"
      :aria-labelledby="titleId" @close="emit('close')" @click="onBackdrop">
      <div class="offering-dialog-content">
        <button class="dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()">
          <img :src="closeIcon" alt="" />
        </button>
        <div class="dialog-heading"><img :src="emblem" alt="" aria-hidden="true" />
          <h2 :id="titleId">{{ t(`donation.dialog.${paymentConfirmed ? 'thanksTitle' : state === 'confirm' ? 'title' : state === 'name' ? 'nameTitle' : 'amountTitle'}`) }}</h2>
        </div>
        <div v-if="paymentConfirmed" class="offering-completed" role="status">
          <p>{{ t('donation.dialog.thanks') }}</p>
          <p>{{ t('donation.dialog.paidWith', { method: confirmedMethod }) }}</p>
          <p>{{ t('donation.dialog.recorded') }}</p>
          <p class="completed-blessing">{{ t('offerings.completedBlessing') }}！</p>
          <CeremonialButton :label="t('offerings.completedBlessing')" @click="dialog.close()" />
        </div>
        <!-- 校验不通过时的提示（缺少姓名或金额非法）。 -->
        <div v-else-if="state !== 'confirm'" class="donation-validation" role="status">
          <p>{{ t(`donation.dialog.${state === 'name' ? 'nameMessage' : 'amountMessage'}`) }}</p>
          <p>{{ t(`donation.dialog.${state === 'name' ? 'nameHint' : 'amountHint'}`) }}</p>
          <CeremonialButton :label="t('donation.dialog.acknowledge')" @click="dialog.close()" />
        </div>
        <template v-else>
          <dl class="order-summary">
            <div><dt>{{ t('donation.typeLabel') }}</dt><dd>{{ t(`donation.types.${order.mode}.title`) }}</dd></div>
            <div><dt>{{ t('donation.purposeLabel') }}</dt><dd>{{ order.targetTitle }}</dd></div>
            <div v-if="order.mode === 'goods'"><dt>{{ t('donation.itemLabel') }}</dt><dd>{{ order.itemName }} × {{ order.quantity }}</dd></div>
            <div><dt>{{ t('donation.total') }}</dt><dd>{{ amountLabel }}</dd></div>
          </dl>
          <dl class="devotee-summary">
            <div><dt>{{ t('donation.dialog.donor') }}</dt><dd>{{ order.anonymous ? t('donation.anonymous') : order.name }}</dd></div>
            <div><dt>{{ t('donation.dialog.phone') }}</dt><dd>{{ order.phone ? `${order.country} ${order.phone}` : t('donation.dialog.notProvided') }}</dd></div>
            <div><dt>{{ t('donation.dialog.email') }}</dt><dd>{{ order.email || t('donation.dialog.notProvided') }}</dd></div>
          </dl>
          <!-- <p class="payment-caption">{{ t('donation.dialog.choosePayment') }}</p>
          <div class="payment-options" role="group" :aria-label="t('offerings.paymentMethod')">
            <button v-for="method in methods" :key="method.id" type="button" :class="method.id"
              :aria-pressed="payment === method.id" @click="payment = method.id">
              <img :src="method.image" :alt="method.label" />
              <span v-if="method.id === 'paypal'" class="payment-recommended">{{ t('offerings.paymentRecommended') }}</span>
            </button>
          </div> -->
          <div class="dialog-actions">
            <CeremonialButton :label="paying ? t('offerings.paying') : `${t('offerings.pay')} ${amountLabel}`" :disabled="paying" @click="pay" />
            <button class="dialog-cancel" type="button" :disabled="paying" @click="dialog.close()">{{ t('offerings.reconsider') }}</button>
          </div>
          <p v-if="payError" class="payment-unavailable" role="alert">{{ payError }}</p>
          <p v-else-if="unavailable" class="payment-unavailable" role="status">{{ t('donation.dialog.unavailable') }}</p>
          <p class="payment-notice">{{ t('offerings.paymentNotice') }}</p>
        </template>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { createOrder } from '@/api/order'
import { createStripePayment } from '@/api/stripe'
import { useUserSession } from '@/composables/useUserSession'
import closeIcon from '@/assets/donation/close.svg'
import emblem from '@/assets/donation/confirm-emblem.svg'
import paypal from '@/assets/donation/paypal.png'
import applePay from '@/assets/donation/apple-pay.webp'
import '@/styles/deity-offering-dialog.css'
import '@/styles/donation-dialog.css'

// A confirmed result must come from a verified payment service, never from a button click.
const props = defineProps({ state: { type: String, default: 'confirm' }, order: Object, paymentConfirmed: Boolean, confirmedMethod: String })
const emit = defineEmits(['close'])
const { t, locale } = useI18n()
const titleId = useId()
const dialog = ref(null)
// 选中的支付方式与「支付暂未开放」提示。
const { user } = useUserSession()
const payment = ref('paypal')
const unavailable = ref(false)
const paying = ref(false)
const payError = ref('')
const methods = [{ id: 'paypal', label: 'PayPal', image: paypal }, { id: 'apple-pay', label: 'Apple Pay', image: applePay }]
// 金额按当前语言格式化。
const amountLabel = computed(() => `$${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(props.order?.amount ?? 0)}`)
// 记住打开前的焦点与页面滚动状态，关闭后原样恢复。
let previousOverflow
let previousFocus

function orderNumber(data) {
  if (typeof data === 'string' || typeof data === 'number') return String(data)
  return data?.orderNo || data?.id || ''
}

function paymentUrl(data) {
  if (typeof data === 'string') return /^https?:\/\//.test(data) ? data : ''
  if (!data || typeof data !== 'object') return ''
  const named = data.url || data.checkoutUrl || data.sessionUrl || data.payUrl
  if (named) return named
  return Object.values(data).find(value => typeof value === 'string' && /^https?:\/\//.test(value)) || ''
}

async function pay() {
  if (paying.value) return
  if (!props.order?.targetId) {
    unavailable.value = true
    return
  }
  paying.value = true
  payError.value = ''
  unavailable.value = false
  try {
    const member = user.value
    const goods = props.order.mode === 'goods'
    const shopItemsId = Number(props.order.shopItemsId)
    const created = await createOrder({
      type: 3,
      businessId: props.order.targetId,
      memberId: member?.id || undefined,
      username: props.order.anonymous ? undefined : (props.order.name || undefined),
      mobile: props.order.phone ? `${props.order.country} ${props.order.phone}`.trim() : (member?.phone || undefined),
      email: props.order.email || member?.email || undefined,
      prayWish: props.order.wish || undefined,
      donateType: goods ? 2 : 1,
      shopItemsId: Number.isInteger(shopItemsId) && shopItemsId > 0 ? shopItemsId : undefined,
      number: goods ? props.order.quantity : 1,
      amount: props.order.amount,
    }, { silent: true })
    const session = await createStripePayment({
      orderNo: orderNumber(created),
      amount: Number(props.order.amount),
      pageUrl: window.location.href,
    }, { silent: true })
    const url = paymentUrl(session)
    if (!url) {
      payError.value = t('offerings.paymentRedirectMissing')
      return
    }
    try {
      sessionStorage.setItem('shifang-stripe-return', JSON.stringify({
        title: props.order.targetTitle,
        name: props.order.anonymous ? '' : props.order.name,
      }))
    } catch {
      // 回跳后仍可按支付状态展示结果。
    }
    window.location.assign(url)
  } catch (error) {
    payError.value = error?.message || t('offerings.paymentFailed')
  } finally {
    paying.value = false
  }
}

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
// 点击对话框之外的遮罩区域时关闭。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}
</script>
