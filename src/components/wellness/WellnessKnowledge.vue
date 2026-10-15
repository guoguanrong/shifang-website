<template>
  <section class="knowledge-section">
    <WellnessSectionHeading
      :eyebrow="t('wellness.knowledge.eyebrow')"
      :title="t('wellness.knowledge.title')"
      :subtitle="t('wellness.knowledge.subtitle')"
    />

    <div v-if="items.length" class="knowledge-grid">
      <article
        v-for="(item, index) in items"
        :key="item.id || `${item.title}-${index}`"
        role="button"
        tabindex="0"
        @click="goDetail(item)"
        @keydown.enter="goDetail(item)"
        @keydown.space.prevent="goDetail(item)"
      >
        <!-- 卡片下半部采用设计稿的半透明白色渐变，确保文字在照片上清晰可读。 -->
        <img :src="item.cover || articleImages[index % articleImages.length]" alt="" />
        <div class="knowledge-copy">
          <h3>{{ item.title }}</h3>
          <p>{{ item.intro }}</p>
          <small>{{ formatReadCount(item.readNum) }} {{ t('wellness.knowledge.reads') }}</small>
        </div>
      </article>
    </div>
    <p v-if="isLoading" class="knowledge-message">{{ t('wellness.knowledge.loading') }}</p>
    <div v-else-if="loadError" class="knowledge-message">
      <span>{{ t('wellness.knowledge.loadError') }}</span>
      <button type="button" @click="retryLoad">{{ t('wellness.knowledge.retry') }}</button>
    </div>
    <p v-else-if="!items.length" class="knowledge-message">{{ t('wellness.knowledge.empty') }}</p>
    <button v-if="hasMore" class="more-button" type="button" :disabled="isLoading" @click="loadMore">
      {{ isLoading ? t('wellness.knowledge.loadingMore') : t('wellness.knowledge.more') }}<span aria-hidden="true">›</span>
    </button>
    <WellnessQuote class="closing-quote" closing :quote="t('wellness.closing.quote')" :source="t('wellness.closing.quoteSource')" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getDaodianList } from '@/api/daodian'
import massage from '@/assets/wellness/article-massage.webp'
import meditation from '@/assets/wellness/article-meditation.webp'
import neijing from '@/assets/wellness/article-neijing.webp'
import qianjin from '@/assets/wellness/article-qianjin.webp'
import sleep from '@/assets/wellness/article-sleep.webp'
import tea from '@/assets/wellness/article-tea.webp'
import WellnessQuote from './WellnessQuote.vue'
import WellnessSectionHeading from './WellnessSectionHeading.vue'

const PAGE_SIZE = 6
const { t } = useI18n()
const router = useRouter()
const items = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const loadError = ref(false)
const failedPage = ref(1)
const failedAppend = ref(false)
const hasMore = computed(() => currentPage.value < totalPages.value)
const articleImages = [neijing, qianjin, sleep, massage, tea, meditation]

function getPage(payload) {
  const page = payload?.data && !payload.list && !payload.records ? payload.data : payload
  const rows = Array.isArray(page) ? page : page?.list || page?.records || []
  return { page, rows }
}

function isShown(value) {
  return value === undefined || value === null
    || value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true'
}

async function loadPage(pageNumber, append = false) {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = false
  failedPage.value = pageNumber
  failedAppend.value = append
  try {
    const result = await getDaodianList({ page: pageNumber, pageSize: PAGE_SIZE, show: true })
    const { page, rows } = getPage(result)
    const visibleRows = rows.filter((item) => isShown(item.show))
    items.value = append ? [...items.value, ...visibleRows] : visibleRows
    currentPage.value = pageNumber
    const pageCount = Number(page?.totalPage ?? page?.totalPages)
    const totalRows = Number(page?.totalRow ?? page?.total ?? 0)
    totalPages.value = pageCount > 0
      ? pageCount
      : totalRows > 0
        ? Math.ceil(totalRows / PAGE_SIZE)
        : visibleRows.length === PAGE_SIZE ? pageNumber + 1 : pageNumber
  } catch {
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

function loadMore() {
  if (hasMore.value) loadPage(currentPage.value + 1, true)
}

function retryLoad() {
  loadPage(failedPage.value, failedAppend.value)
}

function formatReadCount(value) {
  return Number(value || 0).toLocaleString()
}

// 点击卡片：跳转到道典精读详情页（由详情页加载文章内容）。
function goDetail(item) {
  router.push({
    name: 'wellness-knowledge-detail',
    query: item?.id != null ? { id: String(item.id) } : {},
  })
}

onMounted(() => loadPage(1))
</script>

<style scoped>
.knowledge-section { min-height: 1051px; height: auto; padding-bottom: 34px; background: #f8f5ed; }
.knowledge-grid { display: grid; grid-template-columns: repeat(3, 446.67px); gap: 30px 50px; width: 1440px; margin: 37px auto 0; }
.knowledge-grid article { position: relative; height: 280px; overflow: hidden; background: #fff; border-radius: 12px; cursor: pointer; transition: box-shadow .25s ease, transform .25s ease; }
.knowledge-grid article:focus-visible { outline: 3px solid #cc3513; outline-offset: 3px; }
.knowledge-grid article > img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.knowledge-grid article:nth-child(3) > img { object-position: center 26%; }.knowledge-grid article:nth-child(4) > img { object-position: center 44%; }.knowledge-grid article:nth-child(6) > img { object-position: center 24%; }
.knowledge-copy { position: absolute; right: 0; bottom: 0; left: 0; height: 132px; padding: 28px 20px 8px; color: #333; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.7) 30%, #fff 70%); backdrop-filter: blur(3px); }
.knowledge-copy h3 { margin: 0 0 5px; font-family: var(--font-calligraphy); font-size: 18px; font-weight: 400; line-height: 20px; letter-spacing: 1.8px; }
.knowledge-copy p { height: 40px; margin: 0; font-size: 12px; line-height: 20px; letter-spacing: 1.2px; }
.knowledge-copy small { display: block; margin-top: 7px; color: #9e9e9e; font-size: 10px; line-height: 20px; letter-spacing: 1px; white-space: pre-wrap; }
.more-button { display: flex; align-items: center; justify-content: center; gap: 3px; min-width: 140px; height: 36px; padding: 0 12px 0 23px; margin: 30px auto 0; color: #fff; font-family: var(--font-calligraphy); font-size: 16px; letter-spacing: 1.6px; background: #cc3513; border: 0; border-radius: 100px; box-shadow: inset 0 0 0 2px #cc3513, inset 0 0 0 2.5px #f2d2af; cursor: pointer; transition: filter .2s ease, transform .2s ease; }
.more-button span { font-family: Arial, sans-serif; font-size: 27px; line-height: 1; }
.more-button:disabled { cursor: wait; opacity: .7; }
.knowledge-message { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 30px auto; color: #62584e; font-size: 14px; text-align: center; }
.knowledge-message button { padding: 0; color: #a33219; background: none; border: 0; cursor: pointer; text-decoration: underline; }
.closing-quote { margin: 34px auto 0; }
@media (hover: hover) and (pointer: fine) { .knowledge-grid article:hover { box-shadow: 0 16px 35px rgba(35,57,70,.15); transform: translateY(-6px); }.knowledge-grid article:hover > img { transform: scale(1.045); }.more-button:hover { filter: brightness(1.08); transform: translateY(-2px); } }

@media (max-width: 1439px) { .knowledge-section { height: auto; padding-bottom: 60px; }.knowledge-grid { grid-template-columns: repeat(2, minmax(0, 380px)); justify-content: center; width: calc(100% - 40px); } }
@media (max-width: 820px) { .knowledge-grid { grid-template-columns: minmax(0, 380px); margin-top: 38px; }.closing-quote { margin-top: 42px; } }
@media (max-width: 430px) { .knowledge-grid { width: calc(100% - 28px); grid-template-columns: 1fr; }.knowledge-copy { padding-inline: 17px; }.knowledge-copy p { font-size: 11px; line-height: 18px; }.knowledge-copy small { margin-top: 7px; }.knowledge-detail { padding: 24px 18px; }.knowledge-detail h2 { font-size: 20px; } }

:global(html[data-locale-layout='international'] .knowledge-section h3),
:global(html[data-locale-layout='international'] .knowledge-section p),
:global(html[data-locale-layout='international'] .knowledge-section small),
:global(html[data-locale-layout='international'] .knowledge-section button) { font-family: Georgia, serif; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .knowledge-section .knowledge-copy h3) { font-size: 16px; }
:global(html[data-locale-layout='international'] .knowledge-section .knowledge-copy p) { font-size: 11px; line-height: 17px; }
</style>
