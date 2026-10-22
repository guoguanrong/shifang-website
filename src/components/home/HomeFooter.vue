<template>
  <footer class="site-footer">
    <!-- 页脚四栏：品牌下载、探索、参与和关于。 -->
    <div class="footer-grid">
      <section class="footer-brand">
        <p class="brand">{{ t('footer.logo') }}</p>
        <p class="slogan">{{ t('footer.slogan') }}</p>
        <!-- <div class="download-links">
          <button type="button"><img :src="androidIcon" alt="" /><span>{{ t('footer.android') }}</span></button>
          <button type="button"><img :src="appleIcon" alt="" /><span>{{ t('footer.ios') }}</span></button>
          <button type="button"><img :src="wechatIcon" alt="" /><span>{{ t('footer.wechat') }}</span></button>
        </div> -->
      </section>
      <section>
        <h2>{{ t('footer.exploreTitle') }}</h2>
        <button v-for="(item, index) in exploreItems" :key="item" type="button"
          @click="navigate(exploreTargets[index])">{{ item }}</button>
      </section>
      <section>
        <h2>{{ t('footer.joinTitle') }}</h2>
        <button v-for="(item, index) in joinItems" :key="item" type="button" @click="navigate(joinTargets[index])">{{
          item }}</button>
      </section>
      <section>
        <h2>{{ t('footer.aboutTitle') }}</h2>
        <div class="about-links">
          <button v-for="(item, index) in aboutItems" :key="item" type="button"
            @click="navigate(aboutTargets[index])">{{ item }}</button>
        </div>
      </section>
    </div>
    <!-- 版权与政策链接区域。 -->
    <div class="footer-bottom"><span>{{ t('footer.copyright') }}</span><span class="policy-links"><span
          v-for="(label, index) in policyLabels" :key="label"><RouterLink :to="policyTargets[index]">{{ label }}</RouterLink></span></span></div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import androidIcon from '@/assets/footer/android.svg'
import appleIcon from '@/assets/footer/apple.svg'
import wechatIcon from '@/assets/footer/wechat.svg'

defineEmits(['navigate'])

const { t, tm } = useI18n()
const route = useRoute()
const router = useRouter()
// 菜单显示文案来自语言包，目标数组负责定义实际跳转位置。
const exploreTargets = ['culture', 'deities', 'etiquette', 'blessings', 'events']
// 与语言包 footer.about 数组按下标一一对应；资金监管暂未上线，两处需同步增删。
const aboutTargets = ['about', 'temple-plan', 'mission', 'organization', 'news', 'milestones']
const joinTargets = ['co-build', 'cloud-build']
const exploreItems = computed(() => tm('footer.explore'))
const joinItems = computed(() => tm('footer.join'))
const aboutItems = computed(() => tm('footer.about'))
const policyLabels = computed(() => t('footer.linksText').split(/\s{2,}/))
const policyTargets = ['/contact', '/legal', '/privacy', '/compliance']

async function navigate(sectionId) {
  // 已实现的内容页使用独立路由；信众实录 / 各界寄语 / 最新动态仍以首页版块为准，平滑滚动定位。
  const routeByTarget = { culture: 'culture-origins', deities: 'deities', etiquette: 'etiquette', 'co-build': 'co-build', 'cloud-build': 'cloud-build', blessings: 'blessings', events: 'events' }
  if (routeByTarget[sectionId]) {
    await router.push({ name: routeByTarget[sectionId] })
    return
  }
  if (route.name !== 'home') {
    // 内页点击首页模块时携带 hash，由路由统一完成定位。
    await router.push({ name: 'home', hash: `#${sectionId}` })
    return
  }
  // 已在首页则直接平滑滚动到对应模块。
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.policy-links a { display: inline-block; padding-block: 6px; }
.policy-links a:hover { text-decoration: underline; text-underline-offset: 4px; }
.policy-links a:focus-visible { outline: 2px solid #e9c49b; outline-offset: 4px; }
/* 沿用 Figma 四栏比例，按项目要求将内容区上限设为 1440px。 */
.site-footer {
  position: relative;
  isolation: isolate;
  min-height: 473px;
  padding: 59px 24px 19px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-weight: 400;
  background: #1b4b69;
}

.site-footer::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  background: url('@/assets/footer/background.webp') center / cover no-repeat;
  mix-blend-mode: luminosity;
  opacity: .1;
  pointer-events: none;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 499fr) minmax(0, 246fr) minmax(0, 263fr) minmax(0, 232fr);
  width: 100%;
  max-width: 1440px;
  min-height: 332px;
  margin: 0 auto;
}

.footer-grid section {
  min-width: 0;
}

.footer-brand {
  padding-top: 12px;
}

.brand {
  margin: 0 0 18px;
  font-size: 36px;
  line-height: 43px;
}

.slogan {
  width: min(236px, 100%);
  margin: 0;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: 1.6px;
  white-space: pre-line;
}

.footer-grid h2 {
  position: relative;
  isolation: isolate;
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  line-height: 48px;
  letter-spacing: 1.6px;
}

.footer-grid h2::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: -13px;
  left: 10px;
  width: 64px;
  height: 91px;
  background: url('@/assets/footer/cloud.png') center / contain no-repeat;
  opacity: .3;
  mix-blend-mode: screen;
  transform: scaleX(-1);
  pointer-events: none;
}

.footer-grid button {
  display: block;
  min-height: 48px;
  max-width: 100%;
  padding: 0;
  color: inherit;
  font: inherit;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1.6px;
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color .2s ease;
}

.footer-grid button:hover {
  color: #f2d2af;
}

.footer-grid button:focus-visible {
  outline: 2px solid #f2d2af;
  outline-offset: 4px;
  border-radius: 2px;
}

.about-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 12px;
}

.download-links {
  display: flex;
  gap: 22px;
  margin-top: 29px;
}

.download-links button {
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 7px;
  width: 64px;
  min-height: 0;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
}

.download-links img {
  width: 49px;
  height: 49px;
  object-fit: contain;
  object-position: bottom;
}

.download-links button:first-child img {
  width: 42px;
}

.download-links button:last-child img {
  width: 39px;
}

.footer-bottom {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px 32px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-top: 14px;
  color: #fff;
  font-size: 14px;
  line-height: 48px;
  letter-spacing: 1.4px;
  border-top: 1px solid #1d5374;
}

.policy-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 32px;
}

.policy-links>span {
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .footer-grid {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, .9fr) minmax(0, 1.4fr);
    gap: 24px;
  }

  .footer-bottom {
    flex-wrap: wrap;
    line-height: 28px;
    padding-top: 20px;
  }
}

@media (max-width: 900px) {
  .site-footer {
    padding: 40px 24px 24px;
  }

  .footer-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr);
    gap: 32px 24px;
    min-height: 0;
    margin-bottom: 32px;
  }

  .footer-brand {
    grid-column: 1 / -1;
    padding-top: 0;
  }

  .slogan {
    width: min(340px, 100%);
  }

  .download-links {
    margin-top: 24px;
  }
}

@media (max-width: 600px) {
  .site-footer {
    padding-inline: 20px;
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .footer-grid section:last-child {
    grid-column: 1 / -1;
  }

  .about-links {
    max-width: 360px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 14px;
    font-size: 12px;
    line-height: 22px;
    letter-spacing: .6px;
  }

  .policy-links {
    gap: 8px 22px;
  }
}

:global(html[data-locale-layout='international'] .site-footer) {
  font-family: Georgia, serif;
}

:global(html[data-locale-layout='international'] .site-footer .footer-grid) {
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.4fr);
  gap: 28px;
}

:global(html[data-locale-layout='international'] .site-footer .brand) {
  font-size: 29px;
}

:global(html[data-locale-layout='international'] .site-footer .slogan) {
  width: min(300px, 100%);
  font-size: 15px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .site-footer button),
:global(html[data-locale-layout='international'] .site-footer .footer-bottom) {
  letter-spacing: 0;
  font-size: 13px;
}

:global(html[data-locale-layout='international'] .site-footer .download-links) {
  gap: 16px;
}

:global(html[data-locale-layout='international'] .site-footer .download-links button) {
  width: 80px;
}

@media (max-width: 1100px) {
  :global(html[data-locale-layout='international'] .site-footer .footer-grid) {
    grid-template-columns: 1fr 1fr 1.5fr;
  }

  :global(html[data-locale-layout='international'] .site-footer .footer-brand) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  :global(html[data-locale-layout='international'] .site-footer .footer-grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
}
</style>
