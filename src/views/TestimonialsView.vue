<template>
  <!-- 善信反馈列表：优先显示接口实录，接口失败时回退语言包示例。 -->
  <CommunityPageShell :breadcrumb="t('portal.pages.testimonials.breadcrumb')"
    :eyebrow="t('portal.pages.testimonials.eyebrow')" :title="t('portal.pages.testimonials.title')"
    :subtitle="t('portal.pages.testimonials.subtitle')">
    <p v-if="loadFailed" class="testimonial-notice" role="status">{{ t('portal.pages.testimonials.loadError') }}</p>
    <div class="testimonial-list" :aria-busy="loading">
      <article v-for="(item, index) in testimonials" :key="item.id ?? `${item.tag}-${index}`" class="testimonial-card">
        <header>
          <div v-if="item.fromApi" class="testimonial-avatar" aria-hidden="true">{{ item.initial }}</div>
          <img v-else :src="avatars[index % avatars.length]" alt="" />
          <div>
            <h2 v-if="item.name || (item.fromApi ? item.type : item.tag)">
              <template v-if="item.name">{{ item.name }}</template>
              <span v-if="item.fromApi ? item.type : item.tag">{{ item.fromApi ? memoirTypeLabel(item.type) : item.tag }}</span>
            </h2>
            <p v-if="item.role">{{ item.role }}</p>
          </div>
        </header>
        <p v-if="item.storyTitle" class="testimonial-title">{{ item.storyTitle }}</p>
        <blockquote>{{ item.quote }}</blockquote>
      </article>
      <p v-if="loading && !testimonials.length" class="testimonial-state" role="status">{{ t('portal.pages.testimonials.loading') }}</p>
      <p v-else-if="!loading && !testimonials.length" class="testimonial-state" role="status">{{ t('portal.pages.testimonials.empty') }}</p>
    </div>
    <nav v-if="!loadFailed && totalPages > 1" class="testimonial-pagination" :aria-label="t('portal.pages.testimonials.pagination')">
      <button type="button" :disabled="loading || currentPage <= 1" @click="changePage(currentPage - 1)">{{ t('portal.pages.testimonials.previous') }}</button>
      <span>{{ t('portal.pages.testimonials.pageInfo', { current: currentPage, total: totalPages }) }}</span>
      <button type="button" :disabled="loading || currentPage >= totalPages" @click="changePage(currentPage + 1)">{{ t('portal.pages.testimonials.next') }}</button>
    </nav>
  </CommunityPageShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getMemoirList } from '@/api/memoir'
import CommunityPageShell from '@/components/community/CommunityPageShell.vue'
import avatar1 from '@/assets/images/avatar-1.webp'
import avatar2 from '@/assets/images/avatar-2.webp'
import avatar3 from '@/assets/images/avatar-3.webp'
import avatar4 from '@/assets/images/avatar-4.webp'
import avatar5 from '@/assets/images/avatar-5.webp'
import avatar6 from '@/assets/images/avatar-6.webp'
import avatar7 from '@/assets/images/avatar-7.webp'
import avatar8 from '@/assets/images/avatar-8.webp'

const PAGE_SIZE = 12
const { t, tm, locale } = useI18n()
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8]
const currentPage = ref(1)
const totalPages = ref(1)
const records = ref([])
const loading = ref(true)
const loadFailed = ref(false)
const fallbackTestimonials = computed(() => {
  const items = tm('testimonials.items')
  return Array.from({ length: 11 }, (_, index) => ({ ...items[index % items.length], id: `fallback-${index}` }))
})
const testimonials = computed(() => loadFailed.value ? fallbackTestimonials.value : records.value)

function memoirTypeLabel(type) {
  const labels = {
    peace: { en: 'Peace', 'zh-CN': '平安', 'zh-TW': '平安' },
    health: { en: 'Health', 'zh-CN': '健康', 'zh-TW': '健康' },
    wealth: { en: 'Prosperity', 'zh-CN': '财运', 'zh-TW': '財運' },
  }
  const language = locale.value.startsWith('zh-TW') ? 'zh-TW' : locale.value.startsWith('zh') ? 'zh-CN' : 'en'
  return labels[String(type).toLowerCase()]?.[language] || type
}

async function loadTestimonials() {
  loading.value = true

  try {
    const result = await getMemoirList({ page: currentPage.value, pageSize: PAGE_SIZE, show: true }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list
    if (!Array.isArray(list)) throw new Error('实录列表响应格式无效')

    records.value = list.map((item) => ({
      id: item.id,
      name: item.username || '',
      type: item.type || '',
      role: item.job || '',
      storyTitle: item.title || '',
      quote: item.content || '',
      initial: String(item.username || '?').trim().slice(0, 1).toUpperCase(),
      fromApi: true,
    }))
    const totalRow = Number(result?.totalRow)
    const pageCount = Number(result?.totalPage)
    totalPages.value = Number.isFinite(pageCount) && pageCount > 0
      ? pageCount
      : Math.max(1, Math.ceil((Number.isFinite(totalRow) ? totalRow : list.length) / PAGE_SIZE))
    const responsePage = Number(result?.currentPage)
    if (Number.isFinite(responsePage) && responsePage > 0) currentPage.value = responsePage
    loadFailed.value = false
  } catch {
    records.value = []
    totalPages.value = 1
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

function changePage(page) {
  if (loading.value || page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadTestimonials()
}

onMounted(loadTestimonials)
</script>

<style scoped>
/* 默认三列，窄屏依次降为两列、一列。 */
.testimonial-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.testimonial-card {
  min-height: 202px;
  padding: 28px 30px;
  background: rgba(255, 253, 249, .92);
  border: 1px solid #e2bb8f;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(78, 52, 25, .035);
  transition: transform .25s ease, box-shadow .25s ease;
}

.testimonial-card header {
  display: flex;
  gap: 14px;
  align-items: center;
}

.testimonial-card img {
  flex: none;
  width: 66px;
  height: 66px;
  object-fit: cover;
  border: 2px solid #d6ab79;
  border-radius: 50%;
}

.testimonial-avatar {
  display: grid;
  flex: 0 0 66px;
  width: 66px;
  height: 66px;
  place-items: center;
  color: #9a321a;
  font-size: 24px;
  background: #f1e3cd;
  border: 2px solid #d6ab79;
  border-radius: 50%;
}

.testimonial-card h2 {
  margin: 0 0 4px;
  color: #242424;
  font-family: var(--font-calligraphy);
  font-size: 19px;
  font-weight: 400;
  line-height: 1.25;
}

/* 姓名后的标签（如祈福类别）以描边胶囊显示。 */
.testimonial-card h2 span {
  display: inline-block;
  margin-left: 7px;
  padding: 2px 10px;
  color: #c83a1b;
  font-family: var(--font-serif-cn);
  font-size: 12px;
  border: 1px solid #d65b42;
  border-radius: 999px;
  vertical-align: 2px;
}

.testimonial-card header p {
  margin: 0;
  color: #756b60;
  font-size: 12px;
}

.testimonial-card blockquote {
  margin: 17px 0 0;
  color: #3d3934;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  line-height: 1.7;
}

.testimonial-title {
  margin: 16px 0 -10px;
  color: #3d3934;
  font-size: 14px;
  font-weight: 600;
}

.testimonial-notice,
.testimonial-state {
  color: #756b60;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

.testimonial-notice {
  margin: 0 0 20px;
}

.testimonial-state {
  grid-column: 1 / -1;
  margin: 24px 0;
}

.testimonial-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  color: #756b60;
  font-size: 14px;
}

.testimonial-pagination button {
  min-width: 88px;
  padding: 9px 16px;
  color: #fff;
  background: #c83a1b;
  border: 1px solid #c83a1b;
  border-radius: 999px;
  cursor: pointer;
}

.testimonial-pagination button:disabled {
  color: #9d958b;
  background: #ebe5dc;
  border-color: #d8d0c4;
  cursor: not-allowed;
}

/* 上浮反馈只在鼠标设备上启用，触屏不生效。 */
@media (hover: hover) and (pointer: fine) {
  .testimonial-card:hover {
    box-shadow: 0 16px 34px rgba(66, 48, 29, .1);
    transform: translateY(-4px);
  }
}

/* 中等屏幕降为两列。 */
@media (max-width: 1100px) {
  .testimonial-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 手机端单列并压缩卡片留白。 */
@media (max-width: 680px) {
  .testimonial-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .testimonial-card {
    min-height: 0;
    padding: 22px 20px;
  }

  .testimonial-card img {
    width: 58px;
    height: 58px;
  }

  .testimonial-avatar {
    flex-basis: 58px;
    width: 58px;
    height: 58px;
  }

  .testimonial-pagination {
    gap: 10px;
    font-size: 12px;
  }

  .testimonial-pagination button {
    min-width: 72px;
    padding-inline: 10px;
  }
}
</style>
