<template>
  <!-- 反馈 / 图片预览弹窗：挂到 body 上，用原生 dialog 的 showModal 获得焦点陷阱与层级。 -->
  <Teleport to="body">
    <!-- @cancel 拦截浏览器默认的 Esc 关闭，统一走 close 以便恢复页面滚动；@click 用于判断是否点在了遮罩上。 -->
    <dialog ref="dialog" class="account-feedback-dialog" :aria-labelledby="titleId" @close="emit('close')" @cancel.prevent="close" @click="onBackdrop">
      <!-- 打开后焦点直接落在关闭按钮上；× 是纯符号，因此补一个 aria-label。 -->
      <button class="account-feedback-close" type="button" autofocus :aria-label="t('portal.common.close')" @click="close">×</button>
      <h2 :id="titleId">{{ title }}</h2>
      <!-- 无图时（如供灯记录存的是视频）不渲染图片，只保留说明文字。 -->
      <video v-if="video" class="account-feedback-image" :src="video" controls playsinline />
      <img v-else-if="image" class="account-feedback-image" :src="image" :alt="title" />
      <p v-if="description">{{ description }}</p>
      <CeremonialButton :label="t('portal.auth.dismiss')" @click="close" />
    </dialog>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'

// title / description / image 均为可选，由调用方决定展示内容。
defineProps({ title: String, description: String, image: String, video: String })
// 关闭统一抛给父级，由父级把承载数据的变量置空（组件本身是 v-if 挂载的）。
const emit = defineEmits(['close'])
const { t } = useI18n()
const dialog = ref(null)
// 供 aria-labelledby 使用的唯一 id。
const titleId = `account-feedback-${useId()}`
// 记住打开前 body 的滚动设置，关闭后原样恢复。
let previousOverflow = ''

// 先恢复页面滚动，再关闭 dialog；dialog 的 close 事件会冒泡给父级。
function close() {
  document.body.style.overflow = previousOverflow
  dialog.value?.close()
}
// dialog 的 ::backdrop 不在元素内部，只能靠坐标判断点击是否落在对话框之外。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close()
}
onMounted(() => {
  previousOverflow = document.body.style.overflow
  // 弹窗打开期间锁定页面滚动。
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
})
// 组件被 v-if 卸载时兜底恢复滚动。
onBeforeUnmount(close)
</script>
