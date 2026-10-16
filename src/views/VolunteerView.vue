<template>
  <AccountPageShell :title="t('accountPages.volunteer.title')" :eyebrow="t('accountPages.volunteer.eyebrow')" :subtitle="t('accountPages.volunteer.subtitle')">
    <section class="account-paper volunteer-introduction">
      <OrnateSectionHeading :title="t('accountPages.volunteer.originTitle')" />
      <p>{{ t('accountPages.volunteer.origin') }}</p>
      <div class="volunteer-benefits">
        <article v-for="benefit in benefits" :key="benefit.id">
          <img :src="benefit.image" alt="" width="100" height="90" />
          <h3>{{ t(`accountPages.volunteer.benefits.${benefit.id}.title`) }}</h3>
          <p>{{ t(`accountPages.volunteer.benefits.${benefit.id}.description`) }}</p>
        </article>
      </div>
    </section>
    <section class="volunteer-roles" aria-labelledby="volunteer-roles-title">
      <OrnateSectionHeading id="volunteer-roles-title" :title="t('accountPages.volunteer.rolesTitle')" />
      <div class="volunteer-role-grid">
        <button v-for="role in roles" :key="role.id" class="volunteer-role" type="button" :style="{ '--role-image': `url(${role.image})` }" @click="chooseRole(role.id)">
          <span>{{ t(`accountPages.volunteer.roles.${role.id}.title`) }}</span>
          <span>{{ t(`accountPages.volunteer.roles.${role.id}.description`) }}</span>
        </button>
      </div>
    </section>
    <section class="account-paper volunteer-application">
      <OrnateSectionHeading :title="t('accountPages.volunteer.applicationTitle')" />
      <!-- 已提交过申请：显示审核状态，表单同步回填申请内容。 -->
      <div v-if="selfInfo" class="volunteer-status" :class="`is-status-${Number(selfInfo.status) || 1}`" role="status">
        <p class="volunteer-status-title">{{ statusText }}</p>
        <p v-if="Number(selfInfo.status) === 3 && selfInfo.refuseReason" class="volunteer-status-detail">
          {{ t('accountPages.volunteer.refuseReasonLabel') }}：{{ selfInfo.refuseReason }}
        </p>
        <p v-if="selfInfo.createTime" class="volunteer-status-detail">
          {{ t('accountPages.volunteer.appliedAt') }}：{{ selfInfo.createTime }}
        </p>
      </div>
      <form ref="applicationForm" class="volunteer-form" novalidate @submit.prevent="submit">
        <div class="volunteer-field">
          <label for="volunteer-name">{{ t('accountPages.volunteer.name') }}</label>
          <input id="volunteer-name" v-model="form.name" name="name" autocomplete="name" required maxlength="80" :placeholder="t('accountPages.volunteer.namePlaceholder')" :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'volunteer-name-error' : undefined" />
          <p v-if="errors.name" id="volunteer-name-error" class="volunteer-error">{{ t(errors.name) }}</p>
        </div>
        <div class="volunteer-field">
          <label for="volunteer-phone">{{ t('accountPages.volunteer.phone') }}</label>
          <div class="volunteer-phone">
            <select v-model="form.country" :aria-label="t('accountPages.volunteer.country')">
              <option v-for="country in countries" :key="country.id" :value="country.code">{{ t(`accountPages.volunteer.countries.${country.id}`) }} {{ country.code }}</option>
            </select>
            <input id="volunteer-phone" v-model="form.phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" required maxlength="24" :placeholder="t('accountPages.volunteer.phonePlaceholder')" :aria-invalid="Boolean(errors.phone)" :aria-describedby="errors.phone ? 'volunteer-phone-error' : undefined" />
          </div>
          <p v-if="errors.phone" id="volunteer-phone-error" class="volunteer-error">{{ t(errors.phone) }}</p>
        </div>
        <div class="volunteer-field">
          <label for="volunteer-role">{{ t('accountPages.volunteer.role') }}</label>
          <select id="volunteer-role" v-model="form.role" required><option v-for="role in roles" :key="role.id" :value="role.id">{{ t(`accountPages.volunteer.roles.${role.id}.option`) }}</option></select>
        </div>
        <div class="volunteer-field">
          <label for="volunteer-time">{{ t('accountPages.volunteer.time') }}</label>
          <select id="volunteer-time" v-model="form.time" required><option v-for="time in times" :key="time" :value="time">{{ t(`accountPages.volunteer.times.${time}`) }}</option></select>
        </div>
        <div class="volunteer-field">
          <label for="volunteer-message">{{ t('accountPages.volunteer.message') }}</label>
          <textarea id="volunteer-message" v-model="form.message" name="message" rows="4" maxlength="1000" :placeholder="t('accountPages.volunteer.messagePlaceholder')" />
        </div>
        <CeremonialButton :disabled="submitting" :aria-busy="submitting" :label="t('accountPages.volunteer.submit')" @click="submit" />
        <p v-if="submissionError" class="volunteer-error" role="alert">{{ submissionError }}</p>
        <p class="volunteer-privacy">{{ t('accountPages.volunteer.privacy') }}</p>
      </form>
    </section>
    <VolunteerApplicationDialog v-if="feedback" :role="feedback.role" :time="feedback.time" @close="feedback = null" />
  </AccountPageShell>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import VolunteerApplicationDialog from '@/components/account/VolunteerApplicationDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { getVolunteerSelfInfo, saveVolunteer } from '@/api/volunteer'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'
import templeBenefit from '@/assets/account-pages/volunteer-temple.webp'
import fellowshipBenefit from '@/assets/account-pages/volunteer-fellowship.webp'
import meritBenefit from '@/assets/account-pages/volunteer-merit.webp'
import templeRole from '@/assets/account-pages/role-temple.webp'
import ceremonyRole from '@/assets/account-pages/role-ceremony.webp'
import mediaRole from '@/assets/account-pages/role-media.webp'
import onlineRole from '@/assets/account-pages/role-online.webp'

const { t } = useI18n()
const { isLoggedIn } = useUserSession()
const { openAuthModal } = useAuthModal()
const benefits = [{ id: 'temple', image: templeBenefit }, { id: 'fellowship', image: fellowshipBenefit }, { id: 'merit', image: meritBenefit }]
const roles = [{ id: 'temple', image: templeRole }, { id: 'ceremony', image: ceremonyRole }, { id: 'media', image: mediaRole }, { id: 'online', image: onlineRole }]
const countries = [{ id: 'china', code: '+86' }, { id: 'hongKong', code: '+852' }, { id: 'taiwan', code: '+886' }, { id: 'northAmerica', code: '+1' }]
const times = ['weekend', 'weekdays', 'evenings', 'flexible']
const form = reactive({ name: '', country: '+86', phone: '', role: 'temple', time: 'weekend', message: '' })
const attempted = ref(false)
const feedback = ref(null)
const submitting = ref(false)
const submissionError = ref('')
const applicationForm = ref(null)
const roleValues = {
  temple: '道场护持',
  ceremony: '道会协助',
  media: '文宣服务',
  online: '线上服务',
}
const timeValues = {
  weekend: '周末',
  weekdays: '工作日',
  evenings: '晚间',
  flexible: '均可',
}
const errors = computed(() => {
  if (!attempted.value) return {}
  const result = {}
  if (!form.name.trim()) result.name = 'accountPages.volunteer.nameError'
  const phone = form.phone.replace(/[\s-]/g, '')
  if (!(form.country === '+86' ? /^1\d{10}$/ : /^\d{6,15}$/).test(phone)) result.phone = 'accountPages.volunteer.phoneError'
  return result
})

// 义工申请自助信息：仅此接口要求登录态——登录用户进入页面时查询自己的申请，未登录不请求。
const selfInfo = ref(null)

async function loadSelfInfo() {
  try {
    const info = await getVolunteerSelfInfo({ silent: true })
    if (!info || info.id === undefined || info.id === null) return
    selfInfo.value = info

    // 回填表单：手机号按国家码前缀拆分；岗位/时段存的是中文值，需反查表单 id。
    if (info.username) form.name = info.username
    const phone = String(info.phone || '')
    const country = countries.find((item) => phone.startsWith(item.code))
    if (country) {
      form.country = country.code
      form.phone = phone.slice(country.code.length)
    } else if (phone) {
      form.phone = phone
    }
    const roleKey = Object.keys(roleValues).find((key) => roleValues[key] === info.applyPost)
    if (roleKey) form.role = roleKey
    const timeKey = Object.keys(timeValues).find((key) => timeValues[key] === info.serviceTime)
    if (timeKey) form.time = timeKey
    if (info.remark) form.message = info.remark
  } catch {
    // 查询失败（含登录过期）保持空表单，不打断申请流程。
  }
}

onMounted(() => {
  if (isLoggedIn.value) loadSelfInfo()
})

// 审核状态文案：1 待审核 / 2 审核通过 / 3 未通过。
const statusText = computed(() => {
  const status = Number(selfInfo.value?.status)
  if (status === 2) return t('accountPages.volunteer.statusApproved')
  if (status === 3) return t('accountPages.volunteer.statusRefused')
  return t('accountPages.volunteer.statusPending')
})

async function chooseRole(role) {
  form.role = role
  await nextTick()
  const select = applicationForm.value.querySelector('#volunteer-role')
  select.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  select.focus({ preventScroll: true })
}

async function submit() {
  if (submitting.value) return
  if (!isLoggedIn.value) {
    openAuthModal('login', () => submit())
    return
  }
  attempted.value = true
  submissionError.value = ''
  await nextTick()
  const invalid = applicationForm.value.querySelector('[aria-invalid="true"]')
  if (invalid) return invalid.focus()

  submitting.value = true
  try {
    const normalizedPhone = form.phone.replace(/[\s()-]/g, '')
    await saveVolunteer({
      username: form.name.trim(),
      phone: `${form.country}${normalizedPhone}`,
      applyPost: roleValues[form.role],
      serviceTime: timeValues[form.time],
      remark: form.message.trim(),
    })
    feedback.value = { role: form.role, time: form.time }
    form.name = ''
    form.country = '+86'
    form.phone = ''
    form.role = 'temple'
    form.time = 'weekend'
    form.message = ''
    attempted.value = false
  } catch (error) {
    submissionError.value = error.userMessage || error.message || '申请提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>
