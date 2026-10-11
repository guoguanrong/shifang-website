<template>
  <!-- 首页各内容模块共用的标题结构；light 用于深色背景版本。 -->
  <header class="section-heading" :class="{ 'is-light': light }">
    <p>{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <span />
    <div v-if="description" class="description">{{ description }}</div>
  </header>
</template>

<script setup>
// 标题文案由父组件传入，组件本身只负责统一语义与视觉结构。
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  light: { type: Boolean, default: false },
})
</script>

<style scoped>
/* flex 纵向布局 + align-items: center，保证在各父容器（grid/flex/绝对定位）内都稳定居中。 */
.section-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 46rem;
  margin: 0 auto 3rem;
  text-align: center;
}

.section-heading p {
  margin: 0 0 8px;
  color: #d0a06d;
  font-family: var(--font-serif-cn);
  font-size: 24px;
  letter-spacing: 0;
}

.section-heading h2 {
  margin: 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 1.2;
}

.section-heading span {
  display: none;
}

.description {
  max-width: 100%;
  color: #575656;
  line-height: 1.8;
}

.is-light h2,
.is-light .description {
  color: #fff;
}

@media (max-width: 760px) {
  .section-heading {
    margin-bottom: 2rem;
  }

  .section-heading p {
    font-size: 17px;
  }

  .section-heading h2 {
    font-size: 30px;
  }

  .description {
    font-size: 14px;
  }
}
</style>
