<template>
  <!-- 供奉/点灯下单表单：kind 决定说明文案，点灯还需额外收集生辰。 -->
  <form class="offering-order-form" @submit.prevent="submit">
    <p v-if="!compact" class="order-explanation">{{ t(kind === 'lamp' ? 'offerings.materialExplanation' :
      'offerings.deityExplanation') }}</p>
    <div v-if="!hideTotal" class="offering-total"><span>{{ t('offerings.total') }}</span><strong>${{ amount }}<small
          v-if="period"> / {{
            period }}</small></strong></div>
    <label>{{ t('offerings.name') }}<input v-model="name" name="devoteeName" autocomplete="name" required maxlength="30"
        :placeholder="t('offerings.namePlaceholder')" /></label>
    <!-- 生辰仅点灯需要，且不允选择未来日期；右侧日历图标为自定义切图。 -->
    <label v-if="kind === 'lamp'">{{ t('offerings.birth') }}<input v-model="birth" name="birthDate" type="date" required
        class="birth-input" :max="today" /></label>
    <label>{{ t('offerings.wish') }}<textarea v-model="wish" name="wish" rows="3" maxlength="300"
        :placeholder="t('offerings.wishPlaceholder')" /></label>
    <div class="order-submit">
      <CeremonialButton type="submit"
        :label="submitLabel || t(kind === 'lamp' ? 'offerings.submitLamp' : 'offerings.submitDeity')" />
    </div>
    <p v-if="kind === 'deity'" class="order-explanation centered">{{ t('offerings.deityPromise') }}</p>
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
const props = defineProps({ kind: { type: String, default: 'lamp' }, amount: Number, period: String, compact: Boolean, hideTotal: Boolean, submitLabel: String, initialDetails: { type: Object, default: () => ({}) } })
// kind 为 lamp 或 deity；compact / hideTotal 用于详情页里的精简展示。
const emit = defineEmits(['submit'])
const { t } = useI18n()
// 初始值可来自父级传入的历史填写内容。
const name = ref(props.initialDetails.name || '')
const birth = ref(props.initialDetails.birth || '')
const wish = ref(props.initialDetails.wish || '')
// 今天，作为生辰输入框的 max。
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
// 借助原生表单校验：姓名去空格后为空时给出自定义提示，输入后即清除提示。
function submit(event) {
  const input = event.target.elements.devoteeName
  input.setCustomValidity(name.value.trim() ? '' : t('offerings.nameRequired'))
  if (!event.target.reportValidity()) {
    input.addEventListener('input', () => input.setCustomValidity(''), { once: true })
    return
  }
  emit('submit', { name: name.value.trim(), birth: birth.value, wish: wish.value.trim() })
}
</script>
