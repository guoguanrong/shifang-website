<template>
  <!-- 宫观动态列表：面包屑与标题交给社区页外壳，卡片内容全部取自当前语言包。 -->
  <CommunityPageShell :breadcrumb="t('portal.pages.news.breadcrumb')" :eyebrow="t('portal.pages.news.eyebrow')"
    :title="t('portal.pages.news.title')" :subtitle="t('portal.pages.news.subtitle')">
    <div class="news-list">
      <!-- 整张卡片就是链接，进入详情页；aria-label 让读屏用户也能听到新闻标题。 -->
      <RouterLink v-for="(item, index) in expandedNews" :key="`${item.title}-${index}`" :to="{ name: 'news-detail' }"
        class="news-card" :aria-label="t('portal.pages.news.openDetail', { title: item.title })">
        <img class="news-card__image" :src="newsImages[index % newsImages.length]" :alt="item.title" />
        <div class="news-card__content" :style="{ '--card-image': `url(${newsImages[index % newsImages.length]})` }">
          <h2>{{ item.title }}</h2>
          <p>{{ item.desc }}</p>
          <!-- 日期与阅读量均为设计稿占位值，接入接口后应替换为真实数据。 -->
          <footer>
            <time :datetime="newsDates[index % newsDates.length]">{{ newsDates[index % newsDates.length] }}</time>
            <span>3,286 {{ t('portal.pages.news.views') }}</span>
          </footer>
        </div>
      </RouterLink>
    </div>
  </CommunityPageShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import CommunityPageShell from '@/components/community/CommunityPageShell.vue'
import news1 from '@/assets/images/news-card-1.webp'
import news2 from '@/assets/images/news-card-2.webp'
import news3 from '@/assets/images/news-card-3.webp'

const { t, tm } = useI18n()
// 封面图与日期只有三套，按顺序循环复用（设计稿未提供更多素材）。
const newsImages = [news1, news2, news3]
const newsDates = ['2026.04.15', '2026.03.25', '2026.03.08']
// 语言包仅 3 条示例，这里按序扩展成 8 条，避免宽屏下列表过短留白。
const expandedNews = computed(() => {
  const items = tm('news.items')
  return Array.from({ length: 8 }, (_, index) => items[index % items.length])
})
</script>

<style scoped>
/* 卡片网格：单列最小 400px，空间不足时自动减少列数。 */
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 30px;
  width: 100%;
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
