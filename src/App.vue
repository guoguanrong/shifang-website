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
  <PaypalReturnDialog />
</template>

<script setup>
// 根组件只负责承载路由页面，不在这里放业务状态。
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AuthModal from '@/components/auth/AuthModal.vue'
import SiteQuickActions from '@/components/common/SiteQuickActions.vue'
import StripeReturnDialog from '@/components/offerings/StripeReturnDialog.vue'
import PaypalReturnDialog from '@/components/co-build/PaypalReturnDialog.vue'
import { ensureUvid, recordVisitor } from '@/api/visitor'

// 进站访客统计：确保拿到 uvid（后端生成、本地缓存）后上报一次「记录游客」；
// 静默执行，失败不影响页面使用。之后注册与未登录下单复用同一 uvid。
onMounted(async () => {
  try {
    const uvid = await ensureUvid()
    if (uvid) await recordVisitor({ uvid, source: 'web' })
  } catch {
    // 访客统计失败不阻塞进站。
  }
})
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
