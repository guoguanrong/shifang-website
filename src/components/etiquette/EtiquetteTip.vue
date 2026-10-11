<template>
  <p class="ritual-tip">
    <img class="tip-emblem" :src="tipEmblem" alt="" aria-hidden="true" />
    {{ text }}
  </p>
</template>

<script setup>
import tipEmblem from '@/assets/etiquette/incense/tip-emblem.png'

defineProps({ text: { type: String, required: true } })
</script>

<style scoped>
.ritual-tip {
  display: flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  min-height: 42px;
  padding: 8px 17px 8px 10px;
  margin: 0 auto;
  color: #2d2924;
  font-size: 14px;
  line-height: 1.55;
  text-align: left;
  background: linear-gradient(90deg, #fff7ec, #f7e8d5);
  border: 1px solid rgba(208, 160, 109, .25);
  border-radius: 12px 20px 20px 12px;
}

/* 复用参拜卡片上的朱砂菱形徽记切图，替代原来的 ◆ 字符拼法。 */
.tip-emblem {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  object-fit: contain;
}

@media (max-width: 600px) {
  .ritual-tip {
    font-size: 12px;
  }
}

:global(html[data-locale-layout='international'] .ritual-tip) {
  font-family: Georgia, serif;
  font-size: 13px;
}
</style>
