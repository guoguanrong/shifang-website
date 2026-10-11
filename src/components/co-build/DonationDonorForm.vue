<template>
  <!-- 捐赠人信息表单：通过插槽把 submit 暴露给父级的按钮使用。 -->
  <form ref="formElement" class="donation-donor-form" novalidate @submit.prevent="submit">
    <OrnateSectionHeading :art="headingArt" :title="t('donation.formTitle')" />
    <div class="donation-form-row">
      <label for="donation-name">{{ t('donation.name') }}</label>
      <div class="donation-field">
        <!-- 勾选匿名后姓名输入框禁用。 -->
        <input id="donation-name" v-model="form.name" :disabled="form.anonymous" autocomplete="name" maxlength="100" :placeholder="t('donation.namePlaceholder')" />
        <label class="donation-anonymous"><input v-model="form.anonymous" type="checkbox" />{{ t('donation.anonymous') }}</label>
      </div>
    </div>
    <div class="donation-form-row">
      <label for="donation-phone">{{ t('donation.phone') }}</label>
      <div class="donation-field donation-phone">
        <select v-model="form.country" :aria-label="t('donation.country')" autocomplete="tel-country-code">
          <option v-for="(code, index) in countryCodes" :key="code" :value="code">{{ t(`donation.countries.${index}`) }} {{ code }}</option>
        </select>
        <input id="donation-phone" v-model="form.phone" type="tel" autocomplete="tel-national" maxlength="30" :placeholder="t('donation.phonePlaceholder')" />
      </div>
    </div>
    <div class="donation-form-row">
      <label for="donation-email">{{ t('donation.email') }}</label>
      <div class="donation-field"><input id="donation-email" v-model="form.email" type="email" autocomplete="email" maxlength="254" :placeholder="t('donation.emailPlaceholder')" /></div>
    </div>
    <div class="donation-form-row">
      <label for="donation-wish">{{ t('donation.wish') }}</label>
      <textarea id="donation-wish" v-model="form.wish" maxlength="1000" :placeholder="t('donation.wishPlaceholder')" />
    </div>
    <slot :submit="submit" />
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import headingArt from '@/assets/donation/heading.svg'

const { t } = useI18n()
// 可选的国家/地区区号。
const countryCodes = ['+86', '+852', '+853', '+886', '+65', '+60', '+1', '+44', '+61']
const emit = defineEmits(['submit'])
const formElement = ref(null)
// 表单数据；anonymous 为真时无需姓名。
const form = reactive({ name: '', anonymous: false, country: '+86', phone: '', email: '', wish: '' })

// 抛出一份去除首尾空格的表单快照。
function submit() {
  emit('submit', { ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), wish: form.wish.trim() })
}

// 对外暴露 validate，让父级在下单前触发浏览器原生校验。
defineExpose({ validate: () => formElement.value.reportValidity() })
</script>
