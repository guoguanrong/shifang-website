<template>
  <AccountPageShell :title="t(`${pageKey}.title`)" :eyebrow="t(`${pageKey}.eyebrow`)" :subtitle="t(`${pageKey}.subtitle`)">
    <section class="history-list" :aria-labelledby="headingId">
      <header class="account-paper history-list-heading">
        <h2 :id="headingId">{{ t(`${pageKey}.heading`) }}</h2>
      </header>

      <template v-if="kind === 'orders'">
        <p v-if="loading" class="history-example-notice" role="status">{{ t('accountPages.history.loading') }}</p>
        <AccountHistoryCard v-for="record in orderRecords" :key="record.id" :record="record" kind="orders" />
        <EmptyData v-if="!loading && !orderRecords.length" :label="emptyLabel" />
        <nav v-if="!loading && totalCount > 0" class="history-pager" :aria-label="t('accountPages.history.pagination')">
          <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ {{ t('accountPages.history.previous') }}</button>
          <span>{{ t('accountPages.history.pageInfo', { current: page, total: totalPages }) }}</span>
          <span>{{ t('accountPages.history.total', { count: totalCount }) }}</span>
          <button type="button" :disabled="page >= totalPages" @click="go(page + 1)">{{ t('accountPages.history.next') }} ›</button>
        </nav>
      </template>
      <template v-else>
        <p v-if="loading" class="history-example-notice" role="status">{{ t('accountPages.history.loading') }}</p>
        <AccountHistoryCard v-for="record in eventRecords" :key="record.id" :record="record" kind="events" />
        <EmptyData v-if="!loading && !eventRecords.length" :label="emptyLabel" />
        <nav v-if="!loading && totalCount > 0" class="history-pager" :aria-label="t('accountPages.history.pagination')">
          <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ {{ t('accountPages.history.previous') }}</button>
          <span>{{ t('accountPages.history.pageInfo', { current: page, total: totalPages }) }}</span>
          <span>{{ t('accountPages.history.total', { count: totalCount }) }}</span>
          <button type="button" :disabled="page >= totalPages" @click="go(page + 1)">{{ t('accountPages.history.next') }} ›</button>
        </nav>
      </template>
    </section>
  </AccountPageShell>
</template>

<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import AccountHistoryCard from '@/components/account/AccountHistoryCard.vue'
import EmptyData from '@/components/common/EmptyData.vue'
import { listSelfOrder } from '@/api/order'
import { listSelfActivity } from '@/api/activityRegister'
import { ResultCode } from '@/api/http'
import { formatSchedule, splitList } from '@/utils/activityDisplay'
import orderAvatar from '@/assets/account-pages/order-avatar.webp'
import eventAvatar from '@/assets/account-pages/event-avatar.webp'
import '@/styles/account-history.css'

const props = defineProps({ kind: { type: String, required: true, validator: value => ['orders', 'events'].includes(value) } })
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const headingId = useId()
const loading = ref(false)
const orders = ref([])
const registrations = ref([])
const totalCount = ref(0)
const totalPages = ref(1)
const notice = ref('')
const pageSize = 10
const pageKey = computed(() => `accountPages.history.${props.kind}Page`)
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const orderRecords = computed(() => orders.value.map(mapOrder))
const eventRecords = computed(() => registrations.value.map(mapRegistration))
const emptyLabel = computed(() => {
  const scope = props.kind === 'orders' ? 'orders' : 'events'
  if (notice.value === 'login') return t(`accountPages.history.${scope}Login`)
  if (notice.value === 'failed') return t(`accountPages.history.${scope}Failed`)
  return t(`accountPages.history.${scope}Empty`)
})

const statusKeys = { 1: 'orderStatus.pending', 2: 'orderStatus.waiting', 3: 'orderStatus.offering', 4: 'orderStatus.expired' }

function text(value) {
  return value == null ? '' : String(value).trim()
}

function money(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return ''
  const digits = Number.isInteger(value) ? 0 : 2
  return new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: 2 }).format(value)
}

function stamp(value) {
  const raw = text(value)
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(raw) ? raw.replace(' ', 'T') : raw
}

function mapOrder(order) {
  const type = Number(order.type)
  const amount = money(order.amount)
  let titleText = ''
  let avatar = ''
  let costs = []
  if (type === 2) {
    const cycle = Number(order.cycleType) === 1 ? t('accountPages.history.cycleYear') : Number(order.cycleType) === 2 ? t('accountPages.history.cycleMonth') : ''
    const god = text(order.worship?.matchGod) || t('accountPages.history.worshipFallback')
    titleText = cycle ? `${god} · ${cycle}` : god
    avatar = text(order.worship?.picture)
    costs = [
      { label: t('accountPages.history.cycle'), value: cycle || '—' },
      { label: t('accountPages.history.offeringAmount'), value: amount || money(Number(order.cycleType) === 1 ? order.worship?.yearPrice : order.worship?.monthPrice) },
    ]
  } else if (type === 3) {
    titleText = text(order.donateTarget?.title) || text(order.shopItems?.name) || t('accountPages.history.donateFallback')
    avatar = text(order.donateTarget?.picture) || text(order.shopItems?.picture)
    const goods = Number(order.donateType) === 2
    const donate = goods ? t('accountPages.history.donateGoods') : t('accountPages.history.donateMoney')
    const count = Number(order.number)
    costs = [
      { label: t('accountPages.history.donation'), value: goods && count > 0 ? `${donate} · ${count}` : donate },
      { label: t('accountPages.history.donationAmount'), value: amount },
    ]
  } else {
    const name = text(order.light?.name) || t('accountPages.history.lampFallback')
    const god = text(order.light?.matchGod)
    titleText = god ? `${name} · ${god}` : name
    avatar = text(order.light?.picture)
    costs = [
      { label: t('accountPages.history.lighting'), value: t('accountPages.history.free'), free: true },
      { label: t('accountPages.history.materials'), value: amount || money(order.light?.price) },
    ]
  }
  return {
    id: text(order.orderNo) || text(order.id),
    avatar: avatar || orderAvatar,
    titleText,
    status: statusKeys[Number(order.status)] || 'paid',
    date: stamp(order.createTime),
    costs,
  }
}

function maskMobile(value) {
  const mobile = text(value).replace(/\s/g, '')
  if (mobile.length < 7) return mobile
  return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`
}

function mapRegistration(item) {
  const activity = item.activity || {}
  const pictures = splitList(activity.pictureUrls)
  const reserved = Number(activity.activityType) === 2
  const schedule = formatSchedule(activity, {
    monthly: t('events.detail.monthly', { day: '{day}' }),
    daily: t('events.detail.daily'),
  })
  return {
    id: text(item.cert) || text(item.id),
    avatar: pictures[0] || eventAvatar,
    titleText: text(activity.title) || text(activity.subTitle),
    status: reserved ? 'reserved' : 'registered',
    type: reserved ? 'private' : 'public',
    timeText: schedule,
    date: stamp(item.createTime),
    locationText: text(activity.location),
    devoteeText: text(item.username),
    phone: maskMobile(item.mobile),
    wishText: text(item.prayWish),
  }
}

function readPage(result, list) {
  const totalRow = Number(result?.totalRow ?? result?.total ?? result?.totalCount)
  const pageCount = Number(result?.totalPage ?? result?.pages ?? result?.pageCount)
  const total = Number.isFinite(totalRow) && totalRow >= 0 ? totalRow : list.length
  const pages = Number.isFinite(pageCount) && pageCount > 0 ? pageCount : Math.max(1, Math.ceil(total / pageSize))
  return { total, pages }
}

async function loadList(request, target) {
  loading.value = true
  notice.value = ''
  try {
    const result = await request({ page: page.value, pageSize }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list || result?.records || result?.rows
    const rows = Array.isArray(list) ? list : []
    const counted = readPage(result, rows)
    target.value = rows
    totalCount.value = counted.total
    totalPages.value = counted.pages
  } catch (error) {
    target.value = []
    totalCount.value = 0
    totalPages.value = 1
    notice.value = error?.code === ResultCode.NOT_LOGIN || error?.code === ResultCode.NOT_LOGIN_USER ? 'login' : 'failed'
  } finally {
    loading.value = false
  }
}

function loadOrders() {
  return loadList(listSelfOrder, orders)
}

function loadEvents() {
  return loadList(listSelfActivity, registrations)
}

function go(next) {
  if (next < 1 || next > totalPages.value || next === page.value) return
  router.push({ name: route.name, query: next === 1 ? {} : { page: String(next) } })
}

watch(() => [props.kind, page.value], () => {
  if (props.kind === 'orders') loadOrders()
  else loadEvents()
}, { immediate: true })
</script>
