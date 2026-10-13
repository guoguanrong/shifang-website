<template>
  <!-- 我的记录页：kind 决定展示供灯 / 捐赠 / 供奉哪一类，三者共用本视图，
       标题、说明、跳转文案统一按 accountPages.<kind> 这一前缀从语言包取。 -->
  <AccountPageShell :title="t(`${pageKey}.title`)" :eyebrow="t(`${pageKey}.eyebrow`)" :subtitle="t(`${pageKey}.subtitle`)">
    <!-- 顶部说明卡：栏目介绍 + 回到对应业务页的入口。 -->
    <section class="account-paper record-explanation">
      <OrnateSectionHeading :title="t(`${pageKey}.explanationTitle`)" />
      <p>{{ t(`${pageKey}.explanation`) }}</p>
      <!-- i18n-t 让「继续供奉」这类句子里的链接位置由译文决定；scope="global" 表示 keypath 从根命名空间解析。 -->
      <!-- 资金明细暂时下线，捐款记录不再提供跳转。 -->
      <i18n-t v-if="kind !== 'donations'" :keypath="`${pageKey}.continue`" tag="p" scope="global"><template #link><RouterLink :to="destination">{{ t(`${pageKey}.link`) }}</RouterLink></template></i18n-t>
    </section>

    <!-- 记录列表区：标题 id 供本区 aria-labelledby 引用。 -->
    <section class="record-list" :aria-labelledby="headingId">
      <header class="account-paper record-filter">
        <h2 :id="headingId">{{ t(`${pageKey}.details`) }}</h2>
        <div class="record-filter-row">
          <label :for="filterId">{{ t(`accountPages.records.${kind === 'donations' ? 'type' : 'status'}`) }}</label>
          <!-- 供灯、供奉按订单状态筛选；捐款按捐钱或捐物筛选。 -->
          <select :id="filterId" v-model="filter">
            <option v-for="option in filters" :key="option" :value="option">{{ t(`accountPages.records.${option}`) }}</option>
          </select>
          <span role="status">{{ t('accountPages.records.total', { count: shownCount }) }}</span>
        </div>
      </header>
      <p v-if="loading" class="record-example-notice" role="status">{{ t('accountPages.records.loading') }}</p>
      <AccountRecordCard v-for="record in visibleRecords" :key="record.id" :record="record" :kind="kind" @preview="preview = $event" />
      <div v-if="!loading && !visibleRecords.length" class="record-empty" role="status">
        <h3>{{ emptyTitle }}</h3>
        <p v-if="notice !== 'login'">{{ t('accountPages.records.emptyLive') }}</p>
        <RouterLink v-if="!notice && kind !== 'donations'" :to="destination">{{ t(`${pageKey}.link`) }} →</RouterLink>
      </div>
      <nav v-if="!loading && totalCount > 0" class="record-pager" :aria-label="t('accountPages.records.pagination')">
        <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ {{ t('accountPages.records.previous') }}</button>
        <span>{{ t('accountPages.records.pageInfo', { current: page, total: totalPages }) }}</span>
        <span>{{ t('accountPages.records.total', { count: totalCount }) }}</span>
        <button type="button" :disabled="page >= totalPages" @click="go(page + 1)">{{ t('accountPages.records.next') }} ›</button>
      </nav>
    </section>
    <AccountFeedbackDialog v-if="preview" :title="preview.titleText" :image="preview.video ? '' : preview.photo" :video="preview.video" :description="preview.wishText" @close="preview = null" />
  </AccountPageShell>
</template>

<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import AccountRecordCard from '@/components/account/AccountRecordCard.vue'
import AccountFeedbackDialog from '@/components/account/AccountFeedbackDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import { listSelfOrder } from '@/api/order'
import { ResultCode } from '@/api/http'
import lampAvatar from '@/assets/account-pages/lamp-avatar.webp'
import donationAvatar from '@/assets/account-pages/donation-avatar.webp'
import doumuAvatar from '@/assets/account-pages/doumu-avatar.webp'

// kind 决定整页数据：lamps 供灯、donations 捐赠、deities 供奉。
const props = defineProps({ kind: { type: String, required: true, validator: value => ['lamps', 'donations', 'deities'].includes(value) } })
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const headingId = `record-heading-${useId()}`
const filterId = `record-filter-${useId()}`
const pageKey = computed(() => `accountPages.${props.kind}`)
const destination = computed(() => ({ lamps: '/blessings/lamps', donations: '/cloud-build/fund-details', deities: '/deities' })[props.kind])
const filters = computed(() => props.kind === 'donations' ? ['all', 'money', 'goods'] : ['all', 'unpaid', 'pending', 'active', 'expired'])
const filter = ref('all')
const loading = ref(false)
const orders = ref([])
const totalCount = ref(0)
const totalPages = ref(1)
const notice = ref('')
const preview = ref(null)
const pageSize = 10
const orderType = { lamps: 1, deities: 2, donations: 3 }
const statusByFilter = { unpaid: 1, pending: 2, active: 3, expired: 4 }
const statusKey = { 1: 'unpaid', 2: 'pending', 3: 'active', 4: 'expired' }
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const visibleRecords = computed(() => {
  const records = orders.value.map(mapOrder)
  if (props.kind !== 'donations' || filter.value === 'all') return records
  const donateType = filter.value === 'goods' ? 2 : 1
  return records.filter(record => record.donateType === donateType)
})
const shownCount = computed(() => props.kind === 'donations' && filter.value !== 'all' ? visibleRecords.value.length : totalCount.value)
const emptyTitle = computed(() => {
  if (notice.value === 'login') return t('accountPages.records.loginRequired')
  if (notice.value === 'failed') return t('accountPages.records.loadFailed')
  return t('accountPages.records.empty')
})

function text(value) {
  return value == null ? '' : String(value).trim()
}

function stamp(value) {
  const raw = text(value)
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(raw) ? raw.replace(' ', 'T') : raw
}

function mediaOf(url, preferVideo) {
  const value = text(url)
  if (!value) return {}
  const image = /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(value)
  const video = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(value)
  if (video || (preferVideo && !image)) return { video: value }
  return { photo: value }
}

function mapOrder(order) {
  const type = orderType[props.kind]
  const wishText = text(order.prayWish)
  const devoteeText = text(order.username)
  const birth = text(order.birthday)
  const amount = Number(order.amount)
  const base = {
    id: text(order.orderNo) || text(order.id),
    status: statusKey[Number(order.status)] || 'pending',
    date: stamp(order.createTime),
    amount: Number.isFinite(amount) ? amount : '',
    devoteeText,
    wishText,
    birth,
    email: text(order.email),
    donateType: Number(order.donateType),
  }
  if (type === 2) {
    const god = text(order.worship?.matchGod) || t('accountPages.history.worshipFallback')
    const cycle = Number(order.cycleType)
    const file = mediaOf(order.fileUrl, false)
    return {
      ...base,
      titleText: god,
      subtitleText: wishText,
      avatar: text(order.worship?.picture) || doumuAvatar,
      photo: file.photo || text(order.worship?.picture),
      planText: cycle === 1 ? t('accountPages.records.yearly') : cycle === 2 ? t('accountPages.records.monthly') : '',
      mediaLabel: t('accountPages.records.photoLabel'),
    }
  }
  if (type === 3) {
    const titleText = text(order.donateTarget?.title) || text(order.shopItems?.name) || t('accountPages.history.donateFallback')
    const goods = Number(order.donateType) === 2
    const count = Number(order.number)
    return {
      ...base,
      titleText,
      subtitleText: goods && count > 0 ? `${t('accountPages.records.goods')} · ${count}` : t(goods ? 'accountPages.records.goods' : 'accountPages.records.money'),
      avatar: text(order.donateTarget?.picture) || text(order.shopItems?.picture) || donationAvatar,
    }
  }
  const name = text(order.light?.name) || t('accountPages.history.lampFallback')
  const god = text(order.light?.matchGod)
  const file = mediaOf(order.fileUrl, true)
  return {
    ...base,
    titleText: god ? `${name} · ${god}` : name,
    subtitleText: wishText,
    avatar: text(order.light?.picture) || lampAvatar,
    photo: file.photo || (!file.video ? text(order.light?.picture) : ''),
    video: file.video,
    mediaLabel: file.video ? t('accountPages.records.videoLabel') : t('accountPages.records.photoLabel'),
  }
}

function readPage(result, list) {
  const totalRow = Number(result?.totalRow ?? result?.total ?? result?.totalCount)
  const pageCount = Number(result?.totalPage ?? result?.pages ?? result?.pageCount)
  const total = Number.isFinite(totalRow) && totalRow >= 0 ? totalRow : list.length
  const pages = Number.isFinite(pageCount) && pageCount > 0 ? pageCount : Math.max(1, Math.ceil(total / pageSize))
  return { total, pages }
}

async function loadRecords() {
  loading.value = true
  notice.value = ''
  preview.value = null
  try {
    const data = { type: orderType[props.kind], page: page.value, pageSize }
    const status = statusByFilter[filter.value]
    if (status) data.status = status
    const result = await listSelfOrder(data, { silent: true })
    const list = Array.isArray(result) ? result : result?.list || result?.records || result?.rows
    orders.value = Array.isArray(list) ? list : []
    const counted = readPage(result, orders.value)
    totalCount.value = counted.total
    totalPages.value = counted.pages
  } catch (error) {
    orders.value = []
    totalCount.value = 0
    totalPages.value = 1
    notice.value = error?.code === ResultCode.NOT_LOGIN || error?.code === ResultCode.NOT_LOGIN_USER ? 'login' : 'failed'
  } finally {
    loading.value = false
  }
}

function go(next) {
  if (next < 1 || next > totalPages.value || next === page.value) return
  router.push({ name: route.name, query: next === 1 ? {} : { page: String(next) } })
}

watch(() => props.kind, () => {
  preview.value = null
  if (filter.value !== 'all') filter.value = 'all'
})
watch(filter, () => {
  if (page.value !== 1) router.push({ name: route.name, query: {} })
})
watch([() => props.kind, page, filter], loadRecords, { immediate: true })
</script>
