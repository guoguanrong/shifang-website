<template>
  <!-- 随喜捐赠页：善款/实物类型由地址栏 ?type= 决定，选项、表单与结果弹窗的状态都集中在本页。 -->
  <OfferingPageShell class="donation-page" :title="t('donation.title')" :eyebrow="t('donation.eyebrow')"
    :subtitle="t('donation.subtitle')" :section="t('donation.section')" section-to="/co-build">
    <article class="donation-paper offering-paper">
      <section class="donation-types">
        <OrnateSectionHeading :art="headingArt" :title="t('donation.chooseType')" />
        <!-- 类型切换实现为 tablist：支持左右方向键与 Home/End 切换，并同步移动焦点。 -->
        <div class="donation-tabs" role="tablist" :aria-label="t('donation.chooseType')">
          <button v-for="(type, index) in types" :id="`donation-tab-${type}`" :key="type" type="button" role="tab"
            class="donation-type" :class="[type, { selected: mode === type }]" :aria-selected="mode === type"
            aria-controls="donation-options-panel" :tabindex="mode === type ? 0 : -1"
            @click="setMode(type)" @keydown="onTabKey($event, index)">
            <span class="donation-type-art"><img :src="type === 'money' ? moneyArt : goodsArt" alt="" aria-hidden="true" /></span>
            <span class="donation-type-title">{{ t(`donation.types.${type}.title`) }}</span>
            <span class="donation-type-copy">{{ t(`donation.types.${type}.description`) }}</span>
          </button>
        </div>
        <p class="donation-type-note">{{ t('donation.typeNote') }}</p>
      </section>
      <!-- 选项面板：金额/实物/数量通过 v-model 与子组件双向同步。 -->
      <div id="donation-options-panel" role="tabpanel" :aria-labelledby="`donation-tab-${mode}`">
        <DonationOptions v-model:amount="amount" v-model:custom-amount="customAmount" v-model:item-index="itemIndex"
          v-model:quantity="quantity" :mode="mode" :goods="goods" :invalid-amount="invalidAmount" />
      </div>
      <!-- 捐赠人信息表单：向插槽暴露 submit，由下方按钮触发，真正提交前先走 openConfirmation 校验。 -->
      <DonationDonorForm ref="donorForm" v-slot="{ submit }" @submit="openConfirmation">
        <!-- 实时汇总当前选择；aria-live 让读屏用户也能感知金额变化。 -->
        <dl class="donation-summary" aria-live="polite" aria-atomic="true">
          <div><dt>{{ t('donation.typeLabel') }}</dt><dd>{{ t(`donation.types.${mode}.title`) }}</dd></div>
          <div v-if="mode === 'goods'"><dt>{{ t('donation.itemLabel') }}</dt><dd>{{ t(`donation.items.${itemIndex}.name`) }} × {{ quantity }}</dd></div>
          <div><dt>{{ t('donation.purposeLabel') }}</dt><dd>{{ t(`donation.purposes.${mode}`) }}</dd></div>
          <div class="donation-total"><dt>{{ t('donation.total') }}</dt><dd>{{ formattedTotal }}</dd></div>
        </dl>
        <div class="donation-pay">
          <CeremonialButton :label="t(`donation.pay.${mode}`)" @click="submit" />
          <p>{{ t('donation.paymentNote') }}</p>
        </div>
      </DonationDonorForm>
    </article>
    <!-- 结果/校验弹窗：amount 金额非法、name 未填姓名、confirm 确认下单。 -->
    <DonationDialog v-if="dialogState" :state="dialogState" :order="order" @close="closeDialog" />
  </OfferingPageShell>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import DonationOptions from '@/components/co-build/DonationOptions.vue'
import DonationDonorForm from '@/components/co-build/DonationDonorForm.vue'
import DonationDialog from '@/components/co-build/DonationDialog.vue'
import headingArt from '@/assets/donation/heading.svg'
import moneyArt from '@/assets/donation/money.png'
import goodsArt from '@/assets/donation/goods.png'
import brick from '@/assets/donation/brick.webp'
import tile from '@/assets/donation/tile.webp'
import incense from '@/assets/donation/incense.webp'
import fruit from '@/assets/donation/fruit.webp'
import wood from '@/assets/donation/wood.webp'
import gilding from '@/assets/donation/gilding.webp'
import '@/styles/donation.css'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
// 两种捐赠类型：善款 money 与实物 goods。
const types = ['money', 'goods']
// 当前类型取自地址栏 ?type=，缺省为善款；分享或刷新页面都能保持同一类型。
const mode = computed(() => route.query.type === 'goods' ? 'goods' : 'money')
// 善款：预设金额或自填金额；实物：选中的物品索引与数量。
const amount = ref(1000)
const customAmount = ref('')
const itemIndex = ref(5)
const quantity = ref(10)
const donorForm = ref(null)
// 弹窗状态：null 表示关闭，'amount' 金额非法、'name' 未填姓名、'confirm' 确认下单。
const dialogState = ref(null)
const order = ref(null)
// 切换类型时关掉可能残留的提示弹窗。
watch(mode, () => { dialogState.value = null })
// 实物捐赠的单价表，数组下标即 itemIndex。
const goods = [
  { id: 'brick', price: 50, image: brick },
  { id: 'tile', price: 100, image: tile },
  { id: 'incense', price: 150, image: incense },
  { id: 'fruit', price: 200, image: fruit },
  { id: 'wood', price: 500, image: wood },
  { id: 'gilding', price: 1000, image: gilding },
]
// 自填金额需为 50 ~ 999999999 之间、最多两位小数的数字。
const invalidAmount = computed(() => customAmount.value !== '' && (!Number.isFinite(Number(customAmount.value)) || Number(customAmount.value) < 50 || Number(customAmount.value) > 999999999 || !/^\d+(\.\d{1,2})?$/.test(customAmount.value)))
// 实物为单价 × 数量；善款金额非法时返回 null，界面显示占位符。
const total = computed(() => mode.value === 'goods' ? goods[itemIndex.value].price * quantity.value : invalidAmount.value ? null : Number(customAmount.value || amount.value))
// 按当前语言格式化金额。
const formattedTotal = computed(() => total.value === null ? '—' : `$${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(total.value)}`)

// 用 replace 改写地址栏，切换类型不留下多余历史记录。
function setMode(type) {
  return router.replace({ query: { ...route.query, type } })
}

// 提交前依次校验：自填金额是否合法、非匿名时是否填写姓名、表单其余字段是否通过。
function openConfirmation(details) {
  if (mode.value === 'money' && invalidAmount.value) {
    dialogState.value = 'amount'
    return
  }
  if (!details.anonymous && !details.name) {
    dialogState.value = 'name'
    return
  }
  if (!donorForm.value.validate()) return
  order.value = { ...details, mode: mode.value, amount: total.value, itemIndex: itemIndex.value, quantity: quantity.value }
  dialogState.value = 'confirm'
}

// 关闭提示弹窗后，把焦点送回出错的字段，方便直接修改。
async function closeDialog() {
  const state = dialogState.value
  dialogState.value = null
  await nextTick()
  if (state === 'name' || state === 'amount') {
    document.getElementById(state === 'name' ? 'donation-name' : 'donation-custom')?.focus()
  }
}

// 方向键/Home/End 在两个类型标签之间切换，并把焦点移到新选中的标签。
async function onTabKey(event, index) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  // 只有两种类型，左右方向键即取另一个（1 - index）。
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index
  await setMode(types[next])
  await nextTick()
  document.getElementById(`donation-tab-${types[next]}`)?.focus()
}
</script>
