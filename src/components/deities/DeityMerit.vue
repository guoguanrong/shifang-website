<template>
  <!-- 功德信息抽成独立语义块，重点卡片与普通卡片共用同一套排版。 -->
  <div class="merit-box">
    <strong>{{ label }}</strong>
    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
// 文案由页面级 i18n 数据注入，组件自身不绑定任何具体神祇。
defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<style scoped>
.merit-box {
  display: grid;
  grid-template-columns: 37px minmax(0, 1fr);
  width: 100%;
  height: 100px;
  color: #33291f;
}

.merit-box strong {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 7px;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  text-align: center;
  writing-mode: vertical-rl;
  /* 直接使用 Figma 4036:2 导出的底板，不再通过圆角和边框模拟。 */
  background: url('@/assets/deities/merit-label-bg.svg') center / 100% 100% no-repeat;
  border: 0;
}

.merit-box>div {
  align-self: center;
  height: 94px;
  margin-left: -11px;
  padding: 12px 14px 10px 49px;
  background: rgba(255, 255, 255, .92);
  border-radius: 0 18px 18px 0;
}

.merit-box h3,
.merit-box p {
  margin: 0;
}

.merit-box h3 {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
}

.merit-box p {
  margin-top: 5px;
  font-size: 16px;
  line-height: 20px;
}

:global(html[data-locale-layout='international'] .merit-box strong) {
  padding: 5px 4px;
  font-family: var(--font-ui-international);
  font-size: 14px;
  line-height: 13px;
  writing-mode: vertical-rl;
}

:global(html[data-locale-layout='international'] .merit-box h3) {
  font-size: 16px;
  line-height: 18px;
}

:global(html[data-locale-layout='international'] .merit-box p) {
  margin-top: 3px;
  font-size: 16px;
  line-height: 16px;
}
</style>
