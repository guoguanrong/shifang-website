<template>
  <!-- 开示文章详情：与视频详情共用外壳，正文按列表页携带的 ?id= 从寄语接口加载。 -->
  <CommunityDetailShell
    :section="t('portal.pages.messageDetail.section')"
    :section-to="{ name: 'messages' }"
    :eyebrow="t('portal.pages.messageDetail.eyebrow')"
    :title="detailItem?.title || t('portal.pages.messageDetail.title')"
  >
    <article v-if="detailItem" class="detail-surface message-article-surface">
      <div class="detail-media">
        <img :src="coverImage" :alt="detailItem.title || t('portal.pages.messageDetail.title')" />
      </div>
      <div class="detail-body">
        <p class="detail-identity">{{ detailItem.category }}</p>
        <div class="detail-quote">
          <span class="detail-quote__label" aria-hidden="true">{{ t('portal.pages.detail.quoteLabel') }}</span>
          <p>{{ detailItem.content }}</p>
        </div>
        <h2 class="detail-label">{{ t('portal.pages.detail.contentLabel') }}</h2>
        <p v-for="(paragraph, index) in paragraphs" :key="index" class="detail-copy">{{ paragraph }}</p>
      </div>
    </article>
    <!-- 无 id、寄语不存在或加载失败时展示空态，不回退静态演示内容。 -->
    <p v-else class="detail-empty" role="status">{{ t('messages.empty') }}</p>
  </CommunityDetailShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getWishesById } from '@/api/wishes'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import portraitFallback from '@/assets/images/msg-card-1.webp'

const { t } = useI18n()
const route = useRoute()

// 寄语详情（WishesVo）：与列表页同源接口，按路由 ?id= 加载。
const detailItem = ref(null)
const notFound = ref(false)

// 解析 imgArrUrls：后端返回 JSON 数组字符串，兼容数组与单个 URL。
function parseWishImages(value) {
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

async function loadDetail(id) {
  detailItem.value = null
  notFound.value = false
  if (!id) {
    notFound.value = true
    return
  }

  try {
    const item = await getWishesById(id, { silent: true })
    detailItem.value = item || null
    if (!item) notFound.value = true
  } catch {
    notFound.value = true
  }
}

watch(() => route.query.id, loadDetail, { immediate: true })

const coverImage = computed(() => parseWishImages(detailItem.value?.imgArrUrls)[0] || portraitFallback)
// 正文：detail 按空行/换行拆段；未填 detail 时回退 content。
const paragraphs = computed(() => {
  const source = String(detailItem.value?.detail || detailItem.value?.content || '')
  return source.split(/\r?\n+/).map((part) => part.trim()).filter(Boolean)
})
</script>

<style scoped>
/* 微调人像裁切位置，保证人物居中。 */
.message-article-surface .detail-media img { object-position: center 37%; }

.detail-empty {
  margin: 0;
  color: #8b7a63;
  font-size: 15px;
  text-align: center;
}
</style>
