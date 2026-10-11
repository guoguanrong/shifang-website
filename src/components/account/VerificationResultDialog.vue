<template>
  <AccountResultDialog variant-class="verification-result-dialog" :title="t('accountDetails.verification.result.title')"
    :blessing="t('accountDetails.verification.result.blessing')" :confirm-label="t('accountDetails.verification.result.confirm')" @close="emit('close')">
    <p v-if="!verified" class="verification-result-preview">{{ t('accountDetails.verification.result.preview') }}</p>
    <template v-else>
      <p>{{ t('accountDetails.verification.result.congratulations') }}</p>
      <p>{{ t('accountDetails.verification.result.description') }}</p>
    </template>
  </AccountResultDialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AccountResultDialog from '@/components/account/AccountResultDialog.vue'

// 仅服务端确认认证成功后才可传入 verified；前端表单校验只展示演示提示。
defineProps({ verified: { type: Boolean, default: false } })
const emit = defineEmits(['close'])
const { t } = useI18n()
</script>
