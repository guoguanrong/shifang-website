<template>
  <AccountPageShell class="account-details-page verification-page" :title="t('accountDetails.verification.title')"
    :eyebrow="t('accountDetails.verification.eyebrow')" :subtitle="t('accountDetails.verification.subtitle')"
    :parent-link="{ to: '/account/settings', label: t('accountDetails.settings.title') }">
    <section class="settings-panel verification-process" aria-labelledby="verification-process-heading">
      <OrnateSectionHeading id="verification-process-heading" :title="t('accountDetails.verification.process')" :art="headingArt" />
      <ol class="verification-steps">
        <li v-for="(step, index) in steps" :key="step" :aria-current="index === 0 ? 'step' : undefined">
          <span class="verification-step-number">{{ index + 1 }}</span>
          <h3>{{ t(`accountDetails.verification.steps.${step}.title`) }}</h3>
          <p>{{ t(`accountDetails.verification.steps.${step}.description`) }}</p>
        </li>
      </ol>
    </section>

    <section class="settings-panel verification-details" aria-labelledby="verification-details-heading">
      <OrnateSectionHeading id="verification-details-heading" :title="t('accountDetails.verification.heading')" :art="headingArt" />
      <form ref="verificationForm" novalidate @submit.prevent="submit">
        <fieldset class="verification-methods">
          <legend>{{ t('accountDetails.verification.method') }}</legend>
          <div class="verification-method-grid">
            <label v-for="option in verificationMethods" :key="option.id" class="verification-method" :class="{ selected: method === option.id }">
              <input v-model="method" type="radio" name="verification-method" :value="option.id" />
              <img :src="option.icon" alt="" width="79" height="79" />
              <span>{{ t(`accountDetails.verification.methods.${option.id}.title`) }}</span>
            </label>
          </div>
        </fieldset>
        <div class="verification-fields">
          <div class="settings-field">
            <label for="verification-name">{{ t('accountDetails.verification.name') }}</label>
            <input id="verification-name" v-model="draft.name" name="legal-name" autocomplete="off" required maxlength="80"
              :placeholder="t('accountDetails.verification.namePlaceholder')" :aria-invalid="Boolean(errors.name)"
              :aria-describedby="errors.name ? 'verification-name-error' : undefined" @input="submitted = false" />
            <p v-if="errors.name" id="verification-name-error" class="account-field-error">{{ t(errors.name) }}</p>
          </div>
          <div class="settings-field">
            <label for="verification-number">{{ t('accountDetails.verification.number') }}</label>
            <input id="verification-number" v-model="draft.number" name="document-number" autocomplete="off" required maxlength="40" spellcheck="false"
              :placeholder="t(`${methodKey}.numberPlaceholder`)" :aria-invalid="Boolean(errors.number)"
              :aria-describedby="errors.number ? 'verification-number-error' : undefined" @input="submitted = false" />
            <p v-if="errors.number" id="verification-number-error" class="account-field-error">{{ t(errors.number) }}</p>
          </div>
          <fieldset class="verification-photos">
            <legend>{{ t(`${methodKey}.photos`) }}</legend>
            <div class="verification-upload-grid">
              <VerificationUpload v-for="(side, index) in sides" :key="`${resetKey}-${method}-${side}`" v-model="draft[side]"
                :label="t(`${methodKey}.${side}`)" :icon="activeMethod.photos[index]" :required-error="attempted && !draft[side]"
                @busy="uploadBusy[side] = $event" @update:model-value="submitted = false" />
            </div>
            <p class="verification-file-hint">{{ t('accountDetails.verification.fileHint') }}</p>
          </fieldset>
          <CeremonialButton class="verification-submit" type="submit" :disabled="isReading" :aria-busy="isReading"
            :label="t('accountDetails.verification.submit')" />
          <p class="verification-privacy">{{ t('accountDetails.verification.privacy') }}</p>
          <p class="verification-local-notice">{{ t('accountDetails.verification.localNotice') }}</p>
          <p v-if="submitted" class="verification-feedback" role="status">{{ t('accountDetails.verification.submitNotice') }}</p>
        </div>
      </form>
    </section>

    <section class="verification-benefits" aria-labelledby="verification-benefits-heading">
      <OrnateSectionHeading id="verification-benefits-heading" :title="t('accountDetails.verification.benefitsTitle')" :art="headingArt" />
      <div class="verification-benefit-grid">
        <article v-for="benefit in verificationBenefits" :key="benefit.id" class="settings-panel verification-benefit">
          <img :src="benefit.icon" alt="" width="110" height="100" loading="lazy" />
          <h3>{{ t(`accountDetails.verification.benefits.${benefit.id}.title`) }}</h3>
          <p>{{ t(`accountDetails.verification.benefits.${benefit.id}.description`) }}</p>
        </article>
      </div>
    </section>
    <VerificationResultDialog v-if="showResult" @close="showResult = false" />
  </AccountPageShell>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import VerificationUpload from '@/components/account/VerificationUpload.vue'
import VerificationResultDialog from '@/components/account/VerificationResultDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { verificationMethods, verificationBenefits } from '@/data/verification'
import { useUserSession } from '@/composables/useUserSession'
import headingArt from '@/assets/verification/heading.svg'
import '@/styles/account-details.css'
import '@/styles/account-verification.css'

const { t } = useI18n()
const { isLoggedIn } = useUserSession()
const steps = ['details', 'review', 'complete']
const sides = ['front', 'back']
const method = ref('id')
const createDraft = () => ({ name: '', number: '', front: null, back: null })
// 各种证件的临时草稿相互独立；证件资料不写入浏览器存储，也不改变实名认证状态。
const drafts = reactive(Object.fromEntries(verificationMethods.map(option => [option.id, createDraft()])))
const draft = computed(() => drafts[method.value])
const activeMethod = computed(() => verificationMethods.find(option => option.id === method.value))
const methodKey = computed(() => `accountDetails.verification.methods.${method.value}`)
const attempted = ref(false)
const submitted = ref(false)
const resetKey = ref(0)
const verificationForm = ref(null)
const showResult = ref(false)
const uploadBusy = reactive({ front: false, back: false })
const isReading = computed(() => uploadBusy.front || uploadBusy.back)
const errors = computed(() => {
  if (!attempted.value) return {}
  const result = {}
  if (!draft.value.name.trim()) result.name = 'accountDetails.verification.nameError'
  // 面向不同国家的证件，不套用单一地区的身份证规则；服务端接入后负责真伪核验。
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{3,39}$/.test(draft.value.number.trim())) result.number = 'accountDetails.verification.numberError'
  return result
})

watch(method, () => {
  attempted.value = false
  submitted.value = false
  uploadBusy.front = false
  uploadBusy.back = false
})

watch(isLoggedIn, () => {
  showResult.value = false
  resetKey.value++
  for (const option of verificationMethods) Object.assign(drafts[option.id], createDraft())
  attempted.value = false
  submitted.value = false
  uploadBusy.front = false
  uploadBusy.back = false
})

async function submit() {
  if (isReading.value) return
  attempted.value = true
  submitted.value = false
  await nextTick()
  const invalid = verificationForm.value.querySelector('[aria-invalid="true"]')
  if (invalid) return invalid.focus()
  // 接口尚未开放，仅反馈前端检查结果，不发送证件信息或模拟审核成功。
  submitted.value = true
  showResult.value = true
}
</script>
