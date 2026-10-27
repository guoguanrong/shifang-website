<template>
  <CommunityPageShell
    :breadcrumb="text('breadcrumb')"
    :eyebrow="text('eyebrow')"
    :title="text('title')"
    :subtitle="text('subtitle')"
  >
    <div class="news-list" :aria-busy="loading">
      <RouterLink
        v-for="item in displayedNews"
        :key="item.id"
        :to="detailRoute(item)"
        class="news-card"
        :aria-label="openLabel(item)"
      >
        <img class="news-card__image" :src="item.cover" :alt="item.title" />
        <span class="news-card__shade" aria-hidden="true"></span>
        <span class="news-card__content">
          <strong>{{ item.title }}</strong>
          <span>{{ item.desc }}</span>
        </span>
      </RouterLink>
      <p v-if="loading && !displayedNews.length" class="news-state" role="status">
        {{ text('loading') }}
      </p>
      <p v-else-if="!loading && !displayedNews.length" class="news-state" role="status">
        {{ emptyText }}
      </p>
    </div>

    <nav
      v-if="!loadFailed && totalPages > 1"
      class="news-pagination"
      :aria-label="text('pagination')"
    >
      <button type="button" :disabled="loading || currentPage <= 1" @click="changePage(currentPage - 1)">
        <span aria-hidden="true">‹</span>{{ text('previous') }}
      </button>
      <span class="news-pagination__info">
        {{ text('pageInfo', { current: currentPage, total: totalPages, count: totalRows }) }}
      </span>
      <button type="button" :disabled="loading || currentPage >= totalPages" @click="changePage(currentPage + 1)">
        {{ text('next') }}<span aria-hidden="true">›</span>
      </button>
    </nav>
  </CommunityPageShell>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import { getDynamicList } from '@/api/dynamic'
import { getMemoirList } from '@/api/memoir'
import { getWishesList } from '@/api/wishes'
import CommunityPageShell from '@/components/community/CommunityPageShell.vue'
import activityUpdate1 from '@/assets/home/activity/card-update-1.png'
import activityUpdate2 from '@/assets/home/activity/card-update-2.png'
import activityStory1 from '@/assets/home/activity/card-story-1.png'
import activityStory2 from '@/assets/home/activity/card-story-2.png'
import activityMessage1 from '@/assets/home/activity/card-message-1.png'
import activityMessage2 from '@/assets/home/activity/card-message-2.png'
import neutralNews1 from '@/assets/images/news-1.webp'
import neutralNews2 from '@/assets/images/news-2.webp'
import neutralNews3 from '@/assets/images/news-3.webp'
import neutralPortrait1 from '@/assets/images/msg-card-1.webp'
import neutralPortrait2 from '@/assets/images/msg-card-2.webp'
import neutralPortrait3 from '@/assets/images/msg-card-3.webp'

const { t, te, locale } = useI18n()
const route = useRoute()
const PAGE_SIZE = 9
// 卡片兜底图与上级页面（首页分类卡片）保持同一套，按语言与分类取图。
const fallbackImages = computed(() => locale.value === 'zh-CN'
  ? {
    news: [activityUpdate1, activityUpdate2],
    testimonials: [activityStory1, activityStory2],
    messages: [activityMessage1, activityMessage2],
  }
  : {
    news: [neutralNews1, neutralNews2, neutralNews3],
    testimonials: [neutralPortrait1, neutralPortrait2, neutralPortrait3],
    messages: [neutralPortrait1, neutralPortrait2, neutralPortrait3],
  })
// 首页三个分类共用本列表页：?kind=testimonials|messages 调用对应接口，默认「最新动态」。
const LIST_LOADERS = { news: getDynamicList, testimonials: getMemoirList, messages: getWishesList }
const currentPage = ref(1)
const totalPages = ref(1)
const totalRows = ref(0)
const records = ref([])
const loading = ref(true)
const loadFailed = ref(false)

const kind = computed(() => {
  const value = route.query.kind
  return value === 'testimonials' || value === 'messages' ? value : 'news'
})

// 页面文案优先取当前分类命名空间，缺失的键回退到「最新动态」，避免重复维护三份。
function text(name, params) {
  const scoped = `portal.pages.${kind.value}.${name}`
  if (te(scoped)) return t(scoped, params)
  const fallback = `portal.pages.news.${name}`
  return te(fallback) ? t(fallback, params) : ''
}

const emptyText = computed(() => {
  const scoped = `portal.pages.${kind.value}.empty`
  return te(scoped) ? t(scoped) : t('news.empty')
})

function detailRoute(item) {
  const query = { id: String(item.id) }
  if (kind.value !== 'news') query.kind = kind.value
  return { name: 'news-detail', query }
}

function openLabel(item) {
  return kind.value === 'messages'
    ? t('portal.pages.messages.openArticle', { name: item.title })
    : text('openDetail', { title: item.title })
}

function parseNewsImages(value) {
  let imageList = []

  if (Array.isArray(value)) {
    imageList = value
  } else if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      imageList = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      imageList = [value]
    }
  }

  return imageList.map((image) => typeof image === 'string' ? image : image?.url).filter(Boolean)
}

let newsRequestId = 0

// 后端未给封面时，按分类轮播使用与首页一致的兜底图。
function pickFallbackImage(listKind, index) {
  const images = fallbackImages.value[listKind] || fallbackImages.value.news
  return images[index % images.length]
}

async function loadNews() {
  const requestedKind = kind.value
  const requestId = ++newsRequestId
  loading.value = true

  try {
    const result = await LIST_LOADERS[requestedKind](
      { page: currentPage.value, pageSize: PAGE_SIZE, show: true },
      { silent: true },
    )
    // 快速切换分类时丢弃已过期的响应，避免旧分类的数据覆盖新列表。
    if (requestId !== newsRequestId) return

    const list = Array.isArray(result) ? result : result?.list
    if (!Array.isArray(list)) throw new Error('Invalid list response')

    records.value = list
      .slice(0, PAGE_SIZE)
      .filter((item) => item?.id !== null && item?.id !== undefined)
      .map((item, index) => ({
        id: item.id,
        title: item.title || item.username || '',
        desc: item.content || item.detail || '',
        cover: parseNewsImages(requestedKind === 'messages' ? item.imgArrUrls : item.cover)[0]
          || pickFallbackImage(requestedKind, index),
      }))

    const total = Number(result?.totalRow ?? result?.total ?? list.length)
    const pageCount = Number(result?.totalPage ?? result?.pages)
    totalRows.value = Number.isFinite(total) ? total : list.length
    totalPages.value = Number.isFinite(pageCount) && pageCount > 0
      ? pageCount
      : Math.max(1, Math.ceil(totalRows.value / PAGE_SIZE))

    const responsePage = Number(result?.currentPage)
    if (Number.isFinite(responsePage) && responsePage > 0) currentPage.value = responsePage
    loadFailed.value = false
  } catch {
    if (requestId !== newsRequestId) return
    records.value = []
    totalRows.value = 0
    totalPages.value = 1
    loadFailed.value = true
  } finally {
    if (requestId === newsRequestId) loading.value = false
  }
}

function changePage(page) {
  if (loading.value || page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadNews()
}

const displayedNews = computed(() => records.value)

// 分类（?kind=）变化时回到第一页并重新拉取对应接口。
watch(kind, () => {
  currentPage.value = 1
  records.value = []
  loadNews()
})

onMounted(loadNews)
</script>

<style scoped>
.news-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px 50px;
}

.news-card {
  position: relative;
  display: block;
  aspect-ratio: 19 / 14;
  min-width: 0;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  background: #6d4b30;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgb(61 44 25 / 10%);
  isolation: isolate;
  transition: transform .28s ease, box-shadow .28s ease;
}

.news-card:focus-visible {
  outline: 2px solid #bd694d;
  outline-offset: 3px;
}

@media (hover: hover) and (pointer: fine) {
  .news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 32px rgb(61 44 25 / 18%);
  }

  .news-card:hover .news-card__image {
    transform: scale(1.04);
  }
}

.news-card__image,
.news-card__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.news-card__image {
  object-fit: cover;
  transition: transform .45s ease;
}

.news-card__shade {
  z-index: 1;
  background: linear-gradient(180deg, rgb(0 0 0 / 0%) 38%, rgb(0 0 0 / 28%) 60%, rgb(0 0 0 / 88%) 100%);
}

.news-card__content {
  position: absolute;
  z-index: 2;
  right: 20px;
  bottom: 18px;
  left: 20px;
  display: grid;
  gap: 7px;
}

.news-card__content strong {
  display: -webkit-box;
  overflow: hidden;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 1.4px;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.news-card__content > span {
  display: -webkit-box;
  overflow: hidden;
  color: rgb(255 255 255 / 94%);
  font-family: var(--font-calligraphy);
  font-size: 12px;
  line-height: 1.65;
  letter-spacing: .6px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.news-state {
  grid-column: 1 / -1;
  display: grid;
  min-height: 280px;
  place-items: center;
  margin: 0;
  color: #a89a85;
  font-size: 15px;
  letter-spacing: 1px;
}

.news-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin: 30px auto 0;
  color: #55514b;
  font-size: 13px;
  letter-spacing: .5px;
}

.news-pagination button {
  display: inline-flex;
  min-width: 116px;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 5px 14px;
  color: #3e3933;
  font-family: var(--font-calligraphy);
  font-size: 13px;
  background: #fff;
  border: 1px solid #e3ded5;
  border-radius: 99px;
  cursor: pointer;
  transition: border-color .2s ease, color .2s ease, background-color .2s ease;
}

.news-pagination button:disabled {
  color: #aaa39a;
  background: #f7f5f0;
  cursor: not-allowed;
}

.news-pagination button:not(:disabled):hover {
  color: #c73412;
  border-color: #c73412;
}

.news-pagination__info {
  text-align: center;
}

@media (max-width: 1100px) {
  .news-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
}

@media (max-width: 600px) {
  .news-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .news-card {
    border-radius: 10px;
  }

  .news-pagination {
    gap: 10px;
    margin-top: 24px;
    font-size: 12px;
  }

  .news-pagination button {
    min-width: 98px;
    font-size: 12px;
  }

  .news-pagination__info {
    order: -1;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .news-card,
  .news-card__image,
  .news-pagination button {
    transition: none;
  }
}
</style>
