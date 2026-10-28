<template>
  <header ref="headerRef" class="site-header" :class="{ 'is-scrolled': headerScrolled, 'has-account': isLoggedIn }">
    <!-- 品牌入口：在任意页面点击后回到首页顶部。 -->
    <a class="brand" href="#top" @click.prevent="navigateTo('top')">
      {{ t('footer.logo') }}
    </a>

    <!-- 移动端汉堡按钮与桌面端共用同一组导航内容。 -->
    <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-label="打开导航" @click="menuOpen = !menuOpen"><span /><span /><span /></button>
    <nav class="desktop-nav" :class="{ 'is-open': menuOpen }" :style="navigationStyle" aria-label="Primary navigation">
      <!-- “关于我们”拥有二级菜单，同时支持鼠标悬停与点击操作。 -->
      <div
        class="about-nav-item"
        @pointerenter="openAboutMenuOnHover"
        @pointerleave="closeAboutMenuOnHover"
      >
        <button
          class="about-trigger"
          :class="{ 'is-active': aboutMenuOpen }"
          type="button"
          aria-haspopup="menu"
          aria-controls="about-dropdown"
          :aria-expanded="aboutMenuOpen"
          @click="handleAboutTriggerClick"
        >
          {{ navigationItems[0] }}
          <span class="dropdown-chevron" aria-hidden="true" />
        </button>

        <Transition name="dropdown">
          <div v-if="aboutMenuOpen" id="about-dropdown" class="about-dropdown" role="menu">
            <button
              v-for="item in aboutMenuItems"
              :key="item.target"
              type="button"
              role="menuitem"
              @click="navigateTo(item.target); aboutMenuOpen = false; menuOpen = false"
            >
              {{ item.label }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- 其余一级菜单根据 target 决定跳转路由或滚动锚点。 -->
      <button
        v-for="(item, index) in navigationItems.slice(1)"
        :key="item"
        :class="{ 'is-current': isCurrentNavigation(navigationTargets[index + 1]) }"
        type="button"
        @click="navigateTo(navigationTargets[index + 1]); aboutMenuOpen = false; menuOpen = false"
      >
        {{ item }}
      </button>
    </nav>

    <!-- 语言切换和账户操作区域。 -->
    <div class="header-actions">
      <label class="language-select">
        <span class="sr-only">{{ t('nav.lang') }}</span>
        <select :value="locale" @change="$emit('select-locale', $event.target.value)">
          <option v-for="option in localeOptions" :key="option.code" :value="option.code">
            {{ option.label }}
          </option>
        </select>
      </label>
      <AccountMenu v-if="isLoggedIn" @open="menuOpen = false; aboutMenuOpen = false" @logout="focusLogin" />
      <button v-else class="login-button" type="button" @click="openAuthModal('login')">
        <img class="login-button-text" :src="loginButtonText" alt="" aria-hidden="true" />
        <span class="sr-only">{{ t('nav.login') }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { localeOptions } from '@/i18n'
import { useAuthModal } from '@/composables/useAuthModal'
import { useUserSession } from '@/composables/useUserSession'
import AccountMenu from '@/components/auth/AccountMenu.vue'
import loginButtonText from '@/assets/cuts/login-button-text.png'
import navigationDecoration from '@/assets/images/Group 138.png'

defineEmits(['navigate', 'select-locale'])

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { openAuthModal } = useAuthModal()
const { isLoggedIn } = useUserSession()
const menuOpen = ref(false)
const aboutMenuOpen = ref(false)
const headerScrolled = ref(false)
const headerRef = ref(null)

async function focusLogin() {
  await nextTick()
  headerRef.value?.querySelector('.login-button')?.focus()
}
// 导航装饰线使用设计稿切图，交给伪元素统一控制悬停与当前页状态。
const navigationStyle = { '--navigation-decoration': `url("${navigationDecoration}")` }

// target 是实际导航标识，显示名称从当前语言包按相同顺序读取。
const navigationTargets = ['about', 'culture', 'deities', 'etiquette', 'community', 'blessings', 'events']
const navigationItems = computed(() => navigationTargets.map((_, index) => t(`nav.items[${index}]`)))
const aboutMenuItems = computed(() => [
  { label: t('about.title'), target: 'about' },
  { label: t('templePlan.title'), target: 'temple-plan' },
  // { label: t('mission.title'), target: 'mission' },
  { label: t('admonitions.title'), target: 'organization' },
  // 资金监管入口暂不显示；当前此处链接到首页玄门四箴。
  // { label: t('supervision.title'), target: 'supervision' },
  { label: t('seasonal.title'), target: 'seasonal' },
  // { label: t('testimonials.title'), target: 'testimonials' },
  // { label: t('messages.title'), target: 'messages' },
  { label: t('homeActivity.title'), target: 'news' },
  { label: t('milestones.title'), target: 'milestones' },
])

// 点击导航外部或按 Escape 时关闭“关于我们”下拉菜单。
function closeAboutMenu(event) {
  if (event.type === 'keydown' && event.key !== 'Escape') return
  if (event.type === 'click' && headerRef.value?.contains(event.target)) return
  aboutMenuOpen.value = false
}

// 仅让鼠标悬停触发展开，触屏设备继续使用点击交互。
function openAboutMenuOnHover(event) {
  if (event.pointerType === 'mouse') aboutMenuOpen.value = true
}

function closeAboutMenuOnHover(event) {
  if (event.pointerType === 'mouse') aboutMenuOpen.value = false
}

// 点击「关于我们」进入首页的关于我们版块；
// 菜单未展开时（触屏首次点按、键盘回车）先展开二级菜单，避免触屏用户点不到子项。
function handleAboutTriggerClick() {
  if (!aboutMenuOpen.value) {
    aboutMenuOpen.value = true
    return
  }

  aboutMenuOpen.value = false
  menuOpen.value = false
  navigateTo('about')
}

// 页面离开顶部后为固定导航增加滚动态外观。
function updateHeaderState() {
  headerScrolled.value = window.scrollY > 12
}

// 独立页面路由与导航 target 的映射集中在一处，后续新增内页不再扩散模板判断。
function isCurrentNavigation(target) {
  const routeByTarget = { culture: 'culture-origins', deities: 'deities', etiquette: 'etiquette', community: 'co-build', 'cloud-build': 'cloud-build', blessings: 'blessings', events: 'events', testimonials: 'testimonials', messages: 'messages', news: 'news' }
  return routeByTarget[target] === (route.meta.navigation || route.name)
}

onMounted(() => {
  // 全局点击/键盘事件负责收起下拉菜单，滚动事件负责更新头部状态。
  document.addEventListener('click', closeAboutMenu)
  document.addEventListener('keydown', closeAboutMenu)
  window.addEventListener('scroll', updateHeaderState, { passive: true })
  updateHeaderState()
})

onBeforeUnmount(() => {
  // 组件卸载时成对清理所有全局事件监听。
  document.removeEventListener('click', closeAboutMenu)
  document.removeEventListener('keydown', closeAboutMenu)
  window.removeEventListener('scroll', updateHeaderState)
})

async function navigateTo(sectionId) {
  // 已落地的内容页使用独立路由；信众实录 / 各界寄语 / 最新动态仍以首页版块为准，平滑滚动定位。
  const routeByTarget = { culture: 'culture-origins', deities: 'deities', etiquette: 'etiquette', community: 'co-build', 'cloud-build': 'cloud-build', blessings: 'blessings', events: 'events' }
  if (routeByTarget[sectionId]) {
    await router.push({ name: routeByTarget[sectionId] })
    return
  }

  if (sectionId === 'top') {
    // 从内页点击品牌时先返回首页，再平滑回到页面顶部。
    if (route.name !== 'home') await router.push({ name: 'home' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (route.name !== 'home') {
    // 从内页访问首页模块时通过 hash 交给路由滚动行为定位。
    await router.push({ name: 'home', hash: `#${sectionId}` })
    return
  }

  // 已在首页时直接滚动，避免产生一次多余的路由跳转。
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.site-header {
  position: sticky;
  z-index: 1000;
  top: 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 100px;
  padding: 0 max(6vw, 100px);
  color: #fff;
  background: rgba(29, 78, 110, 0.96);
  backdrop-filter: blur(12px);
  transition: background-color .25s ease, box-shadow .25s ease;
}

.site-header.is-scrolled {
  background: rgba(29, 78, 110, .985);
  box-shadow: 0 8px 24px rgba(13, 35, 50, .2);
}

.brand {
  flex: 0 0 auto;
  color: inherit;
  font-family: var(--font-calligraphy);
  font-size: 36px;
  text-decoration: none;
}

.desktop-nav {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 40px;
  overflow: visible;
  font-family: 'emoji';
}

button {
  font: inherit;
}

.desktop-nav button {
  position: relative;
  padding: 0;
  color: inherit;
  white-space: nowrap;
  background: none;
  border: 0;
  cursor: pointer;
}

.desktop-nav > button {
  transition: color .18s ease;
}

.desktop-nav > button::after,
.desktop-nav .about-trigger::after {
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 154px;
  height: 9px;
  content: '';
  pointer-events: none;
  background: var(--navigation-decoration) center / contain no-repeat;
  opacity: 0;
  transform: translateX(-50%) scaleX(.72);
  transform-origin: center center;
  transition: opacity .18s ease, transform .24s ease;
}

.desktop-nav > button:hover {
  color: #fff;
}

.desktop-nav > button:hover::after,
.desktop-nav > button:focus-visible::after,
.desktop-nav > button.is-current::after,
.desktop-nav .about-trigger:hover::after,
.desktop-nav .about-trigger:focus-visible::after,
.desktop-nav .about-trigger.is-active::after {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

.desktop-nav > button.is-current { color: #fff; }

.about-nav-item {
  position: relative;
  flex: 0 0 auto;
}

.desktop-nav .about-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  padding: 8px 14px;
  border-radius: 8px;
  transition: color .18s ease, background-color .18s ease;
}

.desktop-nav .about-trigger:hover,
.desktop-nav .about-trigger.is-active {
  color: #fff;
  background: transparent;
}

.dropdown-chevron {
  width: 7px;
  height: 7px;
  margin-top: -3px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform .18s ease, margin .18s ease;
}

.about-trigger.is-active .dropdown-chevron {
  margin-top: 3px;
  transform: rotate(225deg);
}

.about-dropdown {
  position: absolute;
  z-index: 50;
  top: calc(100% + 8px);
  left: 0;
  width: 154px;
  padding: 8px 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(29, 78, 110, .1);
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(16, 31, 42, .18), 0 2px 8px rgba(16, 31, 42, .08);
}

.desktop-nav .about-dropdown button {
  display: block;
  width: 100%;
  min-height: 38px;
  padding: 9px 18px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  transition: color .15s ease, background-color .15s ease;
}

.desktop-nav .about-dropdown button:hover,
.desktop-nav .about-dropdown button:focus-visible {
  color: #1d4e6e;
  background: #f8f5ed;
  outline: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity .16s ease, transform .16s ease;
  transform-origin: top left;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(.98);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-select select {
  max-width: 7.25rem;
  min-width: 97px; padding: 5px 1.8rem 5px .75rem;
  color: #fff;
  font: inherit;
  cursor: pointer;
  appearance: none;
  background: #1d4e6e url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='white' d='m1 1 5 5 5-5 1 1-6 6L0 2z'/%3E%3C/svg%3E") no-repeat right 0.65rem center;
  border: 1px solid #6fa2c4;
  border-radius: 30px;
}

.language-select select:focus-visible {
  outline: 2px solid #f2d2af;
  outline-offset: 2px;
}

.language-select select:hover {
  border-color: #f2d2af;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 背景切图已移除：按钮由“登录”文字切图撑起，尺寸与旁边的语言选择框对齐。 */
.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: filter .18s ease, transform .18s ease;
}

.login-button:hover {
  filter: brightness(1.08);
}

.login-button:active {
  filter: brightness(.95);
  transform: scale(.98);
}

.login-button:focus-visible {
  outline: 2px solid #f2d2af;
  outline-offset: 2px;
}

/* 文字切图（200x92 透明底）等比缩放，高度与旁边的语言选择框一致。 */
.login-button-text {
      display: block;
    width: auto;
    height: 48px;
    margin-top: 10px;
}

.menu-toggle { display: none; }

/* 桌面内容宽上限 1440px：108（品牌）+ 51 + 导航（自适应）+ 38 + 211（操作区）。 */
@media (min-width: 1281px) {
  .site-header {
    gap: 0;
    /* 左右留白至少 32px，视口足够宽时内容区稳定在 1440px 并居中。 */
    padding-inline: max(32px, calc((100vw - 1440px) / 2));
  }

  .brand { width: 108px; }

  .desktop-nav {
    flex: 1;
    min-width: 0;
    justify-content: space-between;
    gap: 0;
    margin-left: 51px;
  }

  .desktop-nav .about-trigger { padding-inline: 0; }

  .header-actions {
    gap: 14px;
    margin-left: 38px;
  }
}

@media (min-width: 1181px) and (max-width: 1280px) {
  .site-header {
    gap: 26px;
    padding-inline: 30px;
  }

  .brand {
    font-size: 30px;
  }

  .desktop-nav {
    justify-content: flex-start;
    gap: 24px;
  }

  .header-actions {
    display: none;
  }

  .desktop-nav .about-trigger {
    padding-inline: 8px;
  }
}

@media (max-width: 1180px) {
  .site-header { gap: 10px; min-height: 64px; padding-inline: 18px; } .brand { font-size: 25px; } .menu-toggle { order: 3; display: grid; gap: 4px; padding: 8px; margin-left: 0; color: #fff; background: none; border: 0; } .menu-toggle span { display: block; width: 22px; height: 2px; background: currentColor; } .desktop-nav {
    position: absolute;
    top: 64px;
    left: 0;
    display: none;
    width: 100%;
    /* 条目较多时面板内部滚动，避免最后几行被屏幕底边裁掉且无法触达。 */
    max-height: calc(100vh - 64px);
    max-height: calc(100dvh - 64px);
    padding: 10px 20px 16px;
    /* 覆盖桌面横排的 40px 间距：两列栅格里它会让行列都过于松散。 */
    gap: 4px 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: #1d4e6e;
    box-shadow: 0 10px 20px rgba(0,0,0,.18);
  } .desktop-nav.is-open { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); align-content: start; } .desktop-nav button { min-height: 40px; text-align: left; } .about-nav-item { grid-column: 1 / -1; } .desktop-nav .about-trigger { width: 100%; padding-inline: 0; justify-content: space-between; } .about-dropdown { position: static; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); width: 100%; margin-top: 5px; } .header-actions { order: 2; display: flex; gap: 7px; margin-left: auto; } .language-select select { min-width: 0; max-width: 104px; padding-block: 6px; font-size: 13px; }

  /* 移动端使用整行点击区域，不显示只为桌面端设计的横向装饰切图。 */
  .desktop-nav > button::after,
  .desktop-nav .about-trigger::after { display: none; }
}

@media (max-width: 420px) {
  .site-header { padding-inline: 12px; }
  .brand { font-size: 21px; }
  .language-select select { max-width: 96px; font-size: 12px; }
}
</style>
