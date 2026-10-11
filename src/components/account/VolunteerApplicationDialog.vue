<template>
  <!-- 义工报名成功弹窗：结构复用祈福服务弹窗（blessing-service-dialog），只在文案与操作上不同。 -->
  <Teleport to="body">
    <!-- @cancel 拦截 Esc 的默认关闭，统一走 close；@click 判断是否点到了遮罩；noticeId 关联底部提示。 -->
    <dialog ref="dialog" class="blessing-service-dialog volunteer-result-dialog" :aria-labelledby="titleId" :aria-describedby="noticeId"
      @close="emit('close')" @cancel.prevent="close" @click="onBackdrop">
      <div class="service-dialog-content">
        <!-- 关闭按钮的图标本身无意义（alt 留空），按钮由 aria-label 说明用途。 -->
        <button class="service-dialog-close" type="button" autofocus :aria-label="t('portal.common.close')" @click="close"><img :src="closeIcon" alt="" /></button>
        <header class="service-dialog-heading"><img :src="emblem" alt="" /><h2 :id="titleId">{{ t('accountPages.volunteerDialog.title') }}</h2></header>
        <!-- 回显用户选的服务岗位与时间段，二者都是语言包里的 key。 -->
        <div class="service-dialog-copy">
          <p>{{ t('accountPages.volunteerDialog.thanks') }}</p>
          <p>{{ t('accountPages.volunteerDialog.role', { role: t(`accountPages.volunteer.roles.${role}.title`) }) }}</p>
          <p>{{ t('accountPages.volunteerDialog.time', { time: t(`accountPages.volunteer.times.${time}`) }) }}</p>
        </div>
        <p class="service-dialog-blessing">{{ t('accountPages.volunteerDialog.blessing') }}</p>
        <div class="service-dialog-actions"><CeremonialButton :label="t('accountPages.volunteerDialog.confirm')" @click="close" /></div>
        <!-- 底部小字：说明当前为演示流程，同时作为 aria-describedby 指向的补充说明。 -->
        <p :id="noticeId" class="service-dialog-preview">{{ t('accountPages.volunteerDialog.preview') }}</p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import closeIcon from '@/assets/blessing-details/service-dialog-close.svg'
import emblem from '@/assets/blessing-details/service-dialog-emblem.svg'
import '@/styles/blessing-service-dialog.css'
import '@/styles/account-history.css'

// role / time 是语言包 key 片段，分别对应 accountPages.volunteer.roles.<role> 与 times.<time>。
defineProps({ role: { type: String, required: true }, time: { type: String, required: true } })
const emit = defineEmits(['close'])
const { t } = useI18n()
const dialog = ref(null)
// 标题与底部提示各需要一个唯一 id，供 aria-labelledby / aria-describedby 使用。
const titleId = useId()
const noticeId = useId()
// 打开前记下页面滚动设置与焦点位置，关闭后原样恢复。
let previousOverflow = ''
let previousFocus

// 恢复页面滚动后再关闭 dialog。
function close() {
  document.body.style.overflow = previousOverflow
  dialog.value?.close()
}
// ::backdrop 不属于 dialog 元素本身，只能通过点击坐标判断是否落在对话框之外。
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close()
}
onMounted(() => {
  previousOverflow = document.body.style.overflow
  previousFocus = document.activeElement
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
})
// 卸载时兜底：关闭弹窗并把焦点还给打开它的元素（preventScroll 避免页面跳动）。
onBeforeUnmount(() => {
  close()
  previousFocus?.focus({ preventScroll: true })
})
</script>
