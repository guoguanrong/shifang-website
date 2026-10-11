<template>
  <!-- 新闻详情页：外壳提供返回入口与标题，正文段落全部取自语言包。 -->
  <CommunityDetailShell
    :section="t('portal.pages.newsDetail.section')"
    :section-to="{ name: 'news' }"
    :eyebrow="t('portal.pages.newsDetail.eyebrow')"
    :title="t('portal.pages.newsDetail.title')"
  >
    <!-- 顶部元信息：日期为占位值，阅读量同样来自语言包。 -->
    <template #meta>
      <time datetime="2026-04-08">{{ t('portal.pages.newsDetail.date') }}</time>
      <span>{{ t('portal.pages.newsDetail.views') }}</span>
    </template>

    <article class="detail-surface news-detail-surface">
      <div class="detail-media"><img :src="heroImage" :alt="t('portal.pages.newsDetail.title')" /></div>
      <div class="detail-body">
        <p v-for="paragraph in paragraphs" :key="paragraph" class="detail-copy">{{ paragraph }}</p>
        <div class="detail-quote">
          <span class="detail-quote__label" aria-hidden="true">{{ t('portal.pages.detail.quoteLabel') }}</span>
          <p>{{ t('portal.pages.newsDetail.quote') }}</p>
        </div>
      </div>
    </article>
  </CommunityDetailShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import heroImage from '@/assets/images/news-card-1.webp'

const { t, tm } = useI18n()
// 正文段落由语言包提供，切换语言即切换全文。
const paragraphs = computed(() => tm('portal.pages.newsDetail.paragraphs'))
</script>

<style scoped>
/* 微调头图裁切焦点，避免关键画面被裁掉。 */
.news-detail-surface .detail-media img { object-position: center 39%; }
</style>
