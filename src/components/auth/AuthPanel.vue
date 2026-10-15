<template>
  <!-- 登录/注册面板：表单校验、验证码倒计时与结果反馈都在这个面板内完成。 -->
  <section class="auth-panel" :class="{ 'auth-panel--register': isRegister }" role="dialog" aria-modal="true" :aria-labelledby="titleId">
    <button class="auth-panel__close" type="button" :aria-label="t('portal.common.close')" @click="$emit('close')">×</button>

    <!-- 没有反馈层时展示表单，否则整块替换为成功/错误提示。 -->
    <template v-if="!feedback">
      <header class="auth-panel__header">
        <h1 :id="titleId">{{ t(isRegister ? 'portal.auth.registerTitle' : 'portal.auth.loginTitle') }}</h1>
        <p>{{ t(isRegister ? 'portal.auth.registerSubtitle' : 'portal.auth.loginSubtitle') }}</p>
      </header>

      <form novalidate @submit.prevent="submit">
        <label class="auth-field">
          <span>{{ t('portal.auth.email') }}</span>
          <input v-model.trim="form.email" type="email" autocomplete="email" :placeholder="t('portal.auth.emailPlaceholder')" />
        </label>

        <label class="auth-field">
          <span>{{ t('portal.auth.emailCode') }}</span>
          <span class="auth-field__compound">
            <input v-model.trim="form.emailCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" :placeholder="t('portal.auth.emailCodePlaceholder')" />
            <button type="button" :disabled="emailCountdown > 0" @click="sendCode('email')">
              {{ emailCountdown ? t('portal.auth.resendCode', { seconds: emailCountdown }) : t('portal.auth.sendCode') }}
            </button>
          </span>
        </label>

        <!-- 手机号与短信验证码只有注册时才需要填写。 -->
        <template v-if="isRegister">
          <label class="auth-field">
            <span>{{ t('portal.auth.phone') }}</span>
            <span class="auth-field__phone">
              <select v-model="form.country" :aria-label="t('portal.auth.phone')" :disabled="sendingSms">
                <option v-for="option in countryOptions" :key="option.value" :value="option.value">
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <input v-model.trim="form.phone" type="tel" inputmode="tel" autocomplete="tel" :placeholder="t('portal.auth.phonePlaceholder')" :disabled="sendingSms" />
            </span>
          </label>

          <label class="auth-field">
            <span>{{ t('portal.auth.phoneCode') }}</span>
            <span class="auth-field__compound">
              <input v-model.trim="form.phoneCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" :placeholder="t('portal.auth.phoneCodePlaceholder')" />
              <button type="button" :disabled="phoneCountdown > 0 || sendingSms" @click="sendCode('phone')">
                {{ sendingSms ? t('portal.auth.sendingCode') : phoneCountdown ? t('portal.auth.resendCode', { seconds: phoneCountdown }) : t('portal.auth.sendCode') }}
              </button>
            </span>
          </label>
          <div ref="recaptchaContainer" class="auth-panel__recaptcha" />
        </template>

        <p v-if="inlineNotice" class="auth-panel__notice" role="status">{{ inlineNotice }}</p>
        <button class="auth-panel__submit" type="submit" :disabled="submitting">
          {{ t(isRegister ? 'portal.auth.register' : 'portal.auth.login') }}
        </button>
      </form>

      <!-- 底部用于在「登录 / 注册」之间切换，并展示协议入口。 -->
      <footer class="auth-panel__footer">
        <p>
          {{ isRegister ? t('portal.auth.loginPrompt') : t('portal.auth.agreementPrefix') }}
          <button v-if="!isRegister" type="button" @click="policyVisible = true">{{ t('portal.auth.agreement') }}</button>
          <button v-else type="button" @click="$emit('switch-mode', 'login')">{{ t('portal.auth.loginLink') }}</button>
        </p>
        <p v-if="!isRegister">
          <span>{{ t('portal.auth.registerPrompt') }}</span>
          <button type="button" @click="$emit('switch-mode', 'register')">{{ t('portal.auth.registerLink') }}</button>
        </p>
      </footer>
    </template>

    <!-- 成功与错误共用这一层：success 为真时点击按钮即关闭弹窗。 -->
    <div v-else class="auth-feedback" role="alert">
      <span class="auth-feedback__seal" aria-hidden="true" />
      <h1 :id="titleId">{{ feedback.title }}</h1>
      <p>{{ feedback.description }}</p>
      <button type="button" @click="handleFeedbackAction">{{ feedback.action }}</button>
    </div>

    <!-- 隐私政策弹窗：Teleport 到 body，内容按语言包 portal.auth.policy 渲染。 -->
    <Teleport to="body">
      <Transition name="auth-policy">
        <div v-if="policyVisible" class="auth-policy-mask" @click.self="policyVisible = false">
          <div class="auth-policy" role="dialog" aria-modal="true" :aria-label="t('portal.auth.policy.title')">
            <button class="auth-policy__close" type="button" :aria-label="t('portal.common.close')"
              @click="policyVisible = false">×</button>
            <h2>{{ t('portal.auth.policy.title') }}</h2>
            <div class="auth-policy__body">
              <section v-for="section in tm('portal.auth.policy.sections')" :key="section.title">
                <h3>{{ section.title }}</h3>
                <p>{{ section.text }}</p>
              </section>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { RecaptchaVerifier } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { getFirebaseAuth } from '@/firebase'
import { useUserSession } from '@/composables/useUserSession'
import { login } from '@/api/auth'
import { signupMember } from '@/api/member'
import { sendEmailCode } from '@/api/mail'
import { sendSmsCode } from '@/api/sms'
import { ensureUvid } from '@/api/visitor'
import { setToken } from '@/api/http'

const props = defineProps({ mode: { type: String, required: true, validator: (value) => ['login', 'register'].includes(value) } })
const emit = defineEmits(['close', 'switch-mode'])

const { t, tm } = useI18n()
const { refreshMemberInfo, startDemoSession } = useUserSession()
// 当前是注册还是登录，决定标题、字段与校验项。
const isRegister = computed(() => props.mode === 'register')
// 供 aria-labelledby 使用的标题 id。
const titleId = computed(() => `auth-${props.mode}-title`)
// 反馈层内容：null 表示展示表单，否则展示成功/错误结果。
const feedback = ref(null)
// 隐私政策弹窗显隐。
const policyVisible = ref(false)
// 表单内的行内提示，例如「验证码已发送」。
const inlineNotice = ref('')
// 登录请求进行中，避免重复提交。
const submitting = ref(false)
const sendingSms = ref(false)
// 是否已发送短信验证码：发送接口以 code===1000 表示成功（不再返回数据），本地仅作标记供表单校验。
const smsSent = ref(false)
const recaptchaContainer = ref(null)
let recaptchaVerifier = null
// 邮箱与手机验证码的剩余倒计时秒数，0 表示可以重新发送。
const emailCountdown = ref(0)
const phoneCountdown = ref(0)
// 收集所有倒计时计时器，卸载时统一清理，避免内存泄漏。
const timers = new Set()
const form = reactive({ email: '', emailCode: '', country: '+1', phone: '', phoneCode: '' })
// 注册时可选择的国际区号；名称与区号文案在语言包 portal.auth.country* 中维护。
const countryOptions = [
  // { value: '+86', labelKey: 'portal.auth.countryChina' },
  { value: '+1', labelKey: 'portal.auth.countryUSA' },
  // { value: '+44', labelKey: 'portal.auth.countryUK' },
  // { value: '+61', labelKey: 'portal.auth.countryAustralia' },
  // { value: '+852', labelKey: 'portal.auth.countryHongKong' },
  // { value: '+853', labelKey: 'portal.auth.countryMacao' },
  // { value: '+886', labelKey: 'portal.auth.countryTaiwan' },
  // { value: '+65', labelKey: 'portal.auth.countrySingapore' },
  // { value: '+81', labelKey: 'portal.auth.countryJapan' },
  // { value: '+82', labelKey: 'portal.auth.countryKorea' },
]

// 依次校验邮箱格式、邮箱验证码；注册时还要校验手机号与短信验证码。
function validationMessage() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('portal.auth.invalidEmail')
  if (!form.emailCode) return t('portal.auth.missingCode')
  if (isRegister.value && !/^\d{6,15}$/.test(form.phone)) return t('portal.auth.missingPhone')
  if (isRegister.value && !form.phoneCode) return t('portal.auth.missingPhoneCode')
  if (isRegister.value && !smsSent.value) return t('portal.auth.requestSmsFirst')
  return ''
}

// 展示错误反馈（success 为 false，点击后返回表单）。
function showError(description) {
  feedback.value = { title: t('portal.auth.errorTitle'), description, action: t('portal.auth.dismiss'), success: false }
}

// 令牌写入后拉取会员资料。接口暂时不可用时仍用邮箱进入本地会话，不中断登录。
async function establishSession(email) {
  const profile = await refreshMemberInfo({ fallbackEmail: email, signOutOnAuthError: false })
  if (!profile) startDemoSession(email)
}

// 登录/注册：校验通过后调用对应接口，成功后保存 accessToken 并进入登录态。
async function submit() {
  const error = validationMessage()
  if (error) {
    showError(error)
    return
  }

  if (!isRegister.value) {
    submitting.value = true

    try {
      // silent：面板内有专属错误反馈层，关闭全局弹窗避免重复提示。
      const loginResult = await login({ email: form.email, code: form.emailCode }, { silent: true })

      if (loginResult?.accessToken) {
        setToken(loginResult.accessToken)
      }

      await establishSession(form.email)
      feedback.value = {
        title: t('portal.auth.successTitle'),
        description: t('portal.auth.successDescription'),
        action: t('portal.auth.successAction'),
        success: true,
      }
    } catch (requestError) {
      showError(requestError.message)
    } finally {
      submitting.value = false
    }

    return
  }

  // 注册：先调用注册接口，成功后用邮箱验证码自动登录（按钮为「注册并登录」）。
  submitting.value = true

  try {
    // silent：面板内有专属错误反馈层，关闭全局弹窗避免重复提示。
    await signupMember(
      {
        email: form.email,
        emailCode: form.emailCode,
        phone: form.country + form.phone,
        smsCode: form.phoneCode,
        uvid: await ensureUvid(),
      },
      { silent: true },
    )

    try {
      const loginResult = await login({ email: form.email, code: form.emailCode }, { silent: true })

      if (loginResult?.accessToken) {
        setToken(loginResult.accessToken)
      }

      await establishSession(form.email)
      feedback.value = {
        title: t('portal.auth.registerSuccessTitle'),
        description: t('portal.auth.successDescription'),
        action: t('portal.auth.successAction'),
        success: true,
      }
    } catch (loginError) {
      // 注册成功但自动登录失败（邮箱验证码可能在注册时被消费），引导用户手动登录。
      showError(t('portal.auth.autoLoginFailed'))
    }
  } catch (signupError) {
    showError(signupError.message)
  } finally {
    submitting.value = false
  }
}

// 发送后进入 60 秒倒计时，归零时自动清除该计时器。
function startCountdown(target) {
  target.value = 60
  const timer = window.setInterval(() => {
    target.value -= 1
    if (target.value <= 0) {
      window.clearInterval(timer)
      timers.delete(timer)
    }
  }, 1000)
  timers.add(timer)
}

// 发送验证码：先校验对应的邮箱/手机号，再分别调用邮箱/短信接口。
async function sendCode(kind) {
  inlineNotice.value = ''
  if (kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    showError(t('portal.auth.invalidEmail'))
    return
  }
  if (kind === 'phone' && !/^\d{6,15}$/.test(form.phone)) {
    showError(t('portal.auth.missingPhone'))
    return
  }

  if (kind === 'email') {
    try {
      // silent：面板内有专属错误反馈层，关闭全局弹窗避免重复提示。
      await sendEmailCode(form.email, { silent: true })
    } catch (requestError) {
      showError(requestError.message)
      return
    }
  }

  if (kind === 'phone') {
    if (sendingSms.value) return
    sendingSms.value = true
    smsSent.value = false
    form.phoneCode = ''

    let recaptchaToken
    try {
      if (!recaptchaContainer.value) throw new Error('reCAPTCHA container is unavailable')
      recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), recaptchaContainer.value, { size: 'invisible' })
      recaptchaToken = await recaptchaVerifier.verify()
    } catch (requestError) {
      sendingSms.value = false
      showError(requestError.code === 'firebase/config-missing'
        ? t('portal.auth.recaptchaConfigMissing')
        : t('portal.auth.recaptchaFailed'))
      return
    } finally {
      recaptchaVerifier?.clear()
      recaptchaVerifier = null
    }

    try {
      // 接口仅以 code===1000 表示发送成功（data 为空）；await 不抛错即成功。
      await sendSmsCode(
        { phoneNumber: form.country + form.phone, recaptchaToken },
        { silent: true },
      )
      smsSent.value = true
    } catch (requestError) {
      showError(requestError.message || t('portal.auth.recaptchaFailed'))
      return
    } finally {
      sendingSms.value = false
    }
  }

  startCountdown(kind === 'email' ? emailCountdown : phoneCountdown)
  inlineNotice.value = t('portal.auth.codeSent')
}

// 成功反馈点击后关闭弹窗；错误反馈点击后回到表单继续修改。
function handleFeedbackAction() {
  if (feedback.value?.success) {
    emit('close')
    return
  }
  feedback.value = null
}

// 切换登录/注册时清空反馈与提示，避免上一次的结果残留。
watch(() => props.mode, () => {
  feedback.value = null
  inlineNotice.value = ''
})

watch(() => `${form.country}${form.phone}`, () => {
  smsSent.value = false
  form.phoneCode = ''
})

// 卸载时清掉仍在运行的倒计时。
onBeforeUnmount(() => {
  timers.forEach((timer) => window.clearInterval(timer))
  recaptchaVerifier?.clear()
})
</script>

<style scoped>
/* 面板主体：毛玻璃背景 + 圆角阴影，宽度自适应但不超出视口。 */
.auth-panel {
  position: relative;
  width: min(680px, calc(100vw - 32px));
  padding: 42px 64px 38px;
  overflow: hidden;
  color: #312b24;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(220, 180, 132, .7);
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(12, 24, 32, .34);
  backdrop-filter: blur(16px);
}

/* 右下角的装饰底纹，pointer-events: none 避免挡住操作。 */
.auth-panel::after {
  position: absolute;
  right: -35px;
  bottom: -28px;
  width: 260px;
  height: 120px;
  content: '';
  pointer-events: none;
  background: url('@/assets/images/Rectangle 5.png') right bottom / contain no-repeat;
  opacity: .16;
}

.auth-panel--register { padding-block: 38px 34px; }

.auth-panel__close {
  position: absolute;
  z-index: 2;
  top: 18px;
  right: 20px;
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  place-items: center;
  color: #c99b67;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  background: rgba(255, 255, 255, .82);
  border: 1px solid #ead7c0;
  border-radius: 50%;
}

.auth-panel__header { text-align: center; }
.auth-panel__header > span,
.auth-feedback__seal {
  display: block;
  width: 54px;
  height: 18px;
  margin: -42px auto 12px;
  background: radial-gradient(circle at 50% 100%, rgba(217, 65, 31, .85), rgba(217, 65, 31, 0) 70%);
}

.auth-panel__header h1,
.auth-feedback h1 {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 2px;
}

.auth-panel__header p {
  margin: 8px 0 24px;
  color: #c69a68;
  font-size: 13px;
}

.auth-field {
  display: block;
  margin-bottom: 18px;
}

.auth-field > span:first-child {
  display: block;
  margin-bottom: 7px;
  color: #3d3934;
  font-size: 13px;
}

.auth-field input,
.auth-field select {
  width: 100%;
  height: 48px;
  padding: 0 18px;
  color: #302c28;
  background: rgba(255, 255, 255, .95);
  border: 1px solid #d9af82;
  border-radius: 999px;
  outline: 0;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.auth-field input::placeholder { color: #aaa39b; }
.auth-field input:focus,
.auth-field select:focus { border-color: #c93617; box-shadow: 0 0 0 3px rgba(201, 54, 23, .11); }

/* 输入框与验证码按钮（或区号选择）并排一行。 */
.auth-field__compound,
.auth-field__phone {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 12px;
}

.auth-field__compound > button {
  padding: 0 16px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #e43b19, #c9290e);
  border: 2px solid #e9bd89;
  border-radius: 999px;
}

.auth-field__compound > button:disabled { cursor: default; filter: grayscale(.25); opacity: .7; }
.auth-field__phone { grid-template-columns: 154px minmax(0, 1fr); }

.auth-panel__notice {
  margin: -4px 0 12px;
  color: #a66f38;
  font-size: 12px;
  text-align: center;
}

.auth-panel__submit,
.auth-feedback > button {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 50px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 20px;
  letter-spacing: 8px;
  cursor: pointer;
  background: linear-gradient(180deg, #e44220, #ce2e0e);
  border: 2px solid #edbe86;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .2);
}

.auth-panel__submit:disabled { cursor: default; filter: grayscale(.25); opacity: .7; }

.auth-panel__footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 22px;
  color: #8a837b;
  font-size: 12px;
}

.auth-panel__footer p { margin: 0; }
.auth-panel__footer a,
.auth-panel__footer button {
  padding: 0;
  margin-left: 5px;
  color: #1d5a83;
  cursor: pointer;
  background: none;
  border: 0;
}

.auth-feedback {
  position: relative;
  z-index: 1;
  padding: 30px 0 18px;
  text-align: center;
}

.auth-feedback__seal { margin: -72px auto 24px; }
.auth-feedback p { max-width: 410px; margin: 38px auto; color: #a7794e; font-size: 14px; line-height: 1.7; }
.auth-feedback > button { width: min(320px, 100%); letter-spacing: 1px; }

@media (hover: hover) and (pointer: fine) {
  .auth-panel__submit:hover,
  .auth-field__compound > button:hover:not(:disabled),
  .auth-feedback > button:hover { filter: brightness(1.08); }
}

/* 小屏压缩内边距、字号与按钮宽度。 */
@media (max-width: 600px) {
  .auth-panel,
  .auth-panel--register { width: min(440px, calc(100vw - 40px)); padding: 32px 20px 24px; border-radius: 14px; }
  .auth-panel__close { top: 12px; right: 12px; }
  .auth-panel__header h1,
  .auth-feedback h1 { padding-inline: 30px; font-size: 23px; }
  .auth-panel__header p { margin-bottom: 20px; }
  .auth-field { margin-bottom: 12px; }
  .auth-field input,
  .auth-field select { height: 46px; padding-inline: 14px; }
  .auth-field__compound { grid-template-columns: minmax(0, 1fr) 124px; gap: 8px; }
  .auth-field__phone { grid-template-columns: 122px minmax(0, 1fr); gap: 8px; }
  .auth-field__compound > button { padding-inline: 8px; font-size: 12px; }
  .auth-panel__submit { min-height: 48px; height: auto; padding: 10px 14px; font-size: 17px; line-height: 1.4; letter-spacing: 1px; }
  .auth-panel__footer { flex-direction: column; gap: 7px; align-items: center; margin-top: 18px; text-align: center; }
}

/* 隐私政策弹窗：深色遮罩 + 白色圆角卡片，正文按设计稿居中排版。 */
.auth-policy-mask {
  position: fixed;
  z-index: 3000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, .78);
}

.auth-policy {
  position: relative;
  width: min(560px, 92vw);
  padding: 36px 44px 40px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, .4);
}

.auth-policy__close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 28px;
  height: 28px;
  color: #9a9a9a;
  font-size: 20px;
  line-height: 26px;
  background: none;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: color .15s ease, background-color .15s ease;
}

.auth-policy__close:hover {
  color: #333;
  background: #f0ede8;
}

.auth-policy h2 {
  margin: 0 0 22px;
  color: #111;
  font-family: var(--font-calligraphy);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: center;
}

.auth-policy__body {
  max-height: calc(82vh - 150px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.auth-policy__body section + section {
  margin-top: 20px;
}

.auth-policy__body h3 {
  margin: 0 0 8px;
  color: #111;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}

.auth-policy__body p {
  margin: 0;
  color: #3c3c3c;
  font-size: 14px;
  line-height: 1.9;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-policy-enter-active,
.auth-policy-leave-active {
  transition: opacity .2s ease;
}

.auth-policy-enter-from,
.auth-policy-leave-to {
  opacity: 0;
}
</style>
