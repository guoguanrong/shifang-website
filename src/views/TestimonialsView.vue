<template>
  <!-- 善信反馈列表：文案取自语言包，头像按顺序循环复用。 -->
  <CommunityPageShell :breadcrumb="t('portal.pages.testimonials.breadcrumb')"
    :eyebrow="t('portal.pages.testimonials.eyebrow')" :title="t('portal.pages.testimonials.title')"
    :subtitle="t('portal.pages.testimonials.subtitle')">
    <div class="testimonial-list">
      <!-- 语言包条目有限，按序扩展成 11 条以填满三列布局。 -->
      <article v-for="(item, index) in expandedTestimonials" :key="`${item.tag}-${index}`" class="testimonial-card">
        <header>
          <img :src="avatars[index % avatars.length]" alt="" />
          <div>
            <h2>{{ item.name }} <span>{{ item.tag }}</span></h2>
            <p>{{ item.role }}</p>
          </div>
        </header>
        <blockquote>{{ item.quote }}</blockquote>
      </article>
    </div>
  </CommunityPageShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CommunityPageShell from '@/components/community/CommunityPageShell.vue'
import avatar1 from '@/assets/images/avatar-1.webp'
import avatar2 from '@/assets/images/avatar-2.webp'
import avatar3 from '@/assets/images/avatar-3.webp'
import avatar4 from '@/assets/images/avatar-4.webp'
import avatar5 from '@/assets/images/avatar-5.webp'
import avatar6 from '@/assets/images/avatar-6.webp'
import avatar7 from '@/assets/images/avatar-7.webp'
import avatar8 from '@/assets/images/avatar-8.webp'

const { t, tm } = useI18n()
// 八张头像素材按索引循环复用。
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8]
// 语言包只提供少量示例，扩展成 11 条避免列表过短。
const expandedTestimonials = computed(() => {
  const items = tm('testimonials.items')
  return Array.from({ length: 11 }, (_, index) => items[index % items.length])
})
</script>

<style scoped>
/* 默认三列，窄屏依次降为两列、一列。 */
.testimonial-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.testimonial-card {
  min-height: 202px;
  padding: 28px 30px;
  background: rgba(255, 253, 249, .92);
  border: 1px solid #e2bb8f;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(78, 52, 25, .035);
  transition: transform .25s ease, box-shadow .25s ease;
}

.testimonial-card header {
  display: flex;
  gap: 14px;
  align-items: center;
}

.testimonial-card img {
  flex: none;
  width: 66px;
  height: 66px;
  object-fit: cover;
  border: 2px solid #d6ab79;
  border-radius: 50%;
}

.testimonial-card h2 {
  margin: 0 0 4px;
  color: #242424;
  font-family: var(--font-calligraphy);
  font-size: 19px;
  font-weight: 400;
  line-height: 1.25;
}

/* 姓名后的标签（如祈福类别）以描边胶囊显示。 */
.testimonial-card h2 span {
  display: inline-block;
  margin-left: 7px;
  padding: 2px 10px;
  color: #c83a1b;
  font-family: var(--font-serif-cn);
  font-size: 12px;
  border: 1px solid #d65b42;
  border-radius: 999px;
  vertical-align: 2px;
}

.testimonial-card header p {
  margin: 0;
  color: #756b60;
  font-size: 12px;
}

.testimonial-card blockquote {
  margin: 17px 0 0;
  color: #3d3934;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  line-height: 1.7;
}

/* 上浮反馈只在鼠标设备上启用，触屏不生效。 */
@media (hover: hover) and (pointer: fine) {
  .testimonial-card:hover {
    box-shadow: 0 16px 34px rgba(66, 48, 29, .1);
    transform: translateY(-4px);
  }
}

/* 中等屏幕降为两列。 */
@media (max-width: 1100px) {
  .testimonial-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 手机端单列并压缩卡片留白。 */
@media (max-width: 680px) {
  .testimonial-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .testimonial-card {
    min-height: 0;
    padding: 22px 20px;
  }

  .testimonial-card img {
    width: 58px;
    height: 58px;
  }
}
</style>
