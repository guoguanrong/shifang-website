import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthModal } from '@/composables/useAuthModal'
import { useUserSession } from '@/composables/useUserSession'

// 使用 HTML5 History 模式管理站内页面与锚点导航。
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/tai-sui-zodiac',
      name: 'tai-sui-zodiac',
      component: () => import('@/views/TaiSuiZodiacView.vue'),
    },
    {
      path: '/account/verification',
      name: 'account-verification',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountVerificationView.vue'),
    },
    {
      path: '/account/certificates',
      name: 'account-certificates',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountCertificatesView.vue'),
    },
    {
      path: '/account/settings',
      name: 'account-settings',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountSettingsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    ...['legal', 'privacy', 'compliance'].map(kind => ({
      path: `/${kind}`,
      name: kind,
      component: () => import('@/views/PolicyView.vue'),
      props: { kind },
    })),
    {
      path: '/account/orders',
      name: 'account-orders',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountHistoryView.vue'),
      props: { kind: 'orders' },
    },
    {
      path: '/account/events',
      name: 'account-events',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountHistoryView.vue'),
      props: { kind: 'events' },
    },
    {
      path: '/account/lamps',
      name: 'account-lamps',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountRecordsView.vue'),
      props: { kind: 'lamps' },
    },
    {
      path: '/account/donations',
      name: 'account-donations',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountRecordsView.vue'),
      props: { kind: 'donations' },
    },
    {
      path: '/account/deities',
      name: 'account-deities',
      meta: { requiresAuth: true },
      component: () => import('@/views/AccountRecordsView.vue'),
      props: { kind: 'deities' },
    },
    {
      path: '/account/volunteer',
      name: 'account-volunteer',
      meta: { requiresAuth: true },
      component: () => import('@/views/VolunteerView.vue'),
    },
    {
      path: '/blessings/five-elements',
      name: 'five-elements-test',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/FiveElementsTestView.vue'),
    },
    {
      path: '/blessings/taoist-lots',
      name: 'taoist-lots',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/TaoistLotsView.vue'),
    },
    {
      path: '/blessings/fortune-review',
      name: 'fortune-review',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/FortuneReviewView.vue'),
    },
    {
      path: '/blessings/taoist-zodiac',
      name: 'taoist-zodiac',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/TaoistZodiacView.vue'),
    },
    {
      path: '/blessings/talisman',
      name: 'digital-talisman',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/DigitalTalismanView.vue'),
    },
    {
      path: '/blessings/seasonal-reminders',
      name: 'seasonal-reminders',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/SeasonalRemindersView.vue'),
    },
    {
      path: '/co-build/donation',
      name: 'donation',
      meta: { navigation: 'co-build' },
      component: () => import('@/views/DonationView.vue'),
    },
    // 首页：站点唯一入口，导航里的「首页」。
    {
      path: '/',
      name: 'home',
      // 首页是站点唯一入口，直接静态引入，避免首屏还要再拉一个 chunk
      // （懒加载在这里没有体积收益，反而多一个加载失败点）
      component: HomeView,
    },
    // 文化溯源：道教文化介绍页，导航里的「文化溯源」。
    {
      path: '/culture-origins',
      name: 'culture-origins',
      // 非首屏页面按需加载，减少首页首次下载体积。
      component: () => import('@/views/CultureOriginsView.vue'),
    },
    // 神祇百科：神像列表页，导航里的「神祇百科」。
    {
      path: '/deities',
      name: 'deities',
      // 神祇百科图片较多，使用路由级懒加载避免增加首页首包体积。
      component: () => import('@/views/DeitiesView.vue'),
    },
    // 神祇详情 · 斗姆元君：静态路径版本，与下面的动态参数版共用同一组件。
    {
      path: '/deities/doumu',
      name: 'deity-doumu',
      meta: { navigation: 'deities' },
      component: () => import('@/views/DeityDetailView.vue'),
    },
    // 神祇详情 · 其余神祇：通过 :deityId 动态匹配，枚举值保证非法地址走兜底重定向。
    {
      path: '/deities/:deityId(beidou|taisui|sanguan|wenchang|kuixing|zhaogongming|wanglingguan|guansheng|dongyue|leizun|fanli|tudigong)',
      name: 'deity-detail',
      props: true,
      meta: { navigation: 'deities' },
      component: () => import('@/views/DeityDetailView.vue'),
    },
    // 参拜礼仪：上香许愿与参拜神像的仪轨说明页，导航里的「参拜礼仪」。
    {
      path: '/etiquette',
      name: 'etiquette',
      // 参拜礼仪包含较多原型切图，继续使用路由级懒加载控制首页体积。
      component: () => import('@/views/EtiquetteView.vue'),
    },
    // 道法养生：养生理念与实践页，导航里的「道法养生」。
    {
      path: '/wellness',
      name: 'wellness',
      // 道法养生页图片资源较多，使用路由级懒加载保持首页首包轻量。
      component: () => import('@/views/WellnessView.vue'),
    },
    // 跟练视频详情：养生功法的视频正文页。
    {
      path: '/wellness/practice',
      name: 'wellness-practice-detail',
      component: () => import('@/views/WellnessPracticeDetailView.vue'),
    },
    // 道典精读详情：养生知识的文章正文页。
    {
      path: '/wellness/knowledge',
      name: 'wellness-knowledge-detail',
      component: () => import('@/views/WellnessKnowledgeDetailView.vue'),
    },
    // 共建十方：公益共建与功德介绍页，导航里的「共建十方」。
    {
      path: '/co-build',
      name: 'co-build',
      // 共建十方包含大量项目与功德展示资源，继续采用路由级懒加载。
      component: () => import('@/views/CoBuildView.vue'),
    },
    // 云端共筑：修缮工程直播与资金透明页，导航里的「云端共筑」。
    {
      path: '/cloud-build',
      name: 'cloud-build',
      // 云端共筑包含高清监控资源，按路由拆分以免增加其他页面的首包体积。
      component: () => import('@/views/CloudBuildView.vue'),
    },
    // 祈福纳祥：线上点灯、求签等祈福服务页，导航里的「祈福纳祥」。
    {
      path: '/blessings',
      name: 'blessings',
      component: () => import('@/views/BlessingsView.vue'),
    },
    // 资金明细：云端共筑的二级页，对应「查看资金明细」按钮。
    {
      path: '/cloud-build/fund-details',
      name: 'fund-details',
      meta: { navigation: 'cloud-build' },
      component: () => import('@/views/FundDetailsView.vue'),
    },
    // 道会活动：近期道会与法会排期页，导航里的「道会活动」。
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/EventsView.vue'),
    },
    // 道会日程：近期「查看更多」，活动列表每页 9 条。
    {
      path: '/events/schedule',
      name: 'event-schedule',
      meta: { navigation: 'events' },
      props: { isFuture: 0 },
      component: () => import('@/views/EventScheduleView.vue'),
    },
    // 未来规划日程：未来道会「查看更多」，同样分页，每页 9 条。
    {
      path: '/events/schedule/future',
      name: 'event-schedule-future',
      meta: { navigation: 'events' },
      props: { isFuture: 1 },
      component: () => import('@/views/EventScheduleView.vue'),
    },
    // 道会详情：从活动卡片「了解详情」进入，按活动 id 拉取内容。
    {
      path: '/events/:id',
      name: 'event-detail',
      meta: { navigation: 'events' },
      component: () => import('@/views/EventDetailView.vue'),
    },
    // 供灯祈福：祈福纳祥的二级页，展示各类灯供。
    {
      path: '/blessings/lamps',
      name: 'lamp-offerings',
      meta: { navigation: 'blessings' },
      component: () => import('@/views/LampOfferingsView.vue'),
    },
    // 神像供奉：神祇百科的二级页，展示神像认供方式。
    {
      path: '/deities/offering',
      name: 'deity-offering',
      meta: { navigation: 'deities' },
      component: () => import('@/views/DeityOfferingView.vue'),
    },
    {
      path: '/blessings/lamps/:lampId([a-z0-9-]+)',
      name: 'lamp-detail',
      props: true,
      meta: { navigation: 'blessings' },
      component: () => import('@/views/LampDetailView.vue'),
    },
    // 信众实录：真实案例与口碑页。
    {
      path: '/testimonials',
      name: 'testimonials',
      component: () => import('@/views/TestimonialsView.vue'),
    },
    // 各界寄语：文化学者与社会各界题词页。
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/MessagesView.vue'),
    },
    // 寄语详情 · 视频：各界寄语中的视频条目详情。
    {
      path: '/messages/video',
      name: 'message-video-detail',
      component: () => import('@/views/MessageVideoDetailView.vue'),
    },
    // 寄语详情 · 图文：各界寄语中的文字条目详情。
    {
      path: '/messages/article',
      name: 'message-article-detail',
      component: () => import('@/views/MessageArticleDetailView.vue'),
    },
    // 最新动态：平台资讯列表页。
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsView.vue'),
    },
    // 动态详情：最新动态的正文页。
    {
      path: '/news/detail',
      name: 'news-detail',
      component: () => import('@/views/NewsDetailView.vue'),
    },
    // 兜底路由：未匹配的地址统一回到首页，避免出现空白页面。
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from) {
    if (to.name === 'donation' && from.name === 'donation') return false
    // 路由带 hash 时平滑滚动至对应模块，否则从页面顶部开始。
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    return { top: 0 }
  },
})

const { hasAuthenticatedSession } = useUserSession()
const { openAuthModal } = useAuthModal()

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth || await hasAuthenticatedSession()) return true

  const requestedPath = to.fullPath
  openAuthModal('login', () => router.replace(requestedPath))
  return { name: 'home' }
})

export default router
