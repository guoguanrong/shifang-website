<template>
  <!-- 道会线上登记：填写资料、核对信息、登记成功三步都在同一个弹窗里。 -->
  <Teleport to="body">
    <dialog ref="dialog" class="blessing-service-dialog event-register-dialog" :class="`is-${stage}`" :aria-labelledby="titleId"
      @close="emit('close')" @cancel.prevent="close" @click="onBackdrop">
      <div class="service-dialog-content">
        <button class="service-dialog-close" type="button" :aria-label="t('portal.common.close')" @click="close"><img :src="closeIcon" alt="" /></button>
        <header class="register-heading">
          <img :src="emblem" alt="" />
          <h2 :id="titleId">{{ heading }}</h2>
          <p>{{ subtitle }}</p>
        </header>

        <form v-if="stage === 'form'" class="register-form" @submit.prevent="review">
          <label>
            <span>{{ t('events.registerDialog.name') }}</span>
            <input v-model="form.username" type="text" maxlength="30" :placeholder="t('events.registerDialog.namePlaceholder')" @keydown.enter.prevent="review" />
            <small v-if="errors.username">{{ errors.username }}</small>
          </label>
          <label>
            <span>{{ t('events.registerDialog.mobile') }}</span>
            <input v-model="form.mobile" type="tel" inputmode="numeric" maxlength="11" :placeholder="t('events.registerDialog.mobilePlaceholder')" @keydown.enter.prevent="review" />
            <small v-if="errors.mobile">{{ errors.mobile }}</small>
          </label>
          <label>
            <span>{{ t('events.registerDialog.companions') }}</span>
            <select v-model.number="form.followUser">
              <option v-for="count in companionOptions" :key="count" :value="count">{{ companionLabel(count) }}</option>
            </select>
          </label>
          <label>
            <span>{{ t('events.registerDialog.wish') }}</span>
            <textarea v-model="form.prayWish" maxlength="200" :placeholder="t('events.registerDialog.wishPlaceholder')" />
          </label>
          <CeremonialButton :label="t('events.registerDialog.next')" @click="review" />
          <p class="register-notice">{{ t('events.registerDialog.notice') }}</p>
        </form>

        <div v-else-if="stage === 'confirm'" class="register-confirm">
          <dl>
            <div><dt>{{ t('events.registerDialog.gathering') }}</dt><dd>{{ activityTitle }}</dd></div>
            <div><dt>{{ t('events.registerDialog.devotee') }}</dt><dd>{{ form.username }}</dd></div>
            <div><dt>{{ t('events.registerDialog.phone') }}</dt><dd>{{ form.mobile }}</dd></div>
            <div><dt>{{ t('events.registerDialog.party') }}</dt><dd>{{ partyLabel }}</dd></div>
          </dl>
          <p v-if="submitError" class="register-error" role="alert">{{ submitError }}</p>
          <div class="register-actions">
            <button class="register-back" type="button" :disabled="submitting" @click="stage = 'form'">{{ t('events.registerDialog.back') }}</button>
            <CeremonialButton :label="submitting ? t('events.registerDialog.submitting') : t('events.registerDialog.submit')" :disabled="submitting" @click="submit" />
          </div>
        </div>

        <div v-else class="register-success" role="status">
          <dl>
            <div><dt>{{ t('events.registerDialog.cert') }}</dt><dd>{{ cert }}</dd></div>
          </dl>
          <p>{{ t('events.registerDialog.sms', { mobile: maskedMobile }) }}</p>
          <p>{{ t('events.registerDialog.arrival') }}</p>
          <CeremonialButton :label="t('events.registerDialog.closeBlessing')" @click="close" />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { saveActivityRegister } from '@/api/activityRegister'
import closeIcon from '@/assets/blessing-details/service-dialog-close.svg'
import emblem from '@/assets/events/register-emblem.png'
import '@/styles/blessing-service-dialog.css'

const props = defineProps({
  activityId: { type: [Number, String], required: true },
  activityTitle: { type: String, default: '' },
})
const emit = defineEmits(['close'])
const { t } = useI18n()
const dialog = ref(null)
const titleId = useId()
const stage = ref('form')
const submitting = ref(false)
const submitError = ref('')
const cert = ref('')
const companionOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const form = reactive({ username: '', mobile: '', followUser: 0, prayWish: '' })
const errors = reactive({ username: '', mobile: '' })
let previousOverflow = ''
let previousFocus

const heading = computed(() => {
  if (stage.value === 'confirm') return t('events.registerDialog.confirmTitle')
  if (stage.value === 'success') return t('events.registerDialog.successTitle')
  return props.activityTitle
})
const subtitle = computed(() => {
  if (stage.value === 'confirm') return t('events.registerDialog.confirmSubtitle')
  if (stage.value === 'success') return t('events.registerDialog.successSubtitle')
  return t('events.registerDialog.subtitle')
})
const partyLabel = computed(() => form.followUser > 0 ? t('events.registerDialog.partyValue', { count: form.followUser }) : t('events.registerDialog.self'))
const maskedMobile = computed(() => {
  const mobile = form.mobile
  if (mobile.length < 7) return mobile
  return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`
})

function companionLabel(count) {
  return count === 0 ? t('events.registerDialog.selfOnly') : t('events.registerDialog.companionCount', { count })
}

function review() {
  errors.username = form.username.trim() ? '' : t('events.registerDialog.nameRequired')
  if (!form.mobile.trim()) errors.mobile = t('events.registerDialog.mobileRequired')
  else if (!/^1\d{10}$/.test(form.mobile.trim())) errors.mobile = t('events.registerDialog.mobileInvalid')
  else errors.mobile = ''
  if (errors.username || errors.mobile) return
  submitError.value = ''
  stage.value = 'confirm'
  dialog.value.scrollTop = 0
}

async function submit() {
  if (submitting.value) return
  submitting.value = true
  submitError.value = ''
  try {
    const data = await saveActivityRegister({
      activityId: props.activityId,
      username: form.username.trim(),
      mobile: form.mobile.trim(),
      followUser: form.followUser,
      prayWish: form.prayWish.trim(),
    }, { silent: true })
    cert.value = data?.cert || (data?.id != null ? String(data.id) : '')
    stage.value = 'success'
    dialog.value.scrollTop = 0
  } catch (error) {
    submitError.value = error?.message || t('events.registerDialog.failed')
  } finally {
    submitting.value = false
  }
}

function close() {
  document.body.style.overflow = previousOverflow
  dialog.value?.close()
}

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

onBeforeUnmount(() => {
  close()
  previousFocus?.focus({ preventScroll: true })
})
</script>

<style scoped>
.event-register-dialog {
  width: min(680px, calc(100% - 32px));
  height: min(846px, calc(100dvh - 40px));
  color: #333;
  background: linear-gradient(180deg, rgba(255, 255, 255, .4) -9.61%, rgba(255, 255, 255, .8) 16.74%, #fff 100%);
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, .25);
  backdrop-filter: blur(2px);
}

.event-register-dialog.is-confirm {
  height: min(484px, calc(100dvh - 40px));
}

.is-confirm .register-heading { padding-top: 24px; }
.is-confirm .register-heading h2 { margin-top: 26px; }
.is-confirm .register-confirm { margin-top: 28px; }
.is-confirm .register-confirm dl div { padding: 10px 0; }
.is-confirm .register-actions { margin-top: 24px; }

.event-register-dialog.is-success {
  height: fit-content;
  max-height: calc(100dvh - 40px);
}

.register-heading { position: relative; padding-top: 36px; text-align: center; }
.register-heading img { position: absolute; top: 0; left: 50%; width: 148px; height: auto; transform: translateX(-50%); pointer-events: none; }
.register-heading h2 { position: relative; margin: 34px 0 0; color: #333; font: 400 28px/1.3 var(--font-calligraphy); letter-spacing: 2px; }
.register-heading p { margin: 8px 0 0; color: #9a8b78; font-size: 14px; letter-spacing: 1px; }
.register-form { display: grid; gap: 18px; max-width: 520px; margin: 36px auto 0; }
.register-form label { display: grid; gap: 8px; color: #333; font-size: 16px; letter-spacing: 1px; }
.register-form input,
.register-form select,
.register-form textarea { width: 100%; border: 1px solid #e7d3ba; border-radius: 999px; background: rgba(255, 255, 255, .9); color: #333; font: 16px/1.4 var(--font-calligraphy); }
.register-form input,
.register-form select { height: 48px; padding: 0 18px; }
.register-form select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #c4a574 50%), linear-gradient(135deg, #c4a574 50%, transparent 50%); background-position: calc(100% - 22px) 20px, calc(100% - 16px) 20px; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.register-form textarea { height: 96px; padding: 14px 18px; border-radius: 18px; resize: none; }
.register-form input::placeholder,
.register-form textarea::placeholder { color: #c8b8a4; }
.register-form small,
.register-error { color: #cc3513; font-size: 13px; }
.register-form :deep(.ceremonial-button) { width: 100%; height: 52px; margin-top: 8px; font-size: 20px; }
.register-notice { margin: 0; color: #b0a496; font-size: 13px; line-height: 1.6; text-align: center; }
.register-confirm,
.register-success { max-width: 520px; margin: 48px auto 0; }
.register-confirm dl,
.register-success dl { margin: 0; }
.register-confirm dl div,
.register-success dl div { display: flex; justify-content: space-between; gap: 24px; padding: 14px 0; }
.register-confirm dt,
.register-success dt { color: #9a8b78; font-size: 16px; letter-spacing: 4px; white-space: nowrap; }
.register-confirm dd,
.register-success dd { margin: 0; color: #333; font-size: 16px; text-align: right; overflow-wrap: anywhere; }
.register-actions { display: flex; justify-content: center; gap: 20px; margin-top: 36px; }
.register-back { min-width: 160px; height: 48px; padding: 0 24px; color: #333; font: 18px/1 var(--font-calligraphy); background: #fff; border: 1px solid #e7d3ba; border-radius: 999px; cursor: pointer; }
.register-back:disabled { cursor: default; opacity: .6; }
.register-actions :deep(.ceremonial-button) { min-width: 180px; height: 48px; font-size: 18px; }
.register-error { margin: 12px 0 0; text-align: center; }
.register-success p { margin: 18px 0 0; color: #8a8178; font-size: 14px; line-height: 1.7; text-align: center; }
.register-success :deep(.ceremonial-button) { display: flex; width: min(100%, 280px); height: 52px; margin: 28px auto 0; font-size: 20px; }
@media (max-width: 600px) {
  .event-register-dialog { height: auto; max-height: calc(100dvh - 24px); }
  .register-heading h2 { font-size: 22px; }
  .register-actions { flex-direction: column; }
  .register-back, .register-actions :deep(.ceremonial-button) { width: 100%; }
}
</style>
