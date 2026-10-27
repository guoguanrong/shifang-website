<template>
  <CommunityDetailShell
    :section="detailSection"
    :section-to="sectionRoute"
    :eyebrow="detailEyebrow"
    :title="detailItem?.title || detailItem?.username || t('portal.pages.newsDetail.title')"
  >
    <template v-if="detailItem && detailKind === 'news'" #meta>
      <time v-if="detailDate" :datetime="detailDate">{{ detailDateLabel }}</time>
      <span v-if="detailItem.readNum !== null && detailItem.readNum !== undefined">
        {{ formatReads(detailItem.readNum) }} {{ t('portal.pages.newsDetail.views') }}
      </span>
    </template>

    <article
      v-if="detailItem"
      class="detail-surface news-detail-surface"
      :class="{ 'detail-video-surface': detailKind === 'messages' && detailItem.videoUrl }"
    >
      <!-- 仅寄语视频需要媒体区；其余分类没有封面图时整块不渲染，避免留下占高。 -->
      <div v-if="detailKind === 'messages' && detailItem.videoUrl" class="detail-media">
        <video :poster="coverImage" controls preload="metadata">
          <source :src="detailItem.videoUrl" />
        </video>
      </div>
      <div class="detail-body">
        <p v-if="detailIdentity" class="detail-identity">{{ detailIdentity }}</p>
        <template v-if="detailKind === 'news'">
          <p v-for="(paragraph, index) in paragraphs" :key="index" class="detail-copy">{{ paragraph }}</p>
          <div v-if="detailItem.wishes" class="detail-quote">
            <span class="detail-quote__label" aria-hidden="true">{{ t('portal.pages.detail.quoteLabel') }}</span>
            <p>{{ detailItem.wishes }}</p>
          </div>
        </template>
        <template v-else>
          <div v-if="detailQuote" class="detail-quote">
            <span class="detail-quote__label" aria-hidden="true">{{ t('portal.pages.detail.quoteLabel') }}</span>
            <p>{{ detailQuote }}</p>
          </div>
          <h2 v-if="paragraphs.length" class="detail-label">{{ t('portal.pages.detail.contentLabel') }}</h2>
          <p v-for="(paragraph, index) in paragraphs" :key="index" class="detail-copy">{{ paragraph }}</p>
        </template>
      </div>
    </article>
    <p v-else class="detail-empty" role="status">{{ t('news.empty') }}</p>
  </CommunityDetailShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getDynamicById } from '@/api/dynamic'
import { getMemoirById } from '@/api/memoir'
import { getWishesById } from '@/api/wishes'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import newsFallback from '@/assets/images/news-card-1.webp'
import testimonialFallback from '@/assets/images/msg-card-1.webp'
import messageFallback from '@/assets/images/msg-card-1.webp'

const { t } = useI18n()
const route = useRoute()
const detailItem = ref(null)
let detailRequestId = 0

const detailKind = computed(() => {
  const kind = route.query.kind
  return kind === 'testimonials' || kind === 'messages' ? kind : 'news'
})
const detailSection = computed(() => {
  if (detailKind.value === 'testimonials') return t('portal.pages.testimonials.breadcrumb')
  if (detailKind.value === 'messages') return t('portal.pages.messages.breadcrumb')
  return t('portal.pages.newsDetail.section')
})
const detailEyebrow = computed(() => {
  if (detailKind.value === 'testimonials') return t('portal.pages.testimonials.eyebrow')
  if (detailKind.value === 'messages') return t('portal.pages.messages.eyebrow')
  return t('portal.pages.newsDetail.eyebrow')
})
const sectionRoute = computed(() => {
  if (detailKind.value === 'testimonials') return { name: 'testimonials' }
  if (detailKind.value === 'messages') return { name: 'messages' }
  return { name: 'news' }
})
const detailIdentity = computed(() => {
  if (detailKind.value === 'testimonials') {
    return [detailItem.value?.username, detailItem.value?.job].filter(Boolean).join(' · ')
  }
  if (detailKind.value === 'messages') return detailItem.value?.category || ''
  return ''
})
const detailQuote = computed(() => {
  if (detailKind.value === 'messages') return detailItem.value?.content || ''
  return detailItem.value?.wishes || ''
})

function parseDetailImages(value) {
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

async function loadDetail(id, requestedKind) {
  const requestId = ++detailRequestId
  detailItem.value = null
  if (!id) return

  try {
    let item
    if (requestedKind === 'testimonials') {
      item = await getMemoirById(id)
    } else if (requestedKind === 'messages') {
      item = await getWishesById(id)
    } else {
      item = await getDynamicById(id, { silent: true })
    }
    if (requestId === detailRequestId) detailItem.value = item || null
  } catch {
    if (requestId === detailRequestId) detailItem.value = null
  }
}

watch(
  () => [route.query.id, route.query.kind],
  ([id, kind]) => loadDetail(id, kind === 'testimonials' || kind === 'messages' ? kind : 'news'),
  { immediate: true },
)

const coverImage = computed(() => {
  if (!detailItem.value) return newsFallback
  const imageValue = detailKind.value === 'messages'
    ? detailItem.value.imgArrUrls
    : detailItem.value.cover
  const fallback = detailKind.value === 'testimonials'
    ? testimonialFallback
    : detailKind.value === 'messages'
      ? messageFallback
      : newsFallback
  return parseDetailImages(imageValue)[0] || fallback
})
const detailDate = computed(() => (detailItem.value?.createTime || '').slice(0, 10))
const detailDateLabel = computed(() => detailDate.value.replaceAll('-', '.'))
const paragraphs = computed(() => {
  const source = detailKind.value === 'messages'
    ? detailItem.value?.detail || ''
    : detailItem.value?.content || ''
  return String(source).split(/\r?\n+/).map((part) => part.trim()).filter(Boolean)
})

function formatReads(reads) {
  return reads === null || reads === undefined ? '—' : Number(reads).toLocaleString('en-US')
}
</script>

<style scoped>
.news-detail-surface .detail-media img {
  object-position: center 39%;
}

.news-detail-surface .detail-media video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.detail-video-surface .detail-media {
  background: #171513;
}

.detail-empty {
  margin: 0;
  color: #8b7a63;
  font-size: 15px;
  text-align: center;
}
</style>
