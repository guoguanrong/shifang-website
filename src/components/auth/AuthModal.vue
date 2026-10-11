<template>
  <!-- 登录/注册弹窗：挂到 body 上，开关状态由 useAuthModal 这个全局 composable 提供。 -->
  <Teleport to="body">
    <Transition name="auth-modal">
      <!-- 点击遮罩本身即关闭；面板内部的点击不会冒泡到遮罩。 -->
      <div v-if="isOpen" class="auth-modal" @click.self="closeAuthModal">
        <!-- :key="mode" 让切换登录/注册时重建面板，重置表单与倒计时。 -->
        <AuthPanel
          :key="mode"
          :mode="mode"
          @close="closeAuthModal"
          @switch-mode="switchAuthMode"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'
import AuthPanel from './AuthPanel.vue'
import { useAuthModal } from '@/composables/useAuthModal'

const { isOpen, mode, closeAuthModal, switchAuthMode } = useAuthModal()

// 按 Esc 关闭弹窗。
function closeOnEscape(event) {
  if (event.key === 'Escape' && isOpen.value) closeAuthModal()
}

// 打开时给 body 加类，用于锁定页面滚动。
watch(isOpen, (open) => {
  document.body.classList.toggle('has-auth-modal', open)
})

// 卸载时移除监听并确保滚动锁定被解除。
onMounted(() => document.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', closeOnEscape)
  document.body.classList.remove('has-auth-modal')
})
</script>

<style scoped>
/* 全屏遮罩：内容超长时自身可滚动。 */
.auth-modal {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: grid;
  overflow-y: auto;
  padding: clamp(76px, 12vh, 140px) 16px 48px;
  place-items: start center;
  background: rgba(16, 24, 28, .62);
  backdrop-filter: blur(1.5px);
}

/* 进出场：遮罩淡入淡出，面板同时轻微上移缩放。 */
.auth-modal-enter-active,
.auth-modal-leave-active { transition: opacity .22s ease; }
.auth-modal-enter-active :deep(.auth-panel),
.auth-modal-leave-active :deep(.auth-panel) { transition: transform .22s ease, opacity .22s ease; }
.auth-modal-enter-from,
.auth-modal-leave-to { opacity: 0; }
.auth-modal-enter-from :deep(.auth-panel),
.auth-modal-leave-to :deep(.auth-panel) { opacity: 0; transform: translateY(16px) scale(.98); }

@media (max-width: 600px) {
  .auth-modal { padding: 76px 16px 24px; }
}
</style>

<!-- 全局样式：弹窗打开期间锁定页面滚动。 -->
<style>
body.has-auth-modal { overflow: hidden; }
</style>
