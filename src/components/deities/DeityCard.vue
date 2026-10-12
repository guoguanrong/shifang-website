<template>
  <article class="deity-card">
    <RouterLink class="card-link" :to="{ name: 'deity-detail', params: { deityId: deity.id } }"
      :aria-label="deity.title" />
    <!-- 双层卡框直接复用 Figma 导出矢量，避免 CSS 近似描边产生比例偏差。 -->
    <img class="frame frame-outer" :src="cardFrameOuter" alt="" aria-hidden="true" />
    <img class="frame frame-inner" :src="cardFrameInner" alt="" aria-hidden="true" />

    <div class="portrait-frame">
      <img :src="image" :alt="deity.title" />
    </div>

    <h2 class="card-title" :class="{ 'is-long': deity.title.length > 8 }">{{ deity.title }}</h2>
    <p class="card-subtitle">{{ deity.subtitle }}</p>

    <div class="card-tags">
      <span v-for="tag in deity.tags" :key="tag">{{ tag }}</span>
    </div>

    <p class="card-description">{{ deity.description }}</p>

    <div class="card-meta">
      <span v-for="meta in deity.meta" :key="meta">{{ meta }}</span>
    </div>

    <DeityMerit class="card-merit" :label="meritLabel" :title="deity.meritTitle"
      :description="deity.meritDescription" />

    <DeityActionButtons
      class="card-actions"
      :deity-id="deity.id"
      :worship="deity.worship"
      :worship-loaded="worshipLoaded"
    />
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import cardFrameInner from '@/assets/deities/card-frame-inner.svg'
import cardFrameOuter from '@/assets/deities/card-frame-outer.svg'
import DeityActionButtons from './DeityActionButtons.vue'
import DeityMerit from './DeityMerit.vue'

defineProps({
  deity: { type: Object, required: true },
  image: { type: String, required: true },
  meritLabel: { type: String, required: true },
  worshipLoaded: { type: Boolean, default: false },
})
</script>

<style scoped>
.deity-card {
  position: relative;
  isolation: isolate;
  width: 400px;
  height: 731px;
  color: #2e261f;
  transition: filter .25s ease, transform .25s ease;
  cursor: pointer;
}

/* 整卡链接覆盖图片和文字，业务按钮高一层，避免嵌套交互元素。 */
.card-link {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: 24px;
}

.card-link:focus-visible {
  outline: 3px solid #a87944;
  outline-offset: 4px;
}

.card-actions {
  z-index: 4;
}

.frame {
  position: absolute;
  pointer-events: none;
}

.frame-outer {
  top: 31px;
  left: 0;
  width: 400px;
  height: 700px;
}

.frame-inner {
  top: 38px;
  left: 6px;
  width: 388px;
  height: 686px;
}

.portrait-frame {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 81px;
  width: 240px;
  height: 240px;
  padding: 5px;
  background: #fff;
  border: 1px solid #e3ab70;
  border-radius: 50%;
  box-shadow: 0 2px 0 rgba(255, 255, 255, .95);
}

.portrait-frame::before,
.portrait-frame::after {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  content: '';
  background: #f2d2af;
  transform: translateY(-50%) rotate(45deg);
}

.portrait-frame::before {
  left: -5px;
}

.portrait-frame::after {
  right: -5px;
}

.portrait-frame img {
  display: block;
  width: 230px;
  height: 230px;
  object-fit: cover;
  border-radius: 50%;
}

.card-title,
.card-subtitle,
.card-description {
  position: absolute;
  margin: 0;
}

.card-title {
  z-index: 1;
  top: 257px;
  left: 40px;
  width: 320px;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  text-align: center;
  white-space: nowrap;
}

.card-title.is-long {
  left: 18px;
  width: 364px;
  font-size: 29px;
}

.card-subtitle {
  top: 303px;
  left: 66px;
  width: 268px;
  font-size: 16px;
  line-height: 23px;
  letter-spacing: 1.5px;
  text-align: center;
}

.card-tags {
  position: absolute;
  top: 343px;
  left: 60px;
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 20px;
}

.card-tags span {
  height: 32px;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  background: url('@/assets/deities/card-tag.svg') center / 100% 100% no-repeat;
}

.card-description {
  top: 392px;
  left: 26px;
  width: 361px;
  height: 100px;
  overflow: hidden;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: .6px;
  text-align: justify;
}

.card-meta {
  position: absolute;
  top: 504px;
  left: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 349px;
}

.card-meta span {
  display: block;
  min-width: 111px;
  height: 24px;
  padding: 1px 14px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  white-space: nowrap;
  background: #ffe9d2;
  border-radius: 999px;
}

.card-merit {
  position: absolute;
  top: 541px;
  left: 26px;
  width: 349px;
}

.card-actions {
  position: absolute;
  top: 658px;
  left: 26px;
}

@media (hover: hover) and (pointer: fine) {
  .deity-card:hover {
    filter: drop-shadow(0 14px 12px rgba(70, 48, 25, .12));
    transform: translateY(-6px);
  }
}

:global(html[data-locale-layout='international'] .card-title) {
  top: 255px;
  font-family: var(--font-serif-cn);
  font-size: 23px;
  line-height: 30px;
  white-space: normal;
}

:global(html[data-locale-layout='international'] .card-title.is-long) {
  font-size: 20px;
}

:global(html[data-locale-layout='international'] .card-subtitle) {
  top: 301px;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .card-tags span) {
  padding-inline: 5px;
  font-family: var(--font-ui-international);
  font-size: 13px;
}

:global(html[data-locale-layout='international'] .card-description) {
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0;
  text-align: left;
}

:global(html[data-locale-layout='international'] .card-meta span) {
  min-width: 0;
  max-width: 170px;
  overflow: hidden;
  font-family: var(--font-ui-international);
  font-size: 13px;
  text-overflow: ellipsis;
}

@media (max-width: 430px) {

  /* 小屏采用内容流布局，长标题和翻译文案可自然撑高卡片。 */
  .deity-card {
    width: 100%;
    height: auto;
    padding: 20px 18px 28px;
    border: 1px solid #f2d2af;
    border-radius: 24px;
    background: linear-gradient(#fff, #f3f0e9);
  }

  .frame {
    display: none;
  }

  .portrait-frame {
    position: relative;
    top: auto;
    left: auto;
    width: min(100%, 240px);
    height: auto;
    aspect-ratio: 1;
    margin: 0 auto;
  }

  .portrait-frame img {
    width: 100%;
    height: 100%;
  }

  .deity-card .card-title,
  .deity-card .card-subtitle,
  .deity-card .card-description,
  .deity-card .card-tags,
  .deity-card .card-meta,
  .deity-card .card-merit,
  .deity-card .card-actions {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
  }

  .deity-card .card-title {
    margin-top: 18px;
    font-size: 27px;
    line-height: 1.4;
    white-space: normal;
  }

  .deity-card .card-subtitle {
    margin-top: 8px;
  }

  .card-tags {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 18px;
  }

  .deity-card .card-description {
    height: auto;
    margin-top: 18px;
    font-size: 14px;
    line-height: 1.65;
  }

  .card-meta {
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  .card-meta span {
    min-width: 0;
    height: auto;
    white-space: normal;
  }

  .card-merit {
    height: auto;
    min-height: 100px;
    margin-top: 16px;
  }

  .card-merit :deep(> div) {
    height: auto;
    min-height: 94px;
  }

  .card-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;
  }

  .card-actions :deep(button) {
    padding-inline: 10px;
    font-size: 14px;
  }
}
</style>
