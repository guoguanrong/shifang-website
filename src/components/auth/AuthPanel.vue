<template>
  <!-- 登录/注册面板：表单校验、验证码倒计时与结果反馈都在这个面板内完成。 -->
  <section class="auth-panel" :class="{ 'auth-panel--register': isRegister, 'auth-panel--reset': resetMode, 'auth-panel--phone': channel === 'phone', 'auth-panel--feedback': !!feedback, 'auth-panel--feedback-error': feedback && !feedback.success }" role="dialog" aria-modal="true" :aria-labelledby="titleId">
    <button class="auth-panel__close" type="button" :aria-label="t('portal.common.close')" @click="$emit('close')">×</button>

    <!-- 没有反馈层时展示表单，否则整块替换为成功/错误提示。 -->
    <template v-if="!feedback">
      <header class="auth-panel__header">
        <img class="auth-panel__emblem" :src="registerEmblem" alt="" aria-hidden="true" />
        <h1 :id="titleId">{{ panelTitle }}</h1>
      </header>

      <!-- 邮箱/手机号渠道切换：登录与注册共用同一组字段，仅文案与提交逻辑不同。 -->
      <div class="auth-tabs" role="tablist" :aria-label="t(isRegister ? 'portal.auth.registerTitle' : resetMode ? 'portal.auth.resetTitle' : 'portal.auth.loginTitle')">
        <button type="button" role="tab" :aria-selected="channel === 'email'" :class="{ 'is-active': channel === 'email' }"
          @click="switchChannel('email')">
          {{ t(channelLabelKeys.email) }}
        </button>
        <button type="button" role="tab" :aria-selected="channel === 'phone'" :class="{ 'is-active': channel === 'phone' }"
          @click="switchChannel('phone')">
          {{ t(channelLabelKeys.phone) }}
        </button>
      </div>

      <form class="auth-panel__form" :class="{ 'auth-panel__form--login': !isRegister && !resetMode }" novalidate @submit.prevent="submit">
        <template v-if="channel === 'email'">
          <label class="auth-field">
            <span>{{ t('portal.auth.email') }}</span>
            <input v-model.trim="form.email" type="email" maxlength="254" autocomplete="email" :placeholder="t('portal.auth.emailPlaceholder')" />
          </label>
        </template>

        <!-- 手机号渠道：发送验证码复用注册的 reCAPTCHA + 短信接口，登录同样可用。 -->
        <template v-else>
          <label class="auth-field">
            <span>{{ t('portal.auth.phone') }}</span>
            <span class="auth-field__phone">
              <select v-model="form.country" :aria-label="t('portal.auth.phone')" :disabled="sendingSms">
                <option v-for="option in countryOptions" :key="option.value" :value="option.value">
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <input v-model.trim="form.phone" type="tel" inputmode="tel" maxlength="15" autocomplete="tel" :placeholder="t('portal.auth.phonePlaceholder')" :disabled="sendingSms" />
            </span>
          </label>

        </template>

        <label v-if="needsVerificationCode" class="auth-field" :class="{ 'auth-panel__login-code': !isRegister && !resetMode }">
          <span>{{ t(codeLabelKey) }}</span>
          <span class="auth-field__compound">
            <input v-if="channel === 'email'" v-model.trim="form.emailCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" :placeholder="t('portal.auth.emailCodePlaceholder')" />
            <input v-else v-model.trim="form.phoneCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" :placeholder="t('portal.auth.phoneCodePlaceholder')" />
            <button type="button" :disabled="channel === 'email' ? emailCountdown > 0 : phoneCountdown > 0 || sendingSms" @click="sendCode(channel)">
              {{ channel === 'phone' && sendingSms ? t('portal.auth.sendingCode') : (channel === 'email' ? emailCountdown : phoneCountdown) ? t('portal.auth.resendCode', { seconds: channel === 'email' ? emailCountdown : phoneCountdown }) : t('portal.auth.sendCode') }}
            </button>
          </span>
        </label>
        <div v-if="channel === 'phone' && needsVerificationCode" ref="recaptchaContainer" class="auth-panel__recaptcha" />

        <!-- 密码字段：登录为登录密码（含忘记密码入口）；注册/重置为设置+确认两栏。 -->
        <template v-if="resetMode || isRegister">
          <label class="auth-field">
            <span>{{ t('portal.auth.setPassword') }}</span>
            <input v-model="form.password" type="password" :maxlength="resetMode ? 18 : 64" autocomplete="new-password" :placeholder="t(resetMode ? 'portal.auth.resetPasswordPlaceholder' : 'portal.auth.setPasswordPlaceholder')" />
          </label>
          <label class="auth-field">
            <span>{{ t('portal.auth.confirmPassword') }}</span>
            <input v-model="form.confirmPassword" type="password" :maxlength="resetMode ? 18 : 64" autocomplete="new-password" :placeholder="t('portal.auth.confirmPasswordPlaceholder')" />
          </label>
        </template>
        <div v-else class="auth-login-method-group">
          <label v-if="loginMethod === 'password'" class="auth-field">
            <span>{{ t('portal.auth.loginPassword') }}</span>
            <span class="auth-field__password-control">
              <input v-model="form.password" type="password" maxlength="64" autocomplete="current-password" :placeholder="t('portal.auth.loginPasswordPlaceholder')" />
              <button type="button" class="auth-field__forgot" @click="startReset">{{ t('portal.auth.forgotPassword') }}</button>
            </span>
          </label>
          <button class="auth-login-method" type="button" @click="switchLoginMethod">
            {{ t(loginMethod === 'password' ? 'portal.auth.loginWithCode' : 'portal.auth.loginWithPassword') }}
            <span class="auth-login-method__arrow" aria-hidden="true">›</span>
          </button>
        </div>

        <div v-if="!resetMode && !isRegister" class="auth-panel__agreement">
          {{ t('portal.auth.agreementPrefix') }}
          <button type="button" @click="policyVisible = true">{{ t('portal.auth.agreement') }}</button>
        </div>

        <p v-if="inlineNotice" class="auth-panel__notice" role="status">{{ inlineNotice }}</p>
        <button class="auth-panel__submit" type="submit" :disabled="submitting">
          {{ resetMode ? t('portal.auth.resetSubmit') : t(isRegister ? 'portal.auth.register' : 'portal.auth.login') }}
        </button>
      </form>

      <!-- 底部：协议入口 + 登录/注册互切（重置模式不显示）。 -->
      <footer v-if="!resetMode && !isRegister" class="auth-panel__footer">
        <p>
          <span>{{ t('portal.auth.registerPrompt') }}</span>
          <button type="button" @click="$emit('switch-mode', 'register')">{{ t('portal.auth.registerLink') }}</button>
        </p>
      </footer>
    </template>

    <!-- 成功与错误共用这一层：success 为真时点击按钮即关闭弹窗。 -->
    <div v-else class="auth-feedback" role="alert">
      <img class="auth-feedback__seal" :src="registerEmblem" alt="" aria-hidden="true" />
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
import { resetMemberPassword, signupMember } from '@/api/member'
import { sendEmailCode } from '@/api/mail'
import { sendSmsCode } from '@/api/sms'
import { ensureUvid } from '@/api/visitor'
import { setToken } from '@/api/http'
import registerEmblem from '@/assets/events/register-emblem.png'

const props = defineProps({ mode: { type: String, required: true, validator: (value) => ['login', 'register'].includes(value) } })
const emit = defineEmits(['close', 'switch-mode', 'authenticated'])

const { t, tm } = useI18n()
const { refreshMemberInfo, startDemoSession } = useUserSession()
// 当前是注册还是登录，决定标题、按钮与提交逻辑。
const isRegister = computed(() => props.mode === 'register')
const loginMethod = ref('password')
// 当前登录/注册渠道：email 邮箱验证码，phone 手机号短信验证码；登录与注册共用同一组字段。
const channel = ref('email')
// 重置密码模式：从登录页“忘记密码”进入，复用面板与渠道切换。
const resetMode = ref(false)
const needsVerificationCode = computed(() => isRegister.value || resetMode.value || loginMethod.value === 'code')
const codeLabelKey = computed(() => {
  if (resetMode.value) return channel.value === 'email' ? 'portal.auth.resetEmailCode' : 'portal.auth.resetPhoneCode'
  if (!isRegister.value) return channel.value === 'email' ? 'portal.auth.loginEmailCode' : 'portal.auth.loginPhoneCode'
  return channel.value === 'email' ? 'portal.auth.emailCode' : 'portal.auth.phoneCode'
})
// 面板标题随模式变化：重置密码 / 账号注册 / 登录。
const panelTitle = computed(() => t(resetMode.value ? 'portal.auth.resetTitle' : isRegister.value ? 'portal.auth.registerTitle' : 'portal.auth.loginTitle'))
// 渠道 tab 文案随模式变化。
const channelLabelKeys = computed(() => {
  if (resetMode.value) return { email: 'portal.auth.emailResetTab', phone: 'portal.auth.phoneResetTab' }
  return isRegister.value
    ? { email: 'portal.auth.emailRegister', phone: 'portal.auth.phoneRegister' }
    : { email: 'portal.auth.emailLogin', phone: 'portal.auth.phoneLogin' }
})

// 进入重置密码：切换到重置表单并清空反馈。
function startReset() {
  resetMode.value = true
  loginMethod.value = 'password'
  feedback.value = null
  inlineNotice.value = ''
}

function switchLoginMethod() {
  loginMethod.value = loginMethod.value === 'password' ? 'code' : 'password'
  feedback.value = null
  inlineNotice.value = ''
}
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
const form = reactive({ email: '', emailCode: '', country: '+86', phone: '', phoneCode: '', password: '', confirmPassword: '' })
// 按设计稿默认中国大陆区号，同时保留原有美国区号选项。
const countryOptions = [
  { value: '+86', labelKey: 'portal.auth.countryChina' },
  { value: '+1', labelKey: 'portal.auth.countryUSA' },
]

// 切换渠道时清空上一渠道的反馈与提示，避免结果残留。
function switchChannel(next) {
  if (channel.value === next) return
  channel.value = next
  feedback.value = null
  inlineNotice.value = ''
}

// 按当前渠道校验：邮箱渠道验邮箱+邮箱验证码；手机号渠道验手机号+短信验证码+已发送标记。
function validationMessage() {
  if (channel.value === 'email') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) return t('portal.auth.invalidEmail')
    if (needsVerificationCode.value && !form.emailCode) return t('portal.auth.missingCode')
  } else {
    if (!/^\d{6,15}$/.test(form.phone)) return t('portal.auth.missingPhone')
    if (needsVerificationCode.value) {
      if (!form.phoneCode) return t('portal.auth.missingPhoneCode')
      if (!smsSent.value) return t('portal.auth.requestSmsFirst')
    }
  }

  if (resetMode.value || isRegister.value) {
    if (resetMode.value) {
      if (form.password.length < 6 || form.password.length > 18) return t('portal.auth.resetPasswordRuleError')
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/.test(form.password)) {
      return t('portal.auth.passwordRuleError')
    }
    if (form.confirmPassword !== form.password) return t('portal.auth.passwordMismatch')
    return ''
  }

  if (loginMethod.value === 'password' && !form.password) return t('portal.auth.loginPasswordMissing')
  return ''
}

// 展示错误反馈（success 为 false，点击后返回表单）。
function showError(description) {
  feedback.value = { title: t('portal.auth.errorTitle'), description, action: t('portal.auth.dismiss'), success: false }
}

// 令牌写入后拉取会员资料。接口暂时不可用时仍用账号进入本地会话，不中断登录。
async function establishSession(account) {
  const profile = await refreshMemberInfo({ fallbackEmail: account, signOutOnAuthError: false })
  if (!profile) startDemoSession(account)
}

// 登录/注册：校验通过后调用对应接口，成功后保存 accessToken 并进入登录态。
// 登录接口的 email 字段既传邮箱也传“区号+手机号”（后端同一接口识别）；
// clientId 由接口封装附加，grantType 按验证码/密码登录自动区分。
async function submit() {
  const account = channel.value === 'email' ? form.email : form.country + form.phone
  const code = needsVerificationCode.value ? (channel.value === 'email' ? form.emailCode : form.phoneCode) : ''

  const error = validationMessage()
  if (error) {
    showError(error)
    return
  }

  // 重置密码：按所选渠道传手机号或邮箱，以及验证码、新密码和确认密码。
  if (resetMode.value) {
    submitting.value = true
    try {
      const resetPayload = {
        ...(channel.value === 'email' ? { email: form.email } : { phone: account }),
        newPwd: form.password,
        confirmPwd: form.confirmPassword,
        code,
      }

      await resetMemberPassword(resetPayload, { silent: true })
      feedback.value = {
        title: t('portal.auth.resetSuccessTitle'),
        description: t('portal.auth.successDescription'),
        action: t('portal.auth.resetSuccessAction'),
        success: true,
      }
    } catch (requestError) {
      showError(requestError.message)
    } finally {
      submitting.value = false
    }
    return
  }

  if (!isRegister.value) {
    submitting.value = true

    try {
      // silent：面板内有专属错误反馈层，关闭全局弹窗避免重复提示。
      // 验证码登录只传 code，密码登录只传 password，grantType 由接口封装按密码区分。
      const loginPayload = loginMethod.value === 'password'
        ? { email: account, password: form.password }
        : { email: account, code }
      const loginResult = await login(loginPayload, { silent: true })

      if (loginResult?.accessToken) {
        setToken(loginResult.accessToken)
      }

      await establishSession(account)
      feedback.value = {
        title: t('portal.auth.successTitle'),
        description: t('portal.auth.successDescription'),
        action: t('portal.auth.successAction'),
        success: true,
      }
      emit('authenticated')
    } catch (requestError) {
      showError(requestError.message)
    } finally {
      submitting.value = false
    }

    return
  }

  // 注册：按渠道只传对应字段——手机号注册不传邮箱字段，邮箱注册不传手机号字段。
  submitting.value = true

  try {
    const signupPayload = channel.value === 'email'
      ? { email: form.email, emailCode: form.emailCode, password: form.password, uvid: await ensureUvid() }
      : { phone: form.country + form.phone, smsCode: form.phoneCode, password: form.password, uvid: await ensureUvid() }

    // silent：面板内有专属错误反馈层，关闭全局弹窗避免重复提示。
    await signupMember(signupPayload, { silent: true })

    try {
      // 注册成功后用刚设置的密码自动登录（注册验证码可能已被消费，不再复用）。
      const loginResult = await login({ email: account, password: form.password }, { silent: true })

      if (loginResult?.accessToken) {
        setToken(loginResult.accessToken)
      }

      await establishSession(account)
      feedback.value = {
        title: t('portal.auth.registerSuccessTitle'),
        description: t('portal.auth.successDescription'),
        action: t('portal.auth.registerSuccessAction'),
        success: true,
      }
      emit('authenticated')
    } catch (loginError) {
      // 注册成功但自动登录失败（验证码可能在注册时被消费），引导用户手动登录。
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
  if (kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
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
  resetMode.value = false
  loginMethod.value = 'password'
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
/* 登录、注册、找回密码按设计稿使用不同面板宽度与表单密度。 */
.auth-panel {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  width: min(460px, calc(100vw - 32px));
  padding: 44px 40px 32px;
  overflow: hidden;
  color: #312b24;
  font-family: var(--font-calligraphy);
  background: linear-gradient(155deg, rgba(218, 216, 211, .96) 0%, rgba(255, 255, 255, .98) 72%);
  border: 1px solid #d6b28b;
  border-radius: 18px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, .32), inset 0 0 0 1px rgba(255, 255, 255, .6);
  backdrop-filter: blur(12px);
}

.auth-panel::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: '';
  pointer-events: none;
  background-image: url('@/assets/images/Rectangle 5.png'), url('@/assets/images/Rectangle 5.png');
  background-repeat: no-repeat;
  background-position: top center, bottom center;
  background-size: 100% 78px, 100% 78px;
  opacity: .2;
}

.auth-panel--register { width: min(370px, calc(100vw - 32px)); padding: 36px 30px 20px; }
.auth-panel--reset { width: min(535px, calc(100vw - 32px)); padding: 54px 46px 42px; }
.auth-panel--feedback { min-height: 322px; }

.auth-panel__close {
  position: absolute;
  z-index: 2;
  top: 18px;
  right: 18px;
  display: grid;
  width: 38px;
  height: 38px;
  padding: 0;
  place-items: center;
  color: #c99b67;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  background: rgba(255, 255, 255, .74);
  border: 1px solid rgba(234, 215, 192, .72);
  border-radius: 50%;
  transition: color .18s ease, background-color .18s ease;
}

.auth-panel__header,
.auth-tabs,
.auth-panel form,
.auth-panel__footer,
.auth-feedback { position: relative; z-index: 1; }

.auth-panel__header { min-height: 30px; text-align: center; }
.auth-panel__emblem,
.auth-feedback__seal {
  position: absolute;
  z-index: 0;
  top: -28px;
  left: 50%;
  display: block;
  width: 78px;
  height: 78px;
  object-fit: contain;
  pointer-events: none;
  transform: translateX(-50%);
}

.auth-panel__header h1,
.auth-feedback h1 {
  position: relative;
  z-index: 1;
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 25px;
  font-weight: 400;
  letter-spacing: 2px;
  line-height: 1.3;
}

/* 邮箱/手机号渠道切换：文字 tab，激活项红字并带底部短横。 */
.auth-tabs {
  display: flex;
  justify-content: center;
  gap: 42px;
  margin: 16px 0 22px;
}

.auth-tabs button {
  position: relative;
  padding: 4px 2px 9px;
  color: #312b24;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  background: none;
  border: 0;
  transition: color .18s ease;
}

.auth-tabs button::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 26px;
  height: 3px;
  content: '';
  background: #c93617;
  border-radius: 2px;
  opacity: 0;
  transform: translateX(-50%);
  transition: opacity .18s ease;
}

.auth-tabs button:hover { color: #c93617; }

.auth-tabs button.is-active {
  color: #c93617;
  font-weight: 500;
}

.auth-tabs button.is-active::after { opacity: 1; }

.auth-field {
  display: block;
  margin-bottom: 18px;
}

.auth-field > span:first-child {
  display: block;
  margin-bottom: 6px;
  color: #3d3934;
  font-size: 13px;
  line-height: 1.3;
}

/* 输入内容（邮箱/手机号/验证码）保持清晰，避免书法体数字难以辨认。 */
.auth-field input,
.auth-field select {
  box-sizing: border-box;
  width: 100%;
  height: 42px;
  padding: 0 18px;
  color: #302c28;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  background: rgba(255, 255, 255, .95);
  border: 1px solid #d9af82;
  border-radius: 999px;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.auth-field input::placeholder { color: #aaa39b; }

/* 字段标题行：登录密码行右侧放“忘记密码”入口。 */
.auth-field__label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.auth-field__forgot {
  padding: 0;
  color: #1d5a83;
  font-family: var(--font-ui-international, Arial, sans-serif);
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  background: none;
  border: 0;
  transition: color .15s ease;
}

.auth-field__forgot:hover { color: #c93617; }
.auth-field input:focus,
.auth-field select:focus { border-color: #c93617; box-shadow: 0 0 0 3px rgba(201, 54, 23, .11); }

/* 输入框与验证码按钮（或区号选择）并排一行。 */
.auth-field__compound,
.auth-field__phone {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(122px, 32%);
  gap: 8px;
}

.auth-field__compound > button {
  min-width: 0;
  padding: 0 10px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  background: #c8320e url('@/assets/cuts/login-button-bg.png') center / 100% 100% no-repeat;
  border: 0;
  border-radius: 999px;
}

.auth-field__compound > button:disabled { cursor: default; filter: grayscale(.25); opacity: .7; }
.auth-field__phone {
  grid-template-columns: 116px minmax(0, 1fr);
  gap: 0;
  height: 42px;
  overflow: hidden;
  background: rgba(255, 255, 255, .95);
  border: 1px solid #d9af82;
  border-radius: 999px;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.auth-field__phone:focus-within { border-color: #c93617; box-shadow: 0 0 0 3px rgba(201, 54, 23, .11); }
.auth-field__phone select,
.auth-field__phone input {
  height: 100%;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.auth-field__phone select {
  padding: 0 8px 0 12px;
  border-right: 1px solid #e5d2bc;
  font-family: var(--font-calligraphy);
  font-size: 12px;
}
.auth-field__phone input { min-width: 0; padding-inline: 12px; }
.auth-field__phone select:focus,
.auth-field__phone input:focus { border: 0; box-shadow: none; }

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
  height: 42px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 20px;
  letter-spacing: 8px;
  cursor: pointer;
  background: #c8320e url('@/assets/cuts/login-button-bg.png') center / 100% 100% no-repeat;
  border: 0;
  border-radius: 999px;
  text-shadow: 0 1px 1px rgba(92, 24, 5, .25);
}

.auth-panel__submit:disabled { cursor: default; filter: grayscale(.25); opacity: .7; }

.auth-panel__footer {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  color: #8a837b;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
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
  text-decoration: underline;
  text-underline-offset: 2px;
}

.auth-feedback {
  min-height: 220px;
  padding: 8px 0 0;
  text-align: center;
}

.auth-feedback__seal { top: -24px; }
.auth-feedback h1 { padding-top: 0; }
.auth-feedback p { max-width: 410px; margin: 36px auto 66px; color: #b18a62; font-size: 16px; line-height: 1.7; }
.auth-feedback > button { display: block; width: min(250px, 100%); margin: 0 auto; letter-spacing: 1px; }

.auth-panel--register .auth-panel__header { min-height: 28px; }
.auth-panel--register .auth-panel__header h1 { font-size: 19px; letter-spacing: 1px; }
.auth-panel--register .auth-tabs { gap: 28px; margin: 12px 0 20px; }
.auth-panel--register .auth-field { margin-bottom: 12px; }
.auth-panel--register .auth-field > span:first-child { margin-bottom: 4px; font-size: 12px; }
.auth-panel--register .auth-field input,
.auth-panel--register .auth-field select,
.auth-panel--register .auth-field__phone { height: 34px; }
.auth-panel--register .auth-field__compound > button { font-size: 12px; }
.auth-panel--register .auth-panel__submit { height: 36px; font-size: 16px; letter-spacing: 4px; }
.auth-panel--register .auth-panel__footer { flex-direction: row; flex-wrap: wrap; gap: 4px 10px; margin-top: 10px; font-size: 10px; }

.auth-panel--reset .auth-tabs { margin: 20px 0 46px; }
.auth-panel--reset .auth-field { margin-bottom: 30px; }
.auth-panel--reset .auth-field input,
.auth-panel--reset .auth-field select,
.auth-panel--reset .auth-field__phone { height: 47px; }
.auth-panel--reset .auth-panel__submit { height: 48px; }
.auth-panel--reset .auth-field__compound > button { font-size: 15px; }

html[data-locale-layout='international'] .auth-panel { font-family: var(--font-serif-cn); }
html[data-locale-layout='international'] .auth-panel__header h1,
html[data-locale-layout='international'] .auth-feedback h1,
html[data-locale-layout='international'] .auth-panel__submit,
html[data-locale-layout='international'] .auth-field__compound > button,
html[data-locale-layout='international'] .auth-feedback > button { font-family: var(--font-serif-cn); letter-spacing: 1px; }
html[data-locale-layout='international'] .auth-panel--register .auth-panel__header h1 { font-size: 17px; }
html[data-locale-layout='international'] .auth-tabs { gap: 28px; }
html[data-locale-layout='international'] .auth-panel--reset .auth-tabs { gap: 20px; }

@media (hover: hover) and (pointer: fine) {
  .auth-panel__submit:hover,
  .auth-field__compound > button:hover:not(:disabled),
  .auth-feedback > button:hover { filter: brightness(1.08); }
  .auth-panel__close:hover { color: #b34a28; background: #fff; }
}

/* 小屏保留设计中的胶囊字段，并为验证码按钮和区号留足空间。 */
@media (max-width: 600px) {
  .auth-panel { width: min(460px, calc(100vw - 32px)); padding: 38px 24px 28px; border-radius: 16px; }
  .auth-panel--register { width: min(370px, calc(100vw - 32px)); padding: 32px 20px 18px; }
  .auth-panel--reset { width: min(535px, calc(100vw - 32px)); padding: 44px 24px 30px; }
  .auth-panel--feedback { min-height: 300px; }
  .auth-panel__close { top: 12px; right: 12px; width: 34px; height: 34px; }
  .auth-panel__header h1,
  .auth-feedback h1 { padding-inline: 30px; font-size: 22px; }
  .auth-panel--register .auth-panel__header h1 { font-size: 17px; }
  .auth-tabs { gap: 26px; margin: 14px 0 18px; }
  .auth-panel--register .auth-tabs { gap: 18px; margin: 10px 0 16px; }
  .auth-panel--reset .auth-tabs { gap: 18px; margin: 16px 0 30px; }
  .auth-field { margin-bottom: 14px; }
  .auth-field input,
  .auth-field select { height: 40px; padding-inline: 12px; }
  .auth-field__compound { grid-template-columns: minmax(0, 1fr) 112px; gap: 7px; }
  .auth-field__phone { grid-template-columns: 108px minmax(0, 1fr); }
  .auth-field__compound > button { padding-inline: 6px; font-size: 12px; }
  .auth-panel--register .auth-field { margin-bottom: 10px; }
  .auth-panel--register .auth-field input,
  .auth-panel--register .auth-field select,
  .auth-panel--register .auth-field__phone { height: 34px; }
  .auth-panel--reset .auth-field { margin-bottom: 20px; }
  .auth-panel--reset .auth-field input,
  .auth-panel--reset .auth-field select,
  .auth-panel--reset .auth-field__phone { height: 44px; }
  .auth-panel__submit { height: 42px; font-size: 18px; letter-spacing: 4px; }
  .auth-panel--register .auth-panel__submit { height: 36px; font-size: 15px; }
  .auth-panel--reset .auth-panel__submit { height: 44px; }
  .auth-panel__footer { gap: 8px; margin-top: 16px; font-size: 11px; }
  .auth-panel--register .auth-panel__footer { gap: 4px 8px; margin-top: 8px; font-size: 9px; }
  .auth-feedback { min-height: 220px; }
  .auth-feedback p { margin: 30px auto 54px; font-size: 14px; }
}

/* 隐私政策弹窗：深色遮罩 + 白色圆角卡片，正文按设计稿居中排版。 */
/* Figma auth frames: 680px panels with 60px controls and roomier typography. */
.auth-panel {
  width: min(680px, calc(100vw - 32px));
  min-height: 723px;
  padding: 24px 58px 35px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .78), rgba(255, 255, 255, .98) 32%, #fff);
  border-color: rgba(194, 159, 121, .5);
  border-radius: 20px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, .25);
  backdrop-filter: none;
}

.auth-panel--register,
.auth-panel--reset {
  width: min(680px, calc(100vw - 32px));
  min-height: 837px;
  padding: 24px 58px 40px;
}

.auth-panel--register .auth-panel__header,
.auth-panel--reset .auth-panel__header { height: 98px; min-height: 98px; }

.auth-panel--register .auth-tabs,
.auth-panel--reset .auth-tabs { margin: 24px 0 40px; }

.auth-panel--register.auth-panel--phone,
.auth-panel--reset.auth-panel--phone { min-height: 819px; }

.auth-panel--register.auth-panel--phone .auth-panel__form,
.auth-panel--reset.auth-panel--phone .auth-panel__form { gap: 24px; }

.auth-panel.auth-panel--feedback {
  width: min(680px, calc(100vw - 32px));
  min-height: 410px;
  padding: 24px 58px 40px;
}

.auth-panel__close {
  top: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  font-size: 25px;
}

.auth-panel__header {
  height: 98px;
  min-height: 98px;
}

.auth-panel__emblem {
  top: 0;
  width: 138px;
  height: 138px;
}

.auth-panel__header h1,
.auth-feedback h1 {
  position: absolute;
  top: 50px;
  left: 50%;
  width: max-content;
  max-width: calc(100% - 56px);
  padding: 0;
  font-size: 32px;
  letter-spacing: 0;
  line-height: 1.25;
  transform: translateX(-50%);
}

.auth-tabs {
  gap: 80px;
  margin: 24px 0 24px;
}

.auth-tabs button {
  padding: 0 2px 17px;
  font-size: 24px;
  line-height: 1.2;
}

.auth-tabs button::after {
  bottom: 0;
  width: 40px;
  height: 5px;
  border-radius: 10px;
}

.auth-panel--register .auth-tabs,
.auth-panel--reset .auth-tabs {
  margin-bottom: 40px;
}

.auth-panel__form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 0;
}

.auth-panel__recaptcha {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  pointer-events: none;
}

.auth-field {
  margin: 0;
}

.auth-field > span:first-child {
  margin-bottom: 14px;
  color: #111;
  font-size: 18px;
  line-height: 1.2;
}

.auth-field input,
.auth-field select {
  height: 60px;
  padding-inline: 24px;
  font-size: 18px;
}

.auth-field__compound {
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 10px;
}

.auth-field__compound > button {
  min-height: 60px;
  font-size: 18px;
}

.auth-field__phone {
  grid-template-columns: 138px minmax(0, 1fr);
  height: 60px;
}

.auth-field__phone select {
  padding: 0 22px 0 24px;
  font-family: inherit;
  font-size: 16px;
}

.auth-field__phone input {
  min-width: 0;
  padding-inline: 14px 24px;
}

.auth-login-method-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-panel__form--login > .auth-panel__login-code ~ .auth-login-method-group {
  margin-top: -14px;
}

.auth-field__password-control {
  display: flex;
  height: 60px;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  background: #fff;
  border: 1px solid #c29f79;
  border-radius: 999px;
}

.auth-field__password-control input {
  min-width: 0;
  height: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
}

.auth-field__password-control input:focus {
  border: 0;
  box-shadow: none;
}

.auth-field__forgot {
  flex: 0 0 auto;
  font-size: 18px;
}

.auth-login-method {
  display: inline-flex;
  align-self: flex-end;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: #2b59a2;
  font-family: inherit;
  font-size: 18px;
  line-height: 1.35;
  cursor: pointer;
  background: none;
  border: 0;
}

.auth-login-method__arrow {
  font-family: Arial, sans-serif;
  font-size: 24px;
  line-height: .8;
}

.auth-panel__agreement {
  margin-top: 10px;
  color: rgba(105, 105, 105, .91);
  font-size: 18px;
  line-height: 1.3;
  text-align: center;
}

.auth-panel__agreement button {
  padding: 0;
  color: #2b59a2;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  background: none;
  border: 0;
}

.auth-panel__submit {
  height: 60px;
  margin-top: -14px;
  font-size: 24px;
  letter-spacing: 7px;
}

.auth-panel__footer {
  margin-top: 40px;
  font-size: 24px;
  line-height: 1.2;
}

.auth-panel__footer p { margin: 0; }

.auth-panel--register .auth-panel__header h1,
.auth-panel--reset .auth-panel__header h1 { font-size: 32px; }

.auth-panel--register .auth-field,
.auth-panel--reset .auth-field { margin: 0; }

.auth-panel--register .auth-field > span:first-child,
.auth-panel--reset .auth-field > span:first-child {
  margin-bottom: 14px;
  font-size: 18px;
}

.auth-panel--register .auth-field input,
.auth-panel--reset .auth-field input,
.auth-panel--register .auth-field select,
.auth-panel--reset .auth-field select,
.auth-panel--register .auth-field__phone,
.auth-panel--reset .auth-field__phone { height: 60px; }

.auth-panel--register .auth-field__compound > button,
.auth-panel--reset .auth-field__compound > button { font-size: 18px; }

.auth-panel--register .auth-panel__submit,
.auth-panel--reset .auth-panel__submit {
  height: 60px;
  margin-top: 0;
  font-size: 24px;
  letter-spacing: 7px;
}

.auth-panel--feedback .auth-panel__close { top: 30px; right: 30px; }

.auth-feedback {
  min-height: 286px;
  padding: 50px 0 0;
}

.auth-feedback__seal { top: 0; width: 138px; height: 138px; }

.auth-feedback h1 { top: 50px; }

.auth-feedback p {
  max-width: 560px;
  margin: 92px auto 90px;
  color: #c29f79;
  font-size: 24px;
  line-height: 1.4;
}

.auth-panel.auth-panel--feedback { padding-bottom: 36px; }

.auth-panel.auth-panel--feedback-error { min-height: 380px; }

.auth-panel--feedback-error .auth-feedback__seal { top: 28px; }

.auth-panel--feedback-error .auth-feedback h1 { top: 78px; letter-spacing: 19.2px; }

.auth-panel--feedback-error .auth-feedback p { margin: 116px auto 30px; }

.auth-panel--feedback-error .auth-feedback > button { width: 180px; }

.auth-feedback > button {
  width: 320px;
  height: 60px;
  font-size: 24px;
}

html[data-locale-layout='international'] .auth-panel__header h1,
html[data-locale-layout='international'] .auth-feedback h1 { font-size: 28px; }

html[data-locale-layout='international'] .auth-tabs { gap: 48px; }

html[data-locale-layout='international'] .auth-tabs button { font-size: 20px; }

html[data-locale-layout='international'] .auth-panel__footer { font-size: 18px; }

@media (max-width: 600px) {
  .auth-panel,
  .auth-panel--register,
  .auth-panel--reset,
  .auth-panel.auth-panel--feedback {
    width: min(680px, calc(100vw - 24px));
    min-height: 0;
    padding: 20px 22px 28px;
    border-radius: 16px;
  }

  .auth-panel--register.auth-panel--phone,
  .auth-panel--reset.auth-panel--phone { min-height: 0; }

  .auth-panel--register.auth-panel--phone .auth-panel__form,
  .auth-panel--reset.auth-panel--phone .auth-panel__form { gap: 20px; }

  .auth-panel__close { top: 14px; right: 14px; width: 34px; height: 34px; }
  .auth-panel__header { height: 82px; min-height: 82px; }
  .auth-panel--register .auth-panel__header,
  .auth-panel--reset .auth-panel__header { height: 82px; min-height: 82px; }
  .auth-panel__emblem { width: 100px; height: 100px; }
  .auth-panel__header h1,
  .auth-feedback h1 { top: 36px; max-width: calc(100% - 40px); font-size: 22px; }
  .auth-panel--register .auth-panel__header h1,
  .auth-panel--reset .auth-panel__header h1 { font-size: 20px; }
  .auth-tabs { gap: 24px; margin: 18px 0 20px; }
  .auth-tabs button { padding-bottom: 12px; font-size: 16px; }
  .auth-panel--register .auth-tabs,
  .auth-panel--reset .auth-tabs { margin-bottom: 24px; }
  .auth-panel__form { gap: 20px; }
  .auth-field > span:first-child { margin-bottom: 8px; font-size: 14px; }
  .auth-panel--register .auth-field > span:first-child,
  .auth-panel--reset .auth-field > span:first-child { margin-bottom: 8px; font-size: 14px; }
  .auth-field input,
  .auth-field select,
  .auth-field__phone { height: 50px; font-size: 15px; }
  .auth-panel--register .auth-field input,
  .auth-panel--register .auth-field select,
  .auth-panel--register .auth-field__phone,
  .auth-panel--reset .auth-field input,
  .auth-panel--reset .auth-field select,
  .auth-panel--reset .auth-field__phone { height: 50px; font-size: 15px; }
  .auth-field__compound { grid-template-columns: minmax(0, 1fr) 112px; gap: 7px; }
  .auth-field__compound > button { min-height: 50px; padding-inline: 6px; font-size: 13px; }
  .auth-panel--register .auth-field__compound > button,
  .auth-panel--reset .auth-field__compound > button { min-height: 50px; font-size: 13px; }
  .auth-field__phone { grid-template-columns: 118px minmax(0, 1fr); }
  .auth-field__phone select { padding-inline: 12px; font-size: 13px; }
  .auth-field__phone input { padding-inline: 10px; }
  .auth-field__password-control { height: 50px; gap: 8px; padding-inline: 14px; }
  .auth-field__forgot,
  .auth-login-method,
  .auth-panel__agreement { font-size: 13px; }
  .auth-login-method-group { gap: 12px; }
  .auth-panel__form--login > .auth-panel__login-code ~ .auth-login-method-group { margin-top: -8px; }
  .auth-panel__submit,
  .auth-panel--register .auth-panel__submit,
  .auth-panel--reset .auth-panel__submit { height: 48px; font-size: 18px; letter-spacing: 4px; }
  .auth-panel__footer { margin-top: 24px; font-size: 15px; }
  .auth-feedback { min-height: 250px; padding-top: 36px; }
  .auth-feedback__seal { width: 100px; height: 100px; }
  .auth-feedback p { margin: 58px auto 46px; font-size: 16px; }
  .auth-feedback > button { width: min(320px, 100%); height: 48px; font-size: 18px; }
  .auth-panel--feedback-error .auth-feedback__seal { top: 0; }
  .auth-panel--feedback-error .auth-feedback h1 { top: 36px; letter-spacing: 4px; }
  .auth-panel--feedback-error .auth-feedback p { margin: 52px auto 30px; font-size: 15px; }
  .auth-panel--feedback-error .auth-feedback > button { width: min(180px, 100%); }
}

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
