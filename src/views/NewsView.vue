<template>
  <!-- 宫观动态列表：面包屑与标题交给社区页外壳，卡片内容全部取自当前语言包。 -->
  <CommunityPageShell :breadcrumb="t('portal.pages.news.breadcrumb')" :eyebrow="t('portal.pages.news.eyebrow')"
    :title="t('portal.pages.news.title')" :subtitle="t('portal.pages.news.subtitle')">
    <div v-if="displayedNews.length" class="news-list">
      <!-- 整张卡片就是链接，进入详情页并携带动态 id；aria-label 让读屏用户也能听到新闻标题。 -->
      <RouterLink v-for="item in displayedNews" :key="item.id"
        :to="{ name: 'news-detail', query: item.id ? { id: String(item.id) } : undefined }" class="news-card"
        :aria-label="t('portal.pages.news.openDetail', { title: item.title })">
        <img class="news-card__image" :src="item.cover" :alt="item.title" />
        <div class="news-card__content" :style="{ '--card-image': `url(${item.cover})` }">
          <h2>{{ item.title }}</h2>
          <p>{{ item.desc }}</p>
          <footer>
            <time v-if="item.date" :datetime="item.date">{{ item.dateLabel }}</time>
            <span>{{ formatReads(item.reads) }} {{ t('portal.pages.news.views') }}</span>
          </footer>
        </div>
      </RouterLink>
    </div>
    <p v-else class="news-empty">{{ t('news.empty') }}</p>
  </CommunityPageShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { getDynamicList } from '@/api/dynamic'
import CommunityPageShell from '@/components/community/CommunityPageShell.vue'
import news1 from '@/assets/images/news-card-1.webp'
import news2 from '@/assets/images/news-card-2.webp'
import news3 from '@/assets/images/news-card-3.webp'

const { t, tm } = useI18n()
// 每页数量：宽屏网格约展示 9 张卡片。
const PAGE_SIZE = 9
// 封面占位素材：接口未返回图片时循环复用。
const newsImages = [news1, news2, news3]
const newsDates = ['2026.04.15', '2026.03.25', '2026.03.08']

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

// 按接口加载最新动态（仅展示已发布的）。
const apiNews = ref([])
const apiLoaded = ref(false)

async function loadNews() {
  try {
    const result = await getDynamicList({ page: 1, pageSize: PAGE_SIZE, show: true }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list
    apiNews.value = Array.isArray(list)
      ? list.map((item, index) => {
        const date = (item.createTime || '').slice(0, 10)
        return {
          id: item.id ?? `news-${index}`,
          title: item.title || '',
          desc: item.content || '',
          cover: parseNewsImages(item.cover)[0] || newsImages[index % newsImages.length],
          date,
          dateLabel: date.replaceAll('-', '.'),
          reads: item.readNum ?? null,
        }
      })
      : []
  } catch {
    apiNews.value = []
  } finally {
    apiLoaded.value = true
  }
}

// 加载完成前展示语言包静态条目占位，避免首屏空白。
const staticNews = computed(() => {
  const items = tm('news.items')
  return Array.from({ length: 8 }, (_, index) => ({
    id: `static-${index}`,
    title: items[index % items.length].title,
    desc: items[index % items.length].desc,
    cover: newsImages[index % newsImages.length],
    date: newsDates[index % newsDates.length],
    dateLabel: newsDates[index % newsDates.length],
    reads: 3286,
  }))
})

const displayedNews = computed(() => (apiLoaded.value ? apiNews.value : staticNews.value))

onMounted(loadNews)
</script>

<style scoped>
/* 卡片网格：单列最小 400px，空间不足时自动减少列数。 */
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 30px;
  width: 100%;
}

.news-empty {
  margin: 0;
  color: #8b7a63;
  font-size: 14px;
  text-align: center;
}

/* 上半部封面、下半部文案，整体比例由 aspect-ratio 固定。 */
.news-card {
  display: grid;
  grid-template-rows: 60% 40%;
  width: 100%;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  aspect-ratio: 23 / 15;
  background: #f8f1e9;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgb(37 35 33 / 6%);
  transition: transform .35s ease, box-shadow .35s ease;
}

.news-card:hover,
.news-card:focus-within {
  transform: translateY(-6px);
  box-shadow: 0 18px 34px rgb(37 35 33 / 16%);
}

.news-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .6s ease;
}

.news-card:hover .news-card__image,
.news-card:focus-within .news-card__image {
  transform: scale(1.06);
}

/* 三张封面的主体位置不同，逐张微调裁切焦点，避免切掉关键画面。 */
.news-card:nth-child(3n + 1) .news-card__image {
  object-position: center 23%;
}

.news-card:nth-child(3n + 2) .news-card__image {
  object-position: center 42%;
}

.news-card:nth-child(3n) .news-card__image {
  object-position: center 46%;
}

.news-card__content {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px 20px 10px;
  overflow: hidden;
  isolation: isolate;
}

.news-card__content::before,
.news-card__content::after {
  position: absolute;
  z-index: -2;
  inset: -18px;
  content: '';
}

/* 用同一张封面放大模糊做背景，再由 ::after 的半透明白遮盖，保证文字可读。 */
.news-card__content::before {
  background: var(--card-image) center 51% / cover no-repeat;
  filter: blur(10px);
  transform: scale(1.08);
}

.news-card__content::after {
  z-index: -1;
  background: rgba(255, 250, 245, .84);
  transition: background-color .35s ease;
}

.news-card:hover .news-card__content::after,
.news-card:focus-within .news-card__content::after {
  background: rgba(255, 250, 245, .93);
}

.news-card h2 {
  margin: 0 0 5px;
  overflow: hidden;
  color: #252321;
  transition: color .3s ease;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
  line-height: 25px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-card:hover h2,
.news-card:focus-within h2 {
  color: #c73412;
}

.news-card p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #38332e;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 20px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.news-card footer {
  display: flex;
  gap: 30px;
  align-items: center;
  margin-top: auto;
  color: #aaa39d;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 1px;
}

/* 小屏改用视口比例字号，避免长标题与正文撑破卡片。 */
@media (max-width: 520px) {
  .news-list {
    gap: 20px;
  }

  .news-card {
    border-radius: 10px;
  }

  .news-card__content {
    padding: 2.6vw 4.35vw 2.2vw;
  }

  .news-card h2 {
    margin-bottom: .8vw;
    font-size: clamp(14px, 4vw, 18px);
    line-height: 1.35;
  }

  .news-card p {
    font-size: clamp(11px, 3.05vw, 14px);
    line-height: 1.42;
  }

  .news-card footer {
    gap: 6vw;
    font-size: clamp(8px, 2.2vw, 10px);
    line-height: 1.2;
    letter-spacing: .6px;
  }
}

/* 系统开启「减少动态效果」时取消位移与缩放。 */
@media (prefers-reduced-motion: reduce) {

  .news-card,
  .news-card__image,
  .news-card h2,
  .news-card__content::after {
    transition: none;
  }

  .news-card:hover,
  .news-card:focus-within {
    transform: none;
  }

  .news-card:hover .news-card__image,
  .news-card:focus-within .news-card__image {
    transform: none;
  }
}
</style>
