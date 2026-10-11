<template>
  <nav class="site-quick-actions" :aria-label="t('siteTools.quickLinks.title')">
    <RouterLink v-for="item in items" :key="item.key" class="quick-action" :class="'quick-action--' + item.key" :to="{ name: item.route }">
      <span class="quick-action__art" aria-hidden="true">
        <img class="quick-action__frame" :src="item.frame" alt="" />
        <img class="quick-action__fill" :src="item.fill" alt="" />
        <img class="quick-action__icon" :src="item.icon" alt="" />
      </span>
      <span class="quick-action__label">{{ t('siteTools.quickLinks.' + item.key) }}</span>
    </RouterLink>
    <BackToTopButton :label="t('siteTools.quickLinks.toTop')" />
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BackToTopButton from '@/components/common/BackToTopButton.vue'
import taiSuiFrame from '@/assets/site-tools/tai-sui-frame.svg'
import taiSuiFill from '@/assets/site-tools/tai-sui-fill.png'
import taiSuiIcon from '@/assets/site-tools/tai-sui.svg'
import volunteerFrame from '@/assets/site-tools/volunteer-frame.svg'
import volunteerFill from '@/assets/site-tools/volunteer-fill.png'
import volunteerIcon from '@/assets/site-tools/volunteer.svg'

const { t } = useI18n()
const items = [
  { key: 'taiSui', route: 'tai-sui-zodiac', frame: taiSuiFrame, fill: taiSuiFill, icon: taiSuiIcon },
  { key: 'volunteer', route: 'account-volunteer', frame: volunteerFrame, fill: volunteerFill, icon: volunteerIcon },
]
</script>

<style scoped>
.site-quick-actions { position: fixed; z-index: 900; right: max(18px, env(safe-area-inset-right)); bottom: max(28px, env(safe-area-inset-bottom)); display: flex; flex-direction: column; align-items: center; gap: 40px; width: 74px; }
.quick-action { display: flex; flex-direction: column; align-items: center; width: 74px; color: #fff; text-decoration: none; border-radius: 36px; }
.quick-action__art { position: relative; display: grid; width: 69px; height: 69px; place-items: center; }
.quick-action__frame { position: absolute; width: 100%; height: 100%; }
.quick-action__fill { position: absolute; width: 90%; height: 90%; }
.quick-action__icon { position: relative; width: 34px; height: 34px; object-fit: contain; }
.quick-action__label { position: relative; margin-top: -3px; padding: 2px 6px; border: 1px solid #d5b777; border-radius: 20px; background: #315981; font-size: 12px; line-height: 18px; white-space: nowrap; }
.quick-action--volunteer .quick-action__label { background: #a93a39; }
.quick-action:focus-visible { outline: 2px solid #9b713b; outline-offset: 4px; }
@media (max-width: 767px), (max-height: 600px) {
  .site-quick-actions { right: max(8px, env(safe-area-inset-right)); bottom: max(12px, env(safe-area-inset-bottom)); gap: 10px; width: 58px; }
  .quick-action { width: 58px; }
  .quick-action__art { width: 48px; height: 48px; }
  .quick-action__icon { width: 25px; height: 25px; }
  .quick-action__label { padding: 1px 4px; font-size: 10px; line-height: 16px; }
}
</style>
