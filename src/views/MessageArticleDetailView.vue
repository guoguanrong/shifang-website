<template>
  <!-- 开示文章详情：与视频详情共用外壳，仅正文段落来源不同。 -->
  <CommunityDetailShell
    :section="t('portal.pages.messageDetail.section')"
    :section-to="{ name: 'messages' }"
    :eyebrow="t('portal.pages.messageDetail.eyebrow')"
    :title="t('portal.pages.messageDetail.title')"
  >
    <article class="detail-surface message-article-surface">
      <div class="detail-media"><img :src="portrait" :alt="t('portal.pages.messageDetail.title')" /></div>
      <div class="detail-body">
        <p class="detail-identity">{{ t('portal.pages.messageDetail.identity') }}</p>
        <div class="detail-quote">
          <span class="detail-quote__label" aria-hidden="true">{{ t('portal.pages.detail.quoteLabel') }}</span>
          <p>{{ t('portal.pages.messageDetail.quote') }}</p>
        </div>
        <h2 class="detail-label">{{ t('portal.pages.detail.contentLabel') }}</h2>
        <p v-for="paragraph in paragraphs" :key="paragraph" class="detail-copy">{{ paragraph }}</p>
      </div>
    </article>
  </CommunityDetailShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import portrait from '@/assets/images/msg-card-1.webp'

const { t, tm } = useI18n()
// 取文章版本的正文段落（视频详情取的是 videoParagraphs）。
const paragraphs = computed(() => tm('portal.pages.messageDetail.articleParagraphs'))
</script>

<style scoped>
/* 微调人像裁切位置，保证人物居中。 */
.message-article-surface .detail-media img { object-position: center 37%; }
</style>
