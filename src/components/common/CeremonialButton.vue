<template>
  <!-- 仪式感按钮：金边与两端纹样由 CSS 生成，文案放在 span 内以保证层级正确。传入 to 时改为路由链接。 -->
  <component :is="to ? RouterLink : 'button'" class="ceremonial-button" :to="to || undefined" :type="to ? undefined : 'button'"><span>{{ label }}</span></component>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  label: { type: String, required: true },
  to: { type: [String, Object], default: undefined },
})
</script>

<style scoped>
.ceremonial-button { position:relative; display:inline-flex; align-items:center; justify-content:center; min-width:158px; height:36px; padding:0 28px; color:#fff; font:16px/1 var(--font-calligraphy); letter-spacing:1px; text-decoration:none; cursor:pointer; background:#cc3513 url('@/assets/blessings/button-texture.png') center/100% 100% no-repeat; border:1px solid #c29f79; border-radius:999px; box-shadow:0 7px 10px rgba(147,54,20,.18); transition:filter .18s ease, transform .18s ease; }
/* ::before 内层金边，::after 两端装饰纹样。 */
.ceremonial-button::before { position:absolute; inset:3px; content:''; border:1px solid rgba(242,210,175,.85); border-radius:inherit; }
.ceremonial-button::after { position:absolute; inset-inline:8px; top:50%; height:5px; content:''; pointer-events:none; border-inline:4px solid #ead5bd; transform:translateY(-50%) rotate(45deg); }
.ceremonial-button span { position:relative; z-index:1; }
.ceremonial-button:hover { filter:brightness(1.08); transform:translateY(-2px); }
.ceremonial-button:focus-visible { outline:2px solid #1d4e6e; outline-offset:3px; }
</style>
