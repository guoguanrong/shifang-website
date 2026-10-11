<template>
  <!-- 道长开示列表：顶部标签切换分类，卡片按类型进入视频或文章详情。 -->
  <CommunityPageShell
    :breadcrumb="t('portal.pages.messages.breadcrumb')"
    :eyebrow="t('portal.pages.messages.eyebrow')"
    :title="t('portal.pages.messages.title')"
    :subtitle="t('portal.pages.messages.subtitle')"
  >
    <!-- 分类标签目前只负责高亮切换，列表数据尚未按分类过滤。 -->
    <div class="message-tabs" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="tab"
        :class="{ active: activeTab === index }"
        type="button"
        role="tab"
        :aria-selected="activeTab === index"
        @click="activeTab = index"
      >
        {{ tab }}
      </button>
    </div>

    <div class="message-list">
      <article v-for="(item, index) in expandedMessages" :key="index" class="message-card">
        <!-- 封面就是入口按钮，键盘与读屏用户也能打开视频/文章。 -->
        <button
          class="message-card__media"
          type="button"
          :aria-label="isVideoMessage(index)
            ? t('portal.pages.messages.play', { name: item.name })
            : t('portal.pages.messages.openArticle', { name: item.name })"
          @click="openMessage(index)"
        >
          <img :src="messageImages[index % messageImages.length]" alt="" />
          <span v-if="isVideoMessage(index)" aria-hidden="true">▶</span>
        </button>
        <div class="message-card__copy">
          <h2>{{ item.name }}</h2>
          <p>{{ item.quote }}</p>
        </div>
      </article>
    </div>
  </CommunityPageShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import CommunityPageShell from '@/components/community/CommunityPageShell.vue'
import message1 from '@/assets/images/msg-card-1.webp'
import message2 from '@/assets/images/msg-card-2.webp'
import message3 from '@/assets/images/msg-card-3.webp'

const { t, tm } = useI18n()
const router = useRouter()
// 当前选中的分类标签索引。
const activeTab = ref(0)
// 封面素材同样循环复用。
const messageImages = [message1, message2, message3]
const tabs = computed(() => tm('messages.tabs'))
// 语言包条目有限，扩展到 9 条以填满三列布局。
const expandedMessages = computed(() => {
  const items = tm('messages.items')
  return Array.from({ length: 9 }, (_, index) => items[index % items.length])
})
// 每三张卡片中的第一张按视频处理，其余为文章。
const isVideoMessage = (index) => index % messageImages.length === 0
// 依据卡片类型跳转到对应的详情页。
const openMessage = (index) => router.push({ name: isVideoMessage(index) ? 'message-video-detail' : 'message-article-detail' })
</script>

<style scoped>
.message-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: -18px 0 46px;
}

.message-tabs button {
  min-width: 126px;
  padding: 8px 22px;
  color: #8b551f;
  background: #f6e3c9;
  border: 1px solid #d7a46e;
  border-radius: 999px;
  cursor: pointer;
  transition: color .2s ease, background-color .2s ease, transform .2s ease;
}

.message-tabs button.active {
  color: #fff;
  background: #a6100b;
  border-color: #a6100b;
}

/* 默认三列卡片，窄屏时逐级降为两列、一列。 */
.message-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.message-card {
  min-width: 0;
  overflow: hidden;
  background: rgba(255, 253, 250, .94);
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(74, 52, 29, .045);
  transition: box-shadow .25s ease, transform .25s ease;
}

.message-card__media {
  position: relative;
  display: grid;
  width: 100%;
  aspect-ratio: 1.85;
  padding: 0;
  overflow: hidden;
  place-items: center;
  cursor: pointer;
  background: #fff;
  border: 0;
}

.message-card__media::after {
  position: absolute;
  inset: 0;
  content: '';
  background: rgba(255, 251, 244, .15);
  transition: background-color .25s ease;
}

.message-card__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s ease;
}

.message-card__media span {
  position: relative;
  z-index: 1;
  color: #202020;
  font-size: 23px;
  transform: translateX(2px);
}

.message-card__copy {
  min-height: 118px;
  padding: 20px 22px 24px;
}

.message-card h2 {
  margin: 0 0 9px;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
}

.message-card p {
  margin: 0;
  color: #5f5b55;
  font-size: 13px;
  line-height: 1.6;
}

/* 悬停反馈只在鼠标设备上启用，触屏不做位移与缩放。 */
@media (hover: hover) and (pointer: fine) {
  .message-tabs button:hover { transform: translateY(-2px); }
  .message-card:hover {
    box-shadow: 0 16px 36px rgba(74, 52, 29, .12);
    transform: translateY(-4px);
  }
  .message-card:hover .message-card__media::after { background: transparent; }
  .message-card:hover .message-card__media img { transform: scale(1.035); }
}

/* 中等屏幕降为两列。 */
@media (max-width: 1050px) {
  .message-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* 手机端单列显示，标签改为等宽铺满。 */
@media (max-width: 620px) {
  .message-tabs { margin-bottom: 30px; }
  .message-tabs button { flex: 1 1 130px; min-width: 0; padding-inline: 14px; }
  .message-list { grid-template-columns: 1fr; gap: 18px; }
}
</style>
