<template>
  <!-- 应用根布局：具体页面由 Vue Router 注入到 RouterView。 -->
  <div class="app-layout site">
    <main class="app-layout__main">
      <RouterView />
    </main>
  </div>
  <SiteQuickActions />
  <AuthModal />
  <StripeReturnDialog />
</template>

<script setup>
// 根组件只负责承载路由页面，不在这里放业务状态。
import { RouterView } from 'vue-router'
import AuthModal from '@/components/auth/AuthModal.vue'
import SiteQuickActions from '@/components/common/SiteQuickActions.vue'
import StripeReturnDialog from '@/components/offerings/StripeReturnDialog.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.app-layout__main {
  flex: 1;
}
</style>
