<template>
  <!-- 仪式感按钮：金边与两端纹样由 CSS 生成，文案放在 span 内以保证层级正确。 -->
  <button class="ceremonial-button" type="button"><span>{{ label }}</span></button>
</template>

<script setup>
// 只接收文案；disabled、aria-busy 等未声明的属性会透传到根 button 上。
defineProps({ label: { type: String, required: true } })
</script>

<style scoped>
.ceremonial-button { position:relative; display:inline-flex; align-items:center; justify-content:center; min-width:158px; height:36px; padding:0 28px; color:#fff; font:16px/1 var(--font-calligraphy); letter-spacing:1px; cursor:pointer; background:#cc3513 url('@/assets/blessings/button-texture.png') center/100% 100% no-repeat; border:1px solid #c29f79; border-radius:999px; box-shadow:0 7px 10px rgba(147,54,20,.18); transition:filter .18s ease, transform .18s ease; }
/* ::before 内层金边，::after 两端装饰纹样。 */
.ceremonial-button::before { position:absolute; inset:3px; content:''; border:1px solid rgba(242,210,175,.85); border-radius:inherit; }
.ceremonial-button::after { position:absolute; inset-inline:8px; top:50%; height:5px; content:''; pointer-events:none; border-inline:4px solid #ead5bd; transform:translateY(-50%) rotate(45deg); }
.ceremonial-button span { position:relative; z-index:1; }
.ceremonial-button:hover { filter:brightness(1.08); transform:translateY(-2px); }
.ceremonial-button:focus-visible { outline:2px solid #1d4e6e; outline-offset:3px; }
</style>
