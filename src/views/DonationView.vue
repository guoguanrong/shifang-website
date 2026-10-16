<template>
  <!-- 随喜捐赠页：善款/实物类型由地址栏 ?type= 决定，选项、表单与结果弹窗的状态都集中在本页。 -->
  <OfferingPageShell class="donation-page" :title="t('donation.title')" :eyebrow="t('donation.eyebrow')"
    :subtitle="t('donation.subtitle')" :section="t('donation.section')" section-to="/co-build">
    <article class="donation-paper offering-paper">
      <section class="donation-types">
        <OrnateSectionHeading :art="headingArt" :title="t('donation.chooseType')" />
        <div v-if="targetOptions.length" class="donation-target-select">
          <label for="donation-target">{{ t('donation.targetLabel') }}</label>
          <select id="donation-target" :value="selectedTarget?.id || ''" @change="setTarget($event.target.value)">
            <option v-for="target in targetOptions" :key="target.id" :value="target.id">{{ target.title }}</option>
          </select>
        </div>
        <p v-else class="donation-target-empty" role="status">{{ t('donation.noTargets') }}</p>
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
        <DonationOptions v-model:amount="amount" v-model:custom-amount="customAmount" v-model:money-id="selectedMoneyId"
          v-model:item-index="itemIndex" v-model:quantity="quantity" :mode="mode" :amounts="moneyOptions" :goods="goods"
          :items-loading="shopItemsLoading" :invalid-amount="invalidAmount" />
      </div>
      <!-- 捐赠人信息表单：向插槽暴露 submit，由下方按钮触发，真正提交前先走 openConfirmation 校验。 -->
      <DonationDonorForm ref="donorForm" v-slot="{ submit }" @submit="openConfirmation">
        <!-- 实时汇总当前选择；aria-live 让读屏用户也能感知金额变化。 -->
        <dl class="donation-summary" aria-live="polite" aria-atomic="true">
          <div><dt>{{ t('donation.typeLabel') }}</dt><dd>{{ t(`donation.types.${mode}.title`) }}</dd></div>
          <div v-if="mode === 'goods'"><dt>{{ t('donation.itemLabel') }}</dt><dd>{{ selectedGood?.name || t('donation.noGoods') }} × {{ quantity }}</dd></div>
          <div><dt>{{ t('donation.purposeLabel') }}</dt><dd>{{ selectedTarget?.title || t(`donation.purposes.${mode}`) }}</dd></div>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import DonationOptions from '@/components/co-build/DonationOptions.vue'
import DonationDonorForm from '@/components/co-build/DonationDonorForm.vue'
import DonationDialog from '@/components/co-build/DonationDialog.vue'
import { getDonateTargetList } from '@/api/donateTarget'
import { getDonateShopItems } from '@/api/shopItems'
import headingArt from '@/assets/donation/heading.svg'
import moneyArt from '@/assets/donation/money.webp'
import goodsArt from '@/assets/donation/goods.webp'
import '@/styles/donation.css'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const types = ['money', 'goods']
const mode = computed(() => ['2', 'goods'].includes(String(route.query.type)) ? 'goods' : 'money')
const goals = ref([])
const shopItems = ref([])
const shopItemsLoading = ref(false)
const amount = ref(0)
const selectedMoneyId = ref(null)
const customAmount = ref('')
const itemIndex = ref(0)
const quantity = ref(10)
const donorForm = ref(null)
const dialogState = ref(null)
const order = ref(null)
// 捐赠目标下拉：优先展示与当前类型匹配的目标；后端未配置对应类型目标时回退为全部目标，保证物品接口有 donateTargetId 可传。
const targetOptions = computed(() => {
  const matched = goals.value.filter((goal) => Number(goal.type) === (mode.value === 'goods' ? 2 : 1))
  return matched.length ? matched : goals.value
})
const selectedTarget = computed(() => targetOptions.value.find((goal) => String(goal.id) === String(route.query.targetId)) || targetOptions.value[0] || null)
const goods = computed(() => shopItems.value.filter((item) => Number(item.type) !== 1 && item.name))
const moneyOptions = computed(() => shopItems.value.filter((item) => Number(item.type) !== 2 && item.price > 0))
const selectedMoneyItem = computed(() => moneyOptions.value.find((item) => item.id === selectedMoneyId.value) || null)
const selectedGood = computed(() => goods.value[itemIndex.value] || null)
const invalidAmount = computed(() => customAmount.value !== '' && (!/^\d{1,9}$/.test(customAmount.value) || Number(customAmount.value) < 50 || Number(customAmount.value) > 999999999))
const total = computed(() => mode.value === 'goods'
  ? selectedGood.value ? selectedGood.value.price * quantity.value : null
  : invalidAmount.value ? null : Number(customAmount.value || amount.value))
const formattedTotal = computed(() => total.value === null ? '—' : `$${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(total.value)}`)

function getList(payload) {
  const result = payload?.data ?? payload
  if (Array.isArray(result)) return result
  return result?.list || result?.records || []
}

async function getAllPages(fetchPage) {
  const records = []
  let page = 1
  let totalPage = 1
  do {
    const payload = await fetchPage({ page, pageSize: 200 })
    const result = payload?.data ?? payload
    const pageRecords = getList(result)
    records.push(...pageRecords)
    totalPage = Number(result?.totalPage) || 1
    if (!pageRecords.length || page >= totalPage) break
    page += 1
  } while (page <= 50)
  return records
}

function normalizeShopItems(list) {
  return (Array.isArray(list) ? list : [])
    .filter((item) => item && (item.status === undefined || Number(item.status) === 1))
    .map((item) => ({
      id: Number(item.id),
      type: Number(item.type),
      picture: item.picture || '',
      name: item.name || '',
      price: Number(item.price || 0),
      unit: item.unit || '',
      useType: item.useType || '',
      seq: item.seq == null ? Number.MAX_SAFE_INTEGER : Number(item.seq),
    }))
    .sort((left, right) => left.seq - right.seq || left.price - right.price)
}

async function loadDonationData() {
  try {
    const records = await getAllPages((data) => getDonateTargetList({ status: 1, ...data }, { silent: true }))
    goals.value = records
      .filter((goal) => goal.status === undefined || Number(goal.status) === 1)
      .map((goal) => ({
        ...goal,
        id: Number(goal.id),
        type: Number(goal.type),
        targetAmount: Number(goal.targetAmount || 0),
        completedAmount: Number(goal.completedAmount || 0),
      }))
  } catch {
    goals.value = []
  }
}

let shopItemsToken = 0

async function loadShopItems() {
  const targetId = selectedTarget.value?.id
  const itemType = mode.value === 'goods' ? 2 : 1
  const token = ++shopItemsToken
  if (!targetId) {
    shopItems.value = []
    shopItemsLoading.value = false
    return
  }
  shopItemsLoading.value = true
  try {
    const payload = await getDonateShopItems({
      donateTargetId: Number(targetId),
      type: itemType,
    }, { silent: true })
    if (token !== shopItemsToken) return
    const list = Array.isArray(payload) ? payload : payload?.list || payload?.records || []
    shopItems.value = normalizeShopItems(list)
  } catch {
    if (token !== shopItemsToken) return
    shopItems.value = []
  } finally {
    if (token === shopItemsToken) shopItemsLoading.value = false
  }
}

watch(mode, () => {
  dialogState.value = null
  itemIndex.value = 0
})
watch(() => [selectedTarget.value?.id, mode.value], loadShopItems, { immediate: true })
watch(goods, () => {
  if (itemIndex.value >= goods.value.length) itemIndex.value = 0
})
watch(customAmount, (value) => {
  if (value !== '') return
  const match = moneyOptions.value.find((item) => item.price === amount.value)
  if (match) selectedMoneyId.value = match.id
})
watch(moneyOptions, (options) => {
  const current = options.find((item) => item.id === selectedMoneyId.value)
  if (current) {
    amount.value = current.price
    return
  }
  selectedMoneyId.value = options[0]?.id ?? null
  if (options[0]) amount.value = options[0].price
}, { immediate: true })

async function setMode(type) {
  const numericType = type === 'goods' ? '2' : '1'
  // 目标优先级：与类型匹配的目标 > 当前地址栏目标 > 第一个目标，确保物品接口始终有 donateTargetId。
  const matchingTarget = goals.value.find((goal) => Number(goal.type) === Number(numericType))
    || goals.value.find((goal) => String(goal.id) === String(route.query.targetId))
    || goals.value[0]
  const query = { ...route.query, type: numericType }
  if (matchingTarget) query.targetId = String(matchingTarget.id)
  else delete query.targetId
  await router.replace({ query })
  // 切换类型后显式重拉物品：捐物 tab 必须发起 type=2 的物品请求，不依赖 watch 时序。
  loadShopItems()
}

function setTarget(id) {
  itemIndex.value = 0
  return router.replace({ query: { ...route.query, targetId: String(id) } })
}

// 提交前依次校验：自填金额是否合法、非匿名时是否填写姓名、表单其余字段是否通过。
function openConfirmation(details) {
  if (!selectedTarget.value || (mode.value === 'goods' && !selectedGood.value)) return
  if (mode.value === 'money' && invalidAmount.value) {
    dialogState.value = 'amount'
    return
  }
  if (!details.anonymous && !details.name) {
    dialogState.value = 'name'
    return
  }
  if (!donorForm.value.validate()) return
  order.value = {
    ...details,
    mode: mode.value,
    targetId: selectedTarget.value.id,
    targetTitle: selectedTarget.value.title,
    shopItemsId: mode.value === 'goods' ? selectedGood.value?.id : selectedMoneyItem.value?.id,
    itemName: selectedGood.value?.name,
    amount: total.value,
    itemIndex: itemIndex.value,
    quantity: quantity.value,
  }
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

onMounted(loadDonationData)
</script>
