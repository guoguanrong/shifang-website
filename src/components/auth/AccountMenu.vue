<template>
  <!-- 头像入口：鼠标悬停即弹出账户卡片；触屏与键盘仍走 click 开关。
       面板用 Teleport 挂到 body，避免被页头的层叠上下文裁切。 -->
  <button ref="trigger" class="account-trigger" type="button" aria-haspopup="dialog" :aria-expanded="isOpen"
    :aria-controls="dialogId" :aria-label="t('portal.account.open', { name: user.name })"
    @pointerenter="onTriggerEnter" @pointerleave="onTriggerLeave" @click="toggle">
    <img :src="avatarSrc" alt="" width="36" height="36" @error="onAvatarError" />
    <span :title="user.name">{{ user.name }}</span>
  </button>

  <Teleport to="body">
    <!-- 卡片本身也参与悬停判定：移入取消关闭计时，移出再延时收起。 -->
    <dialog :id="dialogId" ref="dialog" class="account-dialog" :aria-label="t('portal.account.title')"
      :style="position" @pointerenter="onCardEnter" @pointerleave="onCardLeave"
      @close="onClose" @cancel.prevent="close" @click="onBackdrop">
      <div class="account-card">
        <!-- 顶部资料区：头像、昵称、实名状态与会员编号。 -->
        <header class="account-profile">
          <button class="account-close" type="button" autofocus :aria-label="t('portal.common.close')" @click="close">×</button>
          <img class="account-avatar" :src="avatarSrc" alt="" width="128" height="128" @error="onAvatarError" />
          <div class="account-identity">
            <h2>{{ user.name }}</h2>
            <!-- 实名状态入口与个人设置共用认证页面。 -->
            <RouterLink class="account-verification" to="/account/verification" @click="close">
              <img :src="verifiedIcon" alt="" />{{ t(`portal.account.${user.verified ? 'verified' : 'unverified'}`) }}<span aria-hidden="true">›</span>
            </RouterLink>
          </div>
          <p>{{ t('portal.account.member') }} · ID {{ user.id || '—' }}</p>
        </header>

        <div class="account-body">
          <!-- 三项数据概览：供灯、捐赠次数、供奉，来自当前登录会员信息。 -->
          <nav class="account-statistics" :aria-label="t('accountPages.records.navigation')">
            <RouterLink v-for="stat in statistics" :key="stat.id" :to="stat.to" @click="close">
              <span class="account-stat-number"><CountUp :value="statValue(stat.id)" :active="isOpen" /></span>
              <span class="account-stat-label">{{ t(`portal.account.${stat.id}`) }}</span>
            </RouterLink>
          </nav>

          <!-- 义工专区单独成组，与下方服务列表区分主次。 -->
          <section class="account-section">
            <h3>{{ t('portal.account.volunteerGroup') }}</h3>
            <RouterLink class="account-service account-volunteer" to="/account/volunteer" @click="close">
              <span class="account-service-title"><img :src="volunteerIcon" alt="" />{{ t('portal.account.volunteer') }}</span>
              <span class="account-service-description">{{ t('portal.account.volunteerDescription') }}</span>
            </RouterLink>
          </section>

          <section class="account-section">
            <h3>{{ t('portal.account.services') }}</h3>
            <div class="account-services">
              <!-- 有 to 的项渲染成 RouterLink 并关闭面板；未实现的项渲染成 button，
                   点击后在下方给出「暂未开放」提示，而不是直接跳走。 -->
              <component :is="service.to ? RouterLink : 'button'" v-for="service in services" :key="service.id" class="account-service"
                :to="service.to" :type="service.to ? undefined : 'button'" @click="service.to ? close() : selectService(service.id)">
                <span class="account-service-title"><img :src="service.icon" alt="" />{{ t(`portal.account.${service.id}`) }}</span>
                <span class="account-service-description">{{ t(`portal.account.${service.id}Description`) }}</span>
              </component>
            </div>
          </section>

          <!-- 未开放服务的提示条：role="status" 让读屏用户也能听到反馈。 -->
          <p v-if="selectedService" ref="notice" class="account-notice" role="status">
            {{ t('portal.account.unavailable', { service: t(`portal.account.${selectedService}`) }) }}
          </p>
          <footer class="account-footer">
            <button class="account-logout" type="button" @click="logout"><img :src="logoutIcon" alt="" />{{ t('portal.account.logout') }}</button>
          </footer>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import { useUserSession } from '@/composables/useUserSession'
import { listSelfOrder } from '@/api/order'
import CountUp from '@/components/common/CountUp.vue'
import defaultAvatar from '@/assets/account/avatar.webp'
import verifiedIcon from '@/assets/account/verified.svg'
import volunteerIcon from '@/assets/account/volunteer.svg'
import ordersIcon from '@/assets/account/orders.svg'
import eventsIcon from '@/assets/account/events.svg'
import certificatesIcon from '@/assets/account/certificates.svg'
import settingsIcon from '@/assets/account/settings.svg'
import logoutIcon from '@/assets/account/logout.svg'
import '@/styles/account-menu.css'

// 悬停收起延时：头像与卡片之间有间距，留出鼠标移入卡片的时间，避免闪断。
const HOVER_CLOSE_DELAY = 220

const emit = defineEmits(['open', 'logout'])
const { t } = useI18n()
const route = useRoute()
// 登录用户信息与退出方法由全局会话 composable 提供。
const { user, refreshMemberInfo, signOut } = useUserSession()
const avatarBroken = ref(false)
const avatarSrc = computed(() => (!avatarBroken.value && user.value?.avatar) || defaultAvatar)

watch(() => user.value?.avatar, () => {
  avatarBroken.value = false
})
const statKeys = { lampCount: 'lightCount', donationCount: 'donateCount', deityCount: 'worshipCount' }
const orderTypes = { lampCount: 1, deityCount: 2, donationCount: 3 }
const orderCounts = ref({})

function statValue(id) {
  const fromOrders = orderCounts.value[id]
  if (Number.isFinite(fromOrders)) return fromOrders
  const value = Number(user.value?.[statKeys[id]])
  return Number.isFinite(value) ? value : 0
}

// 三项数字取自会员自己的订单总数：供灯 type 1，供奉 type 2，捐款 type 3。
async function loadOrderCounts() {
  await Promise.all(Object.entries(orderTypes).map(async ([id, type]) => {
    try {
      const result = await listSelfOrder({ type, page: 1, pageSize: 1 }, { silent: true })
      const total = Number(result?.totalRow ?? result?.total ?? result?.totalCount)
      if (Number.isFinite(total)) orderCounts.value = { ...orderCounts.value, [id]: total }
    } catch {
      // 未登录或接口失败时，继续显示会员资料里的数字。
    }
  }))
}

function onAvatarError() {
  avatarBroken.value = true
}
const dialogId = `account-${useId()}`
const trigger = ref(null)
const dialog = ref(null)
const notice = ref(null)
const isOpen = ref(false)
// 已点击但尚未开放的服务，用于在面板底部展示提示。
const selectedService = ref('')
// 卡片的定位样式，随触发按钮的位置实时计算。
const position = ref({})
// 数据概览与服务入口；缺少 to 的条目视为「建设中」，点击只给提示。
const statistics = [{ id: 'lampCount', to: '/account/lamps' }, { id: 'donationCount', to: '/account/donations' }, { id: 'deityCount', to: '/account/deities' }]
const services = [
  { id: 'orders', icon: ordersIcon, to: '/account/orders' },
  { id: 'events', icon: eventsIcon, to: '/account/events' },
  { id: 'certificates', icon: certificatesIcon, to: '/account/certificates' },
  { id: 'settings', icon: settingsIcon, to: '/account/settings' },
]
// 打开前的页面滚动状态，用于关闭时恢复；悬停打开时不改动它。
let previousOverflow = ''
// 悬停关闭计时器与「是否由本次打开锁定了滚动」的标记。
let hoverCloseTimer = null
let scrollLocked = false

// 依据触发按钮的位置计算卡片坐标，并夹在可视区内；
// 移动端浏览器地址栏伸缩会改变可视高度，因此优先使用 visualViewport。
function updatePosition() {
  if (!trigger.value) return
  const anchor = trigger.value.getBoundingClientRect()
  const viewport = window.visualViewport
  const width = viewport?.width || window.innerWidth
  const height = viewport?.height || window.innerHeight
  const offsetTop = viewport?.offsetTop || 0
  const cardWidth = Math.min(424, width - 40)
  const left = Math.max(20, Math.min(anchor.right - cardWidth, width - cardWidth - 20))
  const top = Math.max(12, Math.min(anchor.bottom + 12, height - 180)) + offsetTop
  position.value = {
    left: `${left}px`, top: `${top}px`, width: `${cardWidth}px`,
    // 底部只留 12px 余量，尽量让内容在一屏内显示完，避免出现滚动。
    '--account-max-height': `${height + offsetTop - top - 12}px`,
    '--account-arrow-left': `${Math.max(24, Math.min(cardWidth - 24, anchor.left + anchor.width / 2 - left))}px`,
  }
}

// 取消待执行的悬停关闭（鼠标重新进入头像或卡片时调用）。
function cancelHoverClose() {
  if (hoverCloseTimer === null) return
  window.clearTimeout(hoverCloseTimer)
  hoverCloseTimer = null
}

// 鼠标离开后延时收起卡片。
function scheduleHoverClose() {
  cancelHoverClose()
  hoverCloseTimer = window.setTimeout(close, HOVER_CLOSE_DELAY)
}

// 悬停打开：触屏没有悬停语义（pointerenter 只在点按时触发），交给 click 的开关逻辑。
function onTriggerEnter(event) {
  if (event.pointerType !== 'mouse') return
  cancelHoverClose()
  open({ lockScroll: false })
}

function onTriggerLeave(event) {
  if (event.pointerType !== 'mouse') return
  scheduleHoverClose()
}

// 鼠标移入卡片：取消「离开头像」触发的收起计时。
function onCardEnter(event) {
  if (event.pointerType !== 'mouse') return
  cancelHoverClose()
}

// 鼠标移出卡片：同样延时收起，移回头像即可取消。
function onCardLeave(event) {
  if (event.pointerType !== 'mouse') return
  scheduleHoverClose()
}

// 点击（键盘 Enter / Space 也走这里）保持开关语义。
function toggle() {
  if (isOpen.value) close()
  else open()
}

/**
 * 打开卡片。
 * @param {{ lockScroll?: boolean }} options 悬停打开时传 lockScroll: false ——
 *   否则鼠标停在头像上就会锁住整页滚动。
 */
function open({ lockScroll = true } = {}, retried = false) {
  if (isOpen.value) return
  // Teleport 到 body 的 dialog 在刚挂载或热更新后可能还没写上 ref，悬停会早于它一步。
  const panel = dialog.value
  if (!panel) {
    if (!retried) nextTick(() => open({ lockScroll }, true))
    return
  }
  selectedService.value = ''
  refreshMemberInfo()
  updatePosition()
  if (lockScroll) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scrollLocked = true
  }
  try {
    if (!panel.open) panel.showModal()
  } catch {
    if (scrollLocked) {
      document.body.style.overflow = previousOverflow
      scrollLocked = false
    }
    return
  }
  isOpen.value = true
  loadOrderCounts()
  window.addEventListener('resize', updatePosition)
  window.visualViewport?.addEventListener('resize', updatePosition)
  // 悬停打开时页面仍可滚动，滚动会让卡片与头像错位，因此滚动即收起。
  window.addEventListener('scroll', close, { passive: true })
  emit('open')
}

function close() {
  dialog.value?.close()
  onClose()
}

// 收起时统一清理：恢复滚动、移除监听与计时器。重复调用安全。
function onClose() {
  if (!isOpen.value) return
  isOpen.value = false
  cancelHoverClose()
  if (scrollLocked) {
    document.body.style.overflow = previousOverflow
    scrollLocked = false
  }
  window.removeEventListener('resize', updatePosition)
  window.visualViewport?.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', close)
}

// 点击卡片之外的遮罩区域时收起。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const bounds = dialog.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close()
}

// 点击未开放的服务：记录并在下一帧把提示条滚动到可视区域。
async function selectService(service) {
  selectedService.value = service
  await nextTick()
  notice.value?.scrollIntoView({ block: 'nearest' })
}

// 退出登录：先收起面板，再清会话并通知父级。
function logout() {
  close()
  onClose()
  signOut()
  emit('logout')
}

// 路由变化时收起，避免跳转后卡片仍浮在页面上。
watch(() => route.fullPath, close)
onBeforeUnmount(() => {
  close()
  onClose()
})
</script>
