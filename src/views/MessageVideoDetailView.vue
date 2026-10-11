<template>
  <!-- 开示视频详情：封面上的播放按钮目前只切换图标，尚未接入真实播放器。 -->
  <CommunityDetailShell
    :section="t('portal.pages.messageDetail.section')"
    :section-to="{ name: 'messages' }"
    :eyebrow="t('portal.pages.messageDetail.eyebrow')"
    :title="t('portal.pages.messageDetail.title')"
  >
    <article class="detail-surface detail-surface--video">
      <div class="detail-media">
        <img :src="portrait" :alt="t('portal.pages.messageDetail.title')" />
        <!-- 播放按钮只维护图标状态（▶ / Ⅱ），不加载真实视频。 -->
        <button
          class="detail-play"
          type="button"
          :aria-label="t('portal.pages.messageDetail.play')"
          :aria-pressed="isPlaying"
          @click="isPlaying = !isPlaying"
        >
          <span aria-hidden="true">{{ isPlaying ? 'Ⅱ' : '▶' }}</span>
        </button>
      </div>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import portrait from '@/assets/images/msg-card-1.webp'

const { t, tm } = useI18n()
// 播放状态仅用于切换按钮图标，暂无真实播放器。
const isPlaying = ref(false)
// 取视频版本的正文段落（文章详情取的是 articleParagraphs）。
const paragraphs = computed(() => tm('portal.pages.messageDetail.videoParagraphs'))
</script>

<style scoped>
/* 固定人像裁切位置，避免人物头部被裁掉。 */
.detail-media img { object-position: center 40%; }
</style>
