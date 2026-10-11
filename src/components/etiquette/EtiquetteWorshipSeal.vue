<template>
  <!-- 礼拜印章：底图 + 按 tone 切换的填充色 + 标题与标语（标语按「 · 」拆行）。 -->
  <div class="worship-seal">
    <img class="seal-outline" :src="sealOutline" alt="" aria-hidden="true" />
    <img class="seal-fill" :src="fills[tone]" alt="" aria-hidden="true" />
    <h3>{{ title }}</h3>
    <p><span v-for="line in slogan.split(' · ')" :key="line">{{ line }}</span></p>
  </div>
</template>

<script setup>
import sealOutline from '@/assets/etiquette/worship/sealOutline.svg'
import sealRed from '@/assets/etiquette/worship/sealRed.png'
import sealBlue from '@/assets/etiquette/worship/sealBlue.png'
import sealGreen from '@/assets/etiquette/worship/sealGreen.png'

// tone 决定印章的填充色（red / blue / green），默认红色。
defineProps({ title: String, slogan: String, tone: { type: String, default: 'red' } })
const fills = { red: sealRed, blue: sealBlue, green: sealGreen }
</script>

<style scoped>
/* 印章固定方形，文字整体居中；两侧小菱形由伪元素绘制。 */
.worship-seal {
  position: relative;
  isolation: isolate;
  width: 154px;
  height: 154px;
  margin-inline: auto;
  color: #fff;
  text-align: center;
  font-family: var(--font-calligraphy);
}

.worship-seal img {
  position: absolute;
  pointer-events: none;
  z-index: -1;
}

.seal-outline {
  inset: 0;
  width: 100%;
  height: 100%;
}

.seal-fill {
  inset: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
}

.worship-seal::before,
.worship-seal::after {
  content: '';
  position: absolute;
  top: 74px;
  width: 6px;
  height: 6px;
  background: #e5bf96;
  transform: rotate(45deg);
}

.worship-seal::before {
  left: -2px;
}

.worship-seal::after {
  right: -2px;
}

h3 {
  padding-top: 32px;
  margin: 0 0 9px;
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
}

p {
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

p span {
  display: block;
}

:global(html[data-locale-layout='international'] .worship-seal) {
  width: 200px;
  height: 200px;
  font-family: Georgia, serif;
}

:global(html[data-locale-layout='international'] .worship-seal h3) {
  padding-top: 43px;
  font-size: 24px;
}

:global(html[data-locale-layout='international'] .worship-seal p) {
  max-width: 156px;
  margin-inline: auto;
  font-size: 13px;
  line-height: 17px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .worship-seal::before),
:global(html[data-locale-layout='international'] .worship-seal::after) {
  top: 97px;
}
</style>
