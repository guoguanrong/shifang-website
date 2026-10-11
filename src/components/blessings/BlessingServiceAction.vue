<template>
  <div class="blessing-service-action">
    <CeremonialButton :label="kind === 'seasonal' && previewEnabled ? t('blessingDetails.dialog.cancelTitle') : label" @click="showDialog = true" />
    <BlessingServiceDialog v-if="showDialog" :kind="kind" :cancel="kind === 'seasonal' && previewEnabled"
      @close="showDialog = false" @confirm="confirm" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import BlessingServiceDialog from './BlessingServiceDialog.vue'

const props = defineProps({ label: { type: String, required: true }, kind: { type: String, required: true } })
const { t } = useI18n()
const showDialog = ref(false)
// Preview state only: never persisted or represented as an actual SMS subscription.
const previewEnabled = ref(false)
function confirm() {
  if (props.kind === 'seasonal') previewEnabled.value = !previewEnabled.value
  showDialog.value = false
}
</script>
