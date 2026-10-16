<template>
  <div class="blessing-service-action">
    <CeremonialButton :label="kind === 'seasonal' && enabled ? t('blessingDetails.dialog.cancelTitle') : label" :disabled="submitting"
      @click="openDialog" />
    <BlessingServiceDialog v-if="showDialog" :kind="kind" :cancel="kind === 'seasonal' && enabled"
      @close="showDialog = false" @confirm="confirm" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import BlessingServiceDialog from './BlessingServiceDialog.vue'
import { cancelSolarTerms, getSolarTermsStatus, openSolarTerms } from '@/api/pray'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'

const props = defineProps({ label: { type: String, required: true }, kind: { type: String, required: true } })
const { t } = useI18n()
const { isLoggedIn } = useUserSession()
const { openAuthModal } = useAuthModal()
const showDialog = ref(false)
// 节气提醒开启状态：进入页面时由 /pray/solarTerms 查询驱动（1 已开启 / 0 未开启）。
const enabled = ref(false)
const submitting = ref(false)

async function refreshEnabled() {
  try {
    enabled.value = Number(await getSolarTermsStatus({ silent: true })) === 1
  } catch {
    // 未登录或查询失败按未开启处理，真正开启时后端会再次校验。
    enabled.value = false
  }
}

onMounted(() => {
  if (props.kind === 'seasonal') refreshEnabled()
})

// 登录成功后重新查询开启状态（未登录时查询会失败）。
watch(isLoggedIn, value => {
  if (props.kind === 'seasonal' && value) refreshEnabled()
})

// 点按钮即触发弹窗；节气提醒的接口请求（需登录）在弹窗确认后进行。
function openDialog() {
  // 节气提醒与恭请护身符需登录；登录完成后继续打开对应确认弹窗。
  if (['seasonal', 'talisman'].includes(props.kind) && !isLoggedIn.value) {
    openAuthModal('login', () => { showDialog.value = true })
    return
  }
  showDialog.value = true
}

async function confirm() {
  showDialog.value = false
  if (props.kind !== 'seasonal' || submitting.value) return

  submitting.value = true
  try {
    if (enabled.value) {
      // 已开启：确认即取消提醒。
      await cancelSolarTerms()
      enabled.value = false
    } else {
      // 非静默：未登录等失败原因会以全局浮层直接提示。
      await openSolarTerms()
      enabled.value = true
    }
  } catch {
    // 失败原因已由全局浮层提示，开启状态保持不变。
  } finally {
    submitting.value = false
  }
}
</script>
