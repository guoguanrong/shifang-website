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
                :aria-pressed="payment === method.id" @click="payment = method.id"><img :src="method.image"
                  :alt="method.label" /><span v-if="kind === 'deity' && method.id === 'paypal'" class="payment-recommended">{{ t('offerings.paymentRecommended') }}</span></button>
            </div>
            <div class="dialog-actions">
              <CeremonialButton :label="`${t('offerings.pay')}  $${amount}`" @click="unavailable = true" /><button
                class="dialog-cancel" type="button" @click="cancel">{{ t('offerings.reconsider') }}</button>
            </div>
            <p v-if="unavailable" class="payment-unavailable" role="status">{{ t('offerings.paymentUnavailable') }}</p>
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
import paypal from '@/assets/offerings/paypal.png'
import applePay from '@/assets/offerings/apple-pay.webp'
import closeIcon from '@/assets/offerings/close.svg'
import emblem from '@/assets/events/section-emblem.svg'
import confirmEmblem from '@/assets/offerings/confirm-emblem.svg'
import '@/styles/deity-offering-dialog.css'
// paymentConfirmed 仅供后续经过服务端核验的支付结果驱动，不能在支付按钮点击时置为 true。
const props = defineProps({ title: String, amount: Number, period: String, planLabel: String, paymentConfirmed: Boolean, kind: { type: String, default: 'lamp' }, details: { type: Object, default: null } })
const emit = defineEmits(['close'])
const { t } = useI18n()
const titleId = useId()
const dialog = ref(null)
// form 填写资料 → confirm 确认支付；传入 details 时直接进入确认态。
const stage = ref(props.details ? 'confirm' : 'form')
const order = ref(props.details || {})
// 选中的支付方式与「支付暂未开放」提示。
const payment = ref('paypal')
const unavailable = ref(false)
const methods = [{ id: 'paypal', image: paypal, label: 'PayPal' }, { id: 'apple-pay', image: applePay, label: 'Apple Pay' }]
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
function confirm(details) { order.value = details; stage.value = 'confirm'; dialog.value.scrollTop = 0 }
// 「再想想」：由外部传入订单时直接关闭，否则退回填写表单。
function cancel() { if (props.details) dialog.value.close(); else stage.value = 'form' }
// 点击对话框之外的遮罩区域时关闭。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}
</script>
