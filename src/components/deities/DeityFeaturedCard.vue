<template>
  <article class="featured-card">
    <!-- 三层 SVG 分别还原 Figma 的投影、纸张底板与描边，避免缩放后边缘失真。 -->
    <img class="featured-shadow" :src="featuredShadow" alt="" aria-hidden="true" />
    <img class="featured-background" :src="featuredFrame" alt="" aria-hidden="true" />
    <img class="featured-outline" :src="featuredOutline" alt="" aria-hidden="true" />

    <div class="featured-image">
      <img class="deity-photo" :src="featuredDeity" :alt="deity.title" />
      <img class="image-border" :src="featuredImageBorder" alt="" aria-hidden="true" />
    </div>

    <div class="featured-content">
      <h2><RouterLink class="featured-link" :to="{ name: 'deity-doumu' }">{{ deity.title }}</RouterLink></h2>
      <p class="featured-subtitle">{{ deity.subtitle }}</p>

      <div class="featured-tags">
        <span v-for="tag in deity.tags" :key="tag">{{ tag }}</span>
      </div>

      <p class="featured-description">{{ deity.description }}</p>

      <dl class="featured-meta">
        <template v-for="meta in deity.meta" :key="meta.label">
          <dt>{{ meta.label }}</dt>
          <dd>{{ meta.value }}</dd>
        </template>
      </dl>

      <DeityMerit
        class="featured-merit"
        :label="meritLabel"
        :title="deity.meritTitle"
        :description="deity.meritDescription"
      />

      <DeityActionButtons class="featured-actions" large />
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router'
// 装饰资源与内容数据分离：资源固定还原视觉，deity 数据可随语言响应式切换。
import featuredDeity from '@/assets/deities/featured-deity.webp'
import featuredFrame from '@/assets/deities/featured-frame.svg'
import featuredImageBorder from '@/assets/deities/featured-deity.svg'
import featuredOutline from '@/assets/deities/featured-outline.svg'
import featuredShadow from '@/assets/deities/featured-shadow.svg'
import DeityActionButtons from './DeityActionButtons.vue'
import DeityMerit from './DeityMerit.vue'

defineProps({ deity: { type: Object, required: true }, meritLabel: { type: String, required: true } })
</script>

<style scoped>
.featured-card {
  position: relative;
  isolation: isolate;
  width: 1440px;
  height: 590px;
  margin: 0 auto;
  color: #2e261f;
  transition: transform .45s cubic-bezier(.22, .61, .36, 1);
  will-change: transform;
  cursor: pointer;
}

.featured-background,
.featured-outline,
.featured-shadow { position: absolute; pointer-events: none; }
/* 装饰层限制在卡片内部并置于正文下方，悬停变换也不会覆盖文字。 */
.featured-background { inset: 0; z-index: -2; width: 100%; height: 100%; }
.featured-shadow {
  z-index: -3;
  top: 20px;
  left: 0;
  width: 1440px;
  height: 550px;
  transition: transform .45s cubic-bezier(.22, .61, .36, 1), opacity .45s ease, filter .45s ease;
}
.featured-outline {
  z-index: -1;
  top: 10px;
  left: 10px;
  width: 1420px;
  height: 570px;
  transition: opacity .45s ease;
}

.featured-image {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 512px;
  height: 512px;
  padding: 6px;
  overflow: hidden;
}

.deity-photo {
  display: block;
  width: 500px;
  height: 500px;
  object-fit: cover;
  object-position: center 43%;
  transition: transform .6s cubic-bezier(.22, .61, .36, 1);
}

.image-border {
  position: absolute;
  inset: 0;
  width: 512px;
  height: 512px;
  pointer-events: none;
  transition: transform .6s cubic-bezier(.22, .61, .36, 1);
}

.featured-content { position: static; padding: 46px 106px 0 821px; width: 100%; }
/* 标题链接的点击区域覆盖整张卡片，原有操作按钮保留独立语义。 */
.featured-link::after { position: absolute; inset: 0; z-index: 1; content: ''; }
.featured-link:focus-visible { outline: none; }
.featured-link:focus-visible::after { outline: 3px solid #a87944; outline-offset: 5px; border-radius: 22px; }
.featured-actions { position: relative; z-index: 2; }
.featured-content h2 { margin: 0; font-family: var(--font-calligraphy); font-size: 32px; font-weight: 600; line-height: 40px; transition: color .35s ease; }
.featured-subtitle { margin: 10px 0 0; color: #de3f25; font-size: 16px; line-height: 20px; letter-spacing: 1px; }

.featured-tags { display: flex; gap: 20px; margin-top: 22px; }
.featured-tags span { width: 80px; height: 32px; font-size: 16px; line-height: 32px; text-align: center; background: url('@/assets/deities/card-tag.svg') center / 100% 100% no-repeat; }

.featured-description { height: 80px; margin: 20px 0 0; overflow: hidden; font-size: 16px; line-height: 20px; letter-spacing: .7px; text-align: justify; }

.featured-meta {
  display: grid;
  grid-template-columns: 80px 167px 80px 167px;
  align-items: center;
  margin: 20px 0 0;
}

.featured-meta dt { width: 80px; height: 32px; margin: 0; font-size: 16px; line-height: 32px; text-align: center; background: url('@/assets/deities/card-tag.svg') center / 100% 100% no-repeat; }
.featured-meta dd { margin: 0; padding-left: 14px; font-size: 16px; line-height: 20px; }
.featured-merit { margin-top: 20px; width: 513px; }
.featured-actions { margin-top: 33px; }

@media (hover: hover) and (pointer: fine) {
  .featured-card:hover { transform: translateY(-6px); }
  .featured-card:hover .featured-shadow { opacity: .85; transform: translateY(10px) scale(1.012); filter: drop-shadow(0 20px 24px rgba(70, 48, 25, .24)); }
  .featured-card:hover .featured-outline { opacity: .72; }
  .featured-card:hover .deity-photo { transform: scale(1.045); }
  .featured-card:hover .image-border { transform: scale(1.015); }
  .featured-card:hover .featured-content h2 { color: #a51c1c; }
}

@media (max-width: 1439px) {
  .featured-card { width: min(94vw, 840px); height: auto; padding: 28px; background: linear-gradient(#fff, #f3f0e9); border: 1px solid #f2d2af; border-radius: 22px; }
  .featured-background, .featured-outline, .featured-shadow { display: none; }
  .featured-image { position: relative; top: auto; left: auto; width: min(100%, 500px); height: auto; margin: 0 auto; padding: 6px; aspect-ratio: 1; }
  .deity-photo { width: 100%; height: 100%; }
  .image-border { width: 100%; height: 100%; }
  .featured-content { position: static; width: min(100%, 620px); margin: 30px auto 0; padding: 0; }
  .featured-description { height: auto; min-height: 80px; }
  .featured-merit { width: 100%; }
  .featured-actions { justify-content: center; }
}

@media (max-width: 680px) {
  .featured-card { width: calc(100vw - 28px); padding: 18px; }
  .featured-content { margin-top: 22px; }
  .featured-content h2 { font-size: 28px; text-align: center; }
  .featured-subtitle { text-align: center; }
  .featured-tags { justify-content: center; gap: 10px; }
  .featured-description { font-size: 14px; line-height: 1.65; }
  .featured-meta { grid-template-columns: 80px 1fr; gap: 8px 0; }
  .featured-merit { margin-top: 14px; }
  .featured-actions { margin-top: 20px; }
}

:global(html[data-locale-layout='international'] .featured-content h2) { font-family: var(--font-serif-cn); font-size: 28px; }
:global(html[data-locale-layout='international'] .featured-subtitle) { font-size: 14px; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .featured-tags span),
:global(html[data-locale-layout='international'] .featured-meta dt) { padding-inline: 5px; font-family: var(--font-ui-international); font-size: 13px; }
:global(html[data-locale-layout='international'] .featured-description) { font-size: 12.5px; line-height: 16.5px; letter-spacing: 0; text-align: left; }
:global(html[data-locale-layout='international'] .featured-meta dd) { font-size: 13px; }
</style>
