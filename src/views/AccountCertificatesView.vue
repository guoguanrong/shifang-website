<template>
  <AccountPageShell class="account-details-page" :title="t('accountDetails.certificates.title')"
    :eyebrow="t('accountDetails.certificates.eyebrow')" :subtitle="t('accountDetails.certificates.subtitle')" account-trail>
    <section class="certificate-panel" aria-labelledby="certificate-heading">
      <h2 id="certificate-heading">{{ t('accountDetails.certificates.heading') }}</h2>
      <p>{{ t('accountDetails.certificates.description') }}</p>
      <p v-if="loading" class="certificate-example-note" role="status">{{ t('accountDetails.certificates.loading') }}</p>
      <div v-else-if="certificates.length" class="certificate-grid">
        <figure v-for="certificate in certificates" :key="certificate.id">
          <button class="certificate-sheet" type="button" :aria-label="t('accountDetails.certificates.imageAlt', { name: certificate.name, merit: certificate.merit })" @click="download(certificate)">
            <img :src="template" alt="" width="680" height="980" />
            <span class="certificate-name">{{ certificate.name }}</span>
            <span class="certificate-merit">{{ certificate.merit }}</span>
            <span class="certificate-amount">{{ certificate.amount }}</span>
            <span class="certificate-date">{{ certificate.issued }}</span>
          </button>
          <figcaption>
            <button type="button" @click="download(certificate)">{{ t('accountDetails.certificates.download') }}</button>
          </figcaption>
        </figure>
      </div>
      <EmptyData v-else :label="emptyLabel" />
      <nav v-if="!loading && totalCount > 0" class="certificate-pager" :aria-label="t('accountDetails.certificates.pagination')">
        <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ {{ t('accountDetails.certificates.previous') }}</button>
        <span>{{ t('accountDetails.certificates.pageInfo', { current: page, total: totalPages }) }}</span>
        <span>{{ t('accountDetails.certificates.total', { count: totalCount }) }}</span>
        <button type="button" :disabled="page >= totalPages" @click="go(page + 1)">{{ t('accountDetails.certificates.next') }} ›</button>
      </nav>
    </section>
  </AccountPageShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import EmptyData from '@/components/common/EmptyData.vue'
import { listSelfOrder } from '@/api/order'
import { ResultCode } from '@/api/http'
import template from '@/assets/account-details/certificate-template.webp'
import '@/styles/account-details.css'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const orders = ref([])
const totalCount = ref(0)
const totalPages = ref(1)
const notice = ref('')
const pageSize = 4
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const certificates = computed(() => orders.value.map(mapCertificate))
const emptyLabel = computed(() => {
  if (notice.value === 'login') return t('accountDetails.certificates.loginRequired')
  if (notice.value === 'failed') return t('accountDetails.certificates.loadFailed')
  return t('accountDetails.certificates.empty')
})

function text(value) {
  return value == null ? '' : String(value).trim()
}

function money(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return ''
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`
}

function issuedDate(value) {
  const raw = text(value)
  const matched = raw.match(/\d{4}-\d{2}-\d{2}/)
  return matched ? matched[0] : raw
}

function mapCertificate(order) {
  const goods = Number(order.donateType) === 2
  const title = text(order.donateTarget?.title) || text(order.shopItems?.name)
    || t(goods ? 'accountPages.records.goods' : 'accountPages.records.money')
  const name = text(order.username) || '—'
  const orderNo = text(order.orderNo) || text(order.id)
  return {
    id: orderNo || text(order.id),
    name,
    merit: title,
    amount: money(order.amount),
    issued: t('accountDetails.certificates.issued', { date: issuedDate(order.createTime) || '—' }),
    filename: t('accountDetails.certificates.filename', { orderNo: orderNo || 'certificate' }),
  }
}

function readPage(result, list) {
  const totalRow = Number(result?.totalRow ?? result?.total ?? result?.totalCount)
  const pageCount = Number(result?.totalPage ?? result?.pages ?? result?.pageCount)
  const total = Number.isFinite(totalRow) && totalRow >= 0 ? totalRow : list.length
  const pages = Number.isFinite(pageCount) && pageCount > 0 ? pageCount : Math.max(1, Math.ceil(total / pageSize))
  return { total, pages }
}

async function loadCertificates() {
  loading.value = true
  notice.value = ''
  try {
    const result = await listSelfOrder({ type: 3, page: page.value, pageSize }, { silent: true })
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

let templateImage = null

function loadTemplate() {
  if (templateImage) return Promise.resolve(templateImage)
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      templateImage = image
      resolve(image)
    }
    image.onerror = () => reject(new Error('template'))
    image.src = template
  })
}

function paintLine(ctx, value, x, y, maxWidth, size, weight = 500) {
  let fontSize = size
  do {
    ctx.font = `${weight} ${fontSize}px Huiwen-mincho, STKaiti, KaiTi, serif`
    fontSize -= 2
  } while (fontSize > 18 && ctx.measureText(value).width > maxWidth)
  ctx.fillText(value, x, y)
}

async function download(certificate) {
  const image = await loadTemplate()
  await document.fonts.load('500 32px Huiwen-mincho')
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#4a3728'
  const width = canvas.width
  paintLine(ctx, certificate.name, width / 2, canvas.height * 0.45, width * 0.62, Math.round(width * 0.036))
  paintLine(ctx, certificate.merit, width / 2, canvas.height * 0.628, width * 0.5, Math.round(width * 0.038))
  paintLine(ctx, certificate.amount, width / 2, canvas.height * 0.672, width * 0.5, Math.round(width * 0.04))
  ctx.fillStyle = '#6b5a48'
  paintLine(ctx, certificate.issued, width / 2, canvas.height * 0.802, width * 0.7, Math.round(width * 0.028), 400)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = certificate.filename
  anchor.click()
  URL.revokeObjectURL(url)
}

watch(page, loadCertificates, { immediate: true })
</script>
