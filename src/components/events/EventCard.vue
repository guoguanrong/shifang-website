<template>
  <article class="event-card">
    <div class="event-media" aria-hidden="true">
      <img class="event-image" :src="image" alt="" />
      <div class="image-fade" />
    </div>
    <div class="event-copy">
      <h3>{{ item.title }}</h3>
      <p class="date">{{ item.date }}</p>
      <hr />
      <p class="desc">{{ item.desc }}</p>
      <div class="tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
      <CeremonialButton :label="details" />
    </div>
  </article>
</template>
<script setup>
import CeremonialButton from '@/components/common/CeremonialButton.vue'
defineProps({ item: { type: Object, required: true }, image: { type: String, required: true }, details: { type: String, required: true } })
</script>
<style scoped>
.event-card {
  position: relative;
  height: 420px;
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  /* 静止态用全透明投影占位：既保持设计稿原本「无投影」的观感，又让 hover 时阴影可平滑过渡。 */
  box-shadow: 0 2px 8px rgba(23, 48, 66, 0);
  transition: transform .28s ease, box-shadow .28s ease;
}

.event-media {
  position: absolute;
  inset: 0 0 auto;
  height: 247px;
  overflow: hidden;
  transition: transform .45s ease;
}

.event-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.image-fade {
  position: absolute;
  top: 177px;
  left: 0;
  width: 100%;
  height: 70px;
  pointer-events: none;
  backdrop-filter: blur(3px);
  background: linear-gradient(to bottom, rgba(255, 255, 255, .1) 0, rgba(255, 255, 255, .7) 28%, #fff 87%);
}

.event-copy {
  position: absolute;
  inset: 192px 19px 16px;
  font-family: var(--font-calligraphy);
}

.event-copy h3 {
  height: 22px;
  margin: 0;
  overflow: hidden;
  color: #000;
  font-size: 18px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 1.8px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.date {
  height: 18px;
  margin: 6px 0 7px;
  overflow: hidden;
  color: #c29f79;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: .5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.event-copy hr {
  height: 1px;
  margin: 0;
  background: #eee7de;
  border: 0;
}

.desc {
  display: -webkit-box;
  height: 60px;
  margin: 9px 0 8px;
  overflow: hidden;
  color: #000;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 1.2px;
  text-align: justify;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.tags {
  display: flex;
  gap: 10px;
  height: 20px;
  overflow: hidden;
}

.tags span {
  min-width: 60px;
  height: 18px;
  padding: 0 7px;
  color: #000;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  white-space: nowrap;
  background: #ffe9d2;
  border-radius: 999px;
}

.event-copy :deep(.ceremonial-button) {
  min-width: 137px;
  height: 36px;
  margin-top: 19px;
  font-size: 16px;
}

/* 悬停时卡片上浮并加深投影，封面图缓慢放大；卡片是圆角矩形，用 box-shadow 即可。 */
@media (hover: hover) and (pointer: fine) {
  .event-card:hover {
    box-shadow: 0 16px 32px rgba(23, 48, 66, .18);
    transform: translateY(-6px);
  }

  .event-card:hover .event-media {
    transform: scale(1.05);
  }
}

/* 键盘 Tab 到卡片内按钮时保持同样的反馈。 */
.event-card:focus-within {
  box-shadow: 0 16px 32px rgba(23, 48, 66, .18);
  transform: translateY(-6px);
}

.event-card:focus-within .event-media {
  transform: scale(1.05);
}

@media (max-width:600px) {
  .event-card {
    width: min(100%, 380px);
  }
}
</style>
