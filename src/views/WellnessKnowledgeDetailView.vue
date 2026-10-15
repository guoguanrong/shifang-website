<template>
  <!-- 道典精读详情页：正文按列表页携带的 ?id= 从道典接口加载。 -->
  <CommunityDetailShell
    :section="t('wellness.hero.title')"
    :section-to="{ name: 'wellness' }"
    :eyebrow="t('wellness.knowledge.eyebrow')"
    :title="detailItem?.title || t('wellness.knowledge.title')"
  >
    <!-- 顶部元信息：阅读次数取接口真实值。 -->
    <template v-if="detailItem" #meta>
      <span>{{ formatReadCount(detailItem.readNum) }} {{ t('wellness.knowledge.reads') }}</span>
    </template>

    <article v-if="detailItem" class="detail-surface knowledge-detail-surface">
      <div class="detail-media"><img :src="coverImage" :alt="detailItem.title || ''" /></div>
      <div class="knowledge-detail-body">
        <p v-if="detailItem.intro" class="knowledge-detail-intro">{{ detailItem.intro }}</p>
        <div v-for="(section, index) in infoSections" :key="index" class="knowledge-info-section">
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
        </div>
      </div>
    </article>
    <!-- 无 id、文章不存在或加载失败时展示空态，不回退静态演示内容。 -->
    <p v-else class="detail-empty" role="status">{{ t('wellness.knowledge.empty') }}</p>
  </CommunityDetailShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getDaodianById } from '@/api/daodian'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import articleFallback from '@/assets/wellness/article-qianjin.webp'

const { t } = useI18n()
const route = useRoute()

// 道典文章详情（DaodianVo）：与列表页同源接口，按路由 ?id= 加载。
const detailItem = ref(null)

async function loadDetail(id) {
  detailItem.value = null
  if (!id) return

  try {
    const item = await getDaodianById(id, { silent: true })
    detailItem.value = item || null
  } catch {
    detailItem.value = null
  }
}

watch(() => route.query.id, loadDetail, { immediate: true })

const coverImage = computed(() => detailItem.value?.cover || articleFallback)

// infoArr 小节：JSON 数组（兼容字符串形态）；项支持 {title, text} 对象与纯字符串两种。
const infoSections = computed(() => {
  const raw = detailItem.value?.infoArr
  let list = []

  if (Array.isArray(raw)) {
    list = raw
  } else if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      list = Array.isArray(parsed) ? parsed : []
    } catch {
      list = []
    }
  }

  return list
    .map((entry) => {
      if (entry && typeof entry === 'object') {
        // 后台实际字段为 {name, desc}；兼容 {title, text} 等其他命名。
        return {
          title: String(entry.title || entry.name || ''),
          text: String(entry.text || entry.desc || entry.content || ''),
        }
      }
      return { title: '', text: String(entry || '') }
    })
    .filter((section) => section.title || section.text)
})

function formatReadCount(value) {
  return Number(value || 0).toLocaleString()
}
</script>

<style scoped>
/* 小节：金棕渐变标签条标题 + 正文（保留文本内换行，适配食谱类多行内容）。 */
.knowledge-detail-body { padding: 30px 40px 44px; }

.knowledge-detail-intro {
  margin: 0 0 26px;
  padding: 14px 20px;
  color: #6b5a45;
  font-size: 14px;
  line-height: 1.8;
  background: rgba(244, 231, 213, .45);
  border-left: 3px solid #d8b38d;
  border-radius: 0 10px 10px 0;
}

.knowledge-info-section + .knowledge-info-section { margin-top: 28px; }

.knowledge-info-section h2 {
  display: inline-flex;
  margin: 0 0 12px;
  padding: 4px 14px;
  color: #8a5422;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  background: linear-gradient(90deg, rgba(218, 190, 154, .78), rgba(244, 231, 213, .58) 65%, transparent);
  border-radius: 999px;
}

.knowledge-info-section p {
  margin: 0;
  color: #37332e;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 1.9;
  text-align: justify;
  white-space: pre-line;
}

.detail-empty {
  margin: 0;
  color: #8b7a63;
  font-size: 15px;
  text-align: center;
}
</style>
