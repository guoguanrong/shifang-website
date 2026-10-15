<template>
  <!-- 动态详情页：正文按列表页携带的 ?id= 从动态接口加载。 -->
  <CommunityDetailShell
    :section="t('portal.pages.newsDetail.section')"
    :section-to="{ name: 'news' }"
    :eyebrow="t('portal.pages.newsDetail.eyebrow')"
    :title="detailItem?.title || t('portal.pages.newsDetail.title')"
  >
    <!-- 顶部元信息：发布日期与阅读量取接口真实值。 -->
    <template v-if="detailItem" #meta>
      <time v-if="detailDate" :datetime="detailDate">{{ detailDateLabel }}</time>
      <span>{{ formatReads(detailItem.readNum) }} {{ t('portal.pages.newsDetail.views') }}</span>
    </template>

    <article v-if="detailItem" class="detail-surface news-detail-surface">
      <div class="detail-media"><img :src="coverImage" :alt="detailItem.title || t('portal.pages.newsDetail.title')" /></div>
      <div class="detail-body">
        <p v-for="(paragraph, index) in paragraphs" :key="index" class="detail-copy">{{ paragraph }}</p>
        <div v-if="detailItem.wishes" class="detail-quote">
          <span class="detail-quote__label" aria-hidden="true">{{ t('portal.pages.detail.quoteLabel') }}</span>
          <p>{{ detailItem.wishes }}</p>
        </div>
      </div>
    </article>
    <!-- 无 id、动态不存在或加载失败时展示空态，不回退静态演示内容。 -->
    <p v-else class="detail-empty" role="status">{{ t('news.empty') }}</p>
  </CommunityDetailShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getDynamicById } from '@/api/dynamic'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import heroImageFallback from '@/assets/images/news-card-1.webp'

const { t } = useI18n()
const route = useRoute()

// 动态详情（DynamicVo）：与列表页同源接口，按路由 ?id= 加载。
const detailItem = ref(null)

// 解析 cover：后端返回 JSON 数组字符串（多图）或单个 URL。
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

// 阅读量：未公布（null）显示 '—'，否则千分位展示。
function formatReads(reads) {
  return reads === null || reads === undefined ? '—' : Number(reads).toLocaleString('en-US')
}

async function loadDetail(id) {
  detailItem.value = null
  if (!id) return

  try {
    const item = await getDynamicById(id, { silent: true })
    detailItem.value = item || null
  } catch {
    detailItem.value = null
  }
}

watch(() => route.query.id, loadDetail, { immediate: true })

const coverImage = computed(() => parseNewsImages(detailItem.value?.cover)[0] || heroImageFallback)
const detailDate = computed(() => (detailItem.value?.createTime || '').slice(0, 10))
const detailDateLabel = computed(() => detailDate.value.replaceAll('-', '.'))
// 正文：content 按空行/换行拆段。
const paragraphs = computed(() => {
  const source = String(detailItem.value?.content || '')
  return source.split(/\r?\n+/).map((part) => part.trim()).filter(Boolean)
})
</script>

<style scoped>
/* 微调头图裁切焦点，避免关键画面被裁掉。 */
.news-detail-surface .detail-media img { object-position: center 39%; }

.detail-empty {
  margin: 0;
  color: #8b7a63;
  font-size: 15px;
  text-align: center;
}
</style>
