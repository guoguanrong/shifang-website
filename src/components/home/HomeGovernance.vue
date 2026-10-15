<template>
  <!-- 组织架构：六类组织角色按文案与牌匾切图索引对应展示。 -->
  <section id="organization" class="organization-section" aria-labelledby="organization-title">
    <img class="organization-background" :src="organizationBackground" alt="" />
    <div class="organization-content">
      <HomeSectionHeading
        id="organization-title"
        :eyebrow="t('organization.en')"
        :title="t('organization.title')"
        :description="t('organization.subtitle')"
        light
      />
      <div class="organization-grid">
        <article v-for="(item, index) in organizationItems" :key="item.title">
          <img :src="organizationFrames[index]" alt="" />
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- 资金监管：展示实时查看与资金流向两项透明机制。 -->
  <!-- <section id="supervision" class="supervision-section" aria-labelledby="supervision-title">
    <div class="supervision-content">
      <HomeSectionHeading
        id="supervision-title"
        :eyebrow="t('supervision.en')"
        :title="t('supervision.title')"
        :description="t('supervision.subtitle')"
      />
      <img class="supervision-scroll" :src="supervisionScroll" alt="" />
      <div class="supervision-grid">
        <article v-for="(item, index) in supervisionItems" :key="item.title">
          <img class="supervision-card-background" :src="supervisionCard" alt="" />
          <img class="supervision-icon" :src="supervisionIcons[index]" alt="" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </div>
  </section> -->
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HomeSectionHeading from './HomeSectionHeading.vue'
import organizationBackground from '@/assets/cuts/organization-brush.webp'
import organizationBoard from '@/assets/cuts/org-executive.png'
import organizationSecretariat from '@/assets/cuts/org-secretariat.png'
import organizationSupervision from '@/assets/cuts/org-supervision.png'
import organizationAdvisers from '@/assets/cuts/org-advisers.png'
import organizationPartners from '@/assets/cuts/org-partners.png'
import organizationVolunteers from '@/assets/cuts/org-board.png'
import supervisionScroll from '@/assets/cuts/supervision-scroll-figma.webp'
import supervisionCard from '@/assets/cuts/supervision-card-figma.svg'
import supervisionCloud from '@/assets/cuts/supervision-cloud-figma.svg'
import supervisionFunds from '@/assets/cuts/supervision-funds-figma.svg'

const { t, tm } = useI18n()
// 列表文案使用 computed，以响应全局语言变化。
const organizationItems = computed(() => tm('organization.items'))
const supervisionItems = computed(() => tm('supervision.items'))
// 组织牌匾切图与 organization.items 使用相同顺序。
const organizationFrames = [
  organizationBoard,
  organizationSecretariat,
  organizationSupervision,
  organizationAdvisers,
  organizationPartners,
  organizationVolunteers,
]
// 监管图标与 supervision.items 使用相同顺序。
const supervisionIcons = [supervisionCloud, supervisionFunds]
</script>

<style scoped>
.organization-section {
  position: relative;
  z-index: 3;
  height: 852px;
  overflow: visible;
  background: #f9f5ed;
}

.organization-background {
  position: absolute;
  z-index: 0;
  top: -118px;
  left: 50%;
  width: 100%;
  height: 1639px;
  max-width: none;
  object-fit: fill;
  transform: translateX(-50%);
}

.organization-content {
  position: relative;
  z-index: 1;
  width: 1440px;
  margin: 0 auto;
  padding-top: 305px;
}

.organization-content :deep(.section-heading) { margin-bottom: 78px; }

.organization-grid {
  display: grid;
  grid-template-columns: repeat(3, 446px);
  gap: 50px 51px;
}

.organization-grid article {
  position: relative;
  height: 250px;
}

.organization-grid article > img {
  position: absolute;
  inset: 0;
  width: 358px;
  height: 250px;
  object-fit: fill;
}

.organization-grid article > div {
  position: absolute;
  top: 116px;
  left: 38px;
  width: 285px;
  text-align: center;
}

.organization-grid h3 {
  margin: 0 0 18px;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 30px;
  font-weight: 400;
  line-height: 1;
}

.organization-grid p {
  margin: 0;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 22px;
}

.supervision-section {
  position: relative;
  z-index: 2;
  height: 949px;
  overflow: hidden;
  background: transparent;
}

.supervision-content {
  position: absolute;
  top: 417px;
  left: 50%;
  width: 1440px;
  height: 485px;
  transform: translateX(-50%);
}

.supervision-content :deep(.section-heading) { margin-bottom: 0; }

.supervision-scroll {
  position: absolute;
  z-index: 0;
  top: 258px;
  left: 0;
  width: 1440px;
  height: 227px;
  object-fit: fill;
}

.supervision-grid {
  position: absolute;
  z-index: 1;
  top: 182px;
  left: 348.5px;
  display: grid;
  grid-template-columns: repeat(2, 340px);
  gap: 63px;
}

.supervision-grid article {
  position: relative;
  isolation: isolate;
  width: 340px;
  height: 283px;
  text-align: center;
}

.supervision-card-background { position: absolute; z-index: 0; top: 0; left: 0; width: 340px; height: 250px; object-fit: fill; }
.supervision-icon { position: absolute; z-index: 1; left: 50%; object-fit: contain; transform: translateX(-50%); }
.supervision-grid article:first-child .supervision-icon { top: 36px; width: 58px; height: 58px; }
.supervision-grid article:nth-child(2) .supervision-icon { top: 30px; width: 70px; height: 70px; }
.supervision-grid h3 { position: absolute; z-index: 1; top: 114px; left: 0; width: 100%; margin: 0; color: #333; font-family: var(--font-calligraphy); font-size: 32px; font-weight: 400; line-height: 1; }
.supervision-grid p { position: absolute; z-index: 1; top: 167px; left: 53px; width: 234px; height: 116px; margin: 0; overflow: hidden; color: #333; font-family: var(--font-serif-cn); font-size: 16px; line-height: 20px; letter-spacing: 1.6px; }

@media (max-width: 1439px) {
  .organization-section, .supervision-section { height: auto; min-height: 0; padding: 70px 20px; overflow: hidden; }
  .organization-background { top: 0; height: 100%; opacity: .9; }
  .organization-content, .supervision-content { position: relative; inset: auto; width: 100%; height: auto; padding-top: 0; transform: none; }
  .organization-grid { grid-template-columns: repeat(2, 358px); justify-content: center; }
  .supervision-section { background: url('@/assets/cuts/supervision-stage-bg.webp') center top / cover no-repeat; }
  .supervision-content :deep(.section-heading) { margin-bottom: 55px; }
  .supervision-scroll { top: auto; bottom: -10px; left: 50%; width: min(1440px, 140vw); height: auto; transform: translateX(-50%); }
  .supervision-grid { position: relative; top: auto; left: auto; grid-template-columns: repeat(2, 340px); justify-content: center; width: auto; }
}

@media (max-width: 760px) {
  .organization-grid { grid-template-columns: 358px; }
  .supervision-grid { grid-template-columns: 340px; gap: 28px; }
}
</style>
