<template>
  <AccountPageShell class="account-details-page" :title="t('accountDetails.settings.title')"
    :eyebrow="t('accountDetails.settings.eyebrow')" :subtitle="t('accountDetails.settings.subtitle')" account-trail>
    <section class="settings-panel" aria-labelledby="settings-heading">
      <h2 id="settings-heading" class="settings-heading">{{ t('accountDetails.settings.heading') }}</h2>
      <form ref="settingsForm" class="settings-form" novalidate @submit.prevent="save">
        <div v-for="field in fields" :key="field.id" class="settings-field">
          <label :for="`settings-${field.id}`">{{ t(`accountDetails.settings.${field.id}`) }}</label>
          <input :id="`settings-${field.id}`" v-model="form[field.id]" :name="field.id" :type="field.type"
            :autocomplete="field.autocomplete" :required="field.id === 'name'" :maxlength="field.maxlength"
            :placeholder="t(`accountDetails.settings.${field.id}Placeholder`)" :aria-invalid="Boolean(errors[field.id])"
            :aria-describedby="errors[field.id] ? `settings-${field.id}-error` : undefined" @input="notice = ''" />
          <p v-if="errors[field.id]" :id="`settings-${field.id}-error`" class="account-field-error">{{ t(errors[field.id]) }}</p>
        </div>
        <div class="settings-field">
          <p class="settings-label">{{ t('accountDetails.settings.verificationLabel') }}</p>
          <div class="settings-verification">
            <img :src="identityIcon" alt="" width="50" height="44" />
            <div>
              <h3>{{ t('accountDetails.settings.verification') }}</h3>
              <p>{{ t('accountDetails.settings.benefits') }}</p>
            </div>
            <CeremonialButton :label="t('accountDetails.settings.verify')" @click="router.push({ name: 'account-verification' })" />
          </div>
        </div>
        <CeremonialButton class="settings-save" type="submit" :label="t('accountDetails.settings.save')" />
        <p v-if="notice" class="settings-notice" role="status">{{ t(notice) }}</p>
        <i18n-t v-if="!isLoggedIn" keypath="accountDetails.settings.loginPrompt" tag="p" scope="global" class="settings-login">
          <template #login><button type="button" @click="openAuthModal()">{{ t('accountDetails.settings.login') }}</button></template>
        </i18n-t>
      </form>
    </section>
    <AccountResultDialog v-if="savedProfile" variant-class="settings-result-dialog" :title="t('accountDetails.settings.result.title')"
      :blessing="t('accountDetails.settings.result.blessing')" :confirm-label="t('accountDetails.settings.result.confirm')" @close="savedProfile = null">
      <p>{{ t('accountDetails.settings.result.updated', { name: savedProfile.name }) }}</p>
      <p>{{ t('accountDetails.settings.result.email', { email: savedProfile.email || t('accountDetails.settings.result.emptyEmail') }) }}</p>
      <template #notice>{{ t(notice) }}</template>
    </AccountResultDialog>
  </AccountPageShell>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import AccountResultDialog from '@/components/account/AccountResultDialog.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'
import identityIcon from '@/assets/account-details/identity.svg'
import '@/styles/account-details.css'

const { t } = useI18n()
const router = useRouter()
const { user, isLoggedIn, updateDemoProfile } = useUserSession()
const { openAuthModal } = useAuthModal()
const fields = [
  { id: 'name', type: 'text', autocomplete: 'nickname', maxlength: 80 },
  { id: 'phone', type: 'tel', autocomplete: 'tel', maxlength: 30 },
  { id: 'email', type: 'email', autocomplete: 'email', maxlength: 254 },
]
const form = reactive({ name: '', phone: '', email: '' })
const settingsForm = ref(null)
const attempted = ref(false)
const notice = ref('')
const savedProfile = ref(null)
const errors = computed(() => {
  if (!attempted.value) return {}
  const result = {}
  if (!form.name.trim()) result.name = 'accountDetails.settings.nameError'
  if (form.phone.trim() && !/^[+0-9() .-]{5,30}$/.test(form.phone.trim())) result.phone = 'accountDetails.settings.phoneError'
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) result.email = 'accountDetails.settings.emailError'
  return result
})

watch(user, value => {
  savedProfile.value = null
  Object.assign(form, { name: value?.nickname || '', phone: value?.phone || '', email: value?.email || '' })
  notice.value = ''
  attempted.value = false
}, { immediate: true, flush: 'sync' })

async function save() {
  if (!isLoggedIn.value) {
    openAuthModal()
    return
  }
  attempted.value = true
  await nextTick()
  const invalid = settingsForm.value.querySelector('[aria-invalid="true"]')
  if (invalid) return invalid.focus()
  const result = updateDemoProfile(form)
  if (!result.saved) return
  notice.value = result.persisted ? 'accountDetails.settings.saved' : 'accountDetails.settings.temporary'
  savedProfile.value = { name: user.value.name, email: user.value.email }
}
</script>
