<template>
  <section class="services" aria-label="Blessing services">
    <article v-for="(item, index) in items" :key="item.title" class="service-card">
      <img class="service-icon" :class="`icon-${index + 1}`" :src="icons[index]" alt="" />
      <h2>{{ item.title }}</h2>
      <p><span v-for="line in item.lines" :key="line">{{ line }}</span></p>
      <CeremonialButton :label="item.action" @click="go(index)" />
    </article>
  </section>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import lamp from '@/assets/blessings/service-lamp.png'
import talisman from '@/assets/blessings/service-talisman.png'
import calendar from '@/assets/blessings/service-calendar.png'
const icons = [lamp, talisman, calendar]
// 按服务卡顺序对应线上点灯、电子护身符和节气提醒。
const serviceRoutes = ['lamp-offerings', 'digital-talisman', 'seasonal-reminders']
const router = useRouter()
const { tm } = useI18n()
const items = computed(() => tm('blessings.services'))
function go(index) {
  const name = serviceRoutes[index]
  if (name) router.push({ name })
}
</script>
<style scoped>
.services {
  position: absolute;
  z-index: 2;
  top: 254px;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(3, 400px);
  gap: 20px;
  width: 1240px;
  transform: translateX(-50%);
}

.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 518px;
  padding: 0 26px;
  text-align: center;
  background: url('@/assets/blessings/service-card.webp') center/400px 518px no-repeat;
  transition: transform .25s ease, filter .25s ease;
}

.service-icon {
  width: auto;
  object-fit: contain;
  margin-top: 70px;
  height: 150px;
  transition: transform .25s ease;
}

.service-icon.icon-2 {
  width: 161px;
  height: 142px;
  margin-top: 74px;
  margin-bottom: 4px;
}

.service-icon.icon-3 {
  width: 239px;
  height: 148px;
  margin-top: 78px;
  margin-bottom: -4px;
}

.service-card h2 {
  margin: 34px 0 10px;
  color: #050505;
  font: 32px/1 var(--font-calligraphy);
  letter-spacing: 1px;
}

.service-card p {
  display: flex;
  flex-direction: column;
  min-height: 90px;
  margin: 0;
  color: #333;
  font: 17px/20px var(--font-calligraphy);
  letter-spacing: 1.6px;
}

.service-card :deep(.ceremonial-button) {
  margin-top: auto;
  margin-bottom: 65px;
}

/* 悬停时整卡上浮并投影，图标同步轻抬放大，与站内其他卡片的交互手感一致。
   卡片主体是带透明边的 PNG 边框，用 drop-shadow 而非 box-shadow，避免出现方形阴影。 */
@media (hover: hover) and (pointer: fine) {
  .service-card:hover {
    filter: drop-shadow(0 16px 18px rgba(90, 58, 30, .18));
    transform: translateY(-6px);
  }

  .service-card:hover .service-icon {
    transform: translateY(-6px) scale(1.05);
  }
}

/* 键盘 Tab 到卡片内按钮时保持同样的抬升，避免只有鼠标用户看得到反馈。 */
.service-card:focus-within {
  filter: drop-shadow(0 16px 18px rgba(90, 58, 30, .18));
  transform: translateY(-6px);
}

.service-card:focus-within .service-icon {
  transform: translateY(-6px) scale(1.05);
}

:global(html[data-locale-layout='international']) .service-card h2 {
  font-size: 25px;
}

:global(html[data-locale-layout='international']) .service-card p {
  font-size: 14px;
  letter-spacing: .4px;
}

@media (max-width:1100px) {
  .services {
    position: relative;
    top: auto;
    left: auto;
    grid-template-columns: repeat(2, minmax(280px, 400px));
    justify-content: center;
    width: auto;
    padding: 0 24px;
    transform: none;
  }
}

@media (max-width:700px) {
  .services {
    grid-template-columns: minmax(280px, 400px);
    padding: 0 12px;
  }

  .service-card {
    width: 100%;
    max-width: 400px;
    background-size: 100% 100%;
  }
}
</style>
