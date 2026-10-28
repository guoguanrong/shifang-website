<template>
  <div class="deity-actions" :class="{ 'is-large': props.large, 'has-offering-label': worship || worshipLoaded }">
    <button class="primary" type="button" :disabled="loading" @click.stop="goToLamp">
      {{ t('deities.actions.light') }}
    </button>
    <!-- 供奉按钮带上神明 id 跳转，供奉页据此回显对应神明；.stop 避免触发卡片自身的点击。 -->
    <button class="secondary" type="button" @click.stop="router.push({ name: 'deity-offering', query: { deity: props.deityId } })">{{ t('deities.actions.offer') }}</button>
    <p v-if="lightError" class="light-error" role="status">{{ lightError }}</p>
    <!-- <p v-if="worship" class="offering-prices">
      {{ t('deities.monthlyPrice') }} ${{ formatPrice(worship.monthPrice) }} · {{ t('deities.yearlyPrice') }} ${{ formatPrice(worship.yearPrice) }}
    </p> -->
    <!-- <p v-else-if="worshipLoaded" class="offering-unavailable">{{ t('deities.worshipUnavailable') }}</p> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getLightByGodName } from '@/api/light'

// large 用于详情页放大版样式；deityId 会随供奉按钮一起传给供奉页。
const props = defineProps({
  large: Boolean,
  deityId: { type: String, default: 'doumu' },
  worship: { type: Object, default: null },
  worshipLoaded: { type: Boolean, default: false },
})
const router = useRouter()
const { t } = useI18n()
const loading = ref(false)
const lightError = ref('')

function formatPrice(value) {
  const price = Number(value)
  return Number.isFinite(price) ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'
}

const deityNames = {
  doumu: '斗姆元君',
  beidou: '北斗九皇',
  taisui: '六十甲子太岁',
  sanguan: '三官大帝',
  wenchang: '文昌帝君',
  kuixing: '魁星帝君',
  zhaogongming: '玄坛赵元帅',
  wanglingguan: '王灵官',
  guansheng: '关圣帝君',
  dongyue: '东岳大帝',
  leizun: '九天应元雷声普化天尊',
  fanli: '文财神范蠡',
  tudigong: '福德正神',
  foxian: '狐仙',
}

function getLampRouteId(light) {
  const name = String(light.name || '')
  if (/光明|guangming/i.test(name)) return 'guangming'
  if (/太岁|taisui/i.test(name)) return 'taisui'
  if (/文昌|wenchang/i.test(name)) return 'wenchang'
  return `lamp-${light.id}`
}

async function goToLamp() {
  if (loading.value) return
  lightError.value = ''
  const deityName = deityNames[props.deityId]
  if (!deityName) {
    lightError.value = t('deities.lightUnknownDeity')
    return
  }

  loading.value = true
  try {
    const light = await getLightByGodName(deityName)
    if (!light?.id) {
      lightError.value = t('deities.lightUnavailable')
      return
    }
    await router.push({
      name: 'lamp-detail',
      params: { lampId: getLampRouteId(light) },
      query: { lightId: String(light.id) },
    })
  } catch (error) {
    lightError.value = error.userMessage || t('deities.lightLookupFailed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 两枚等宽按钮；is-large 时整体放大并加宽。 */
.deity-actions {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 157.5px));
  gap: 33.5px;
}

.deity-actions .primary:disabled {
  cursor: wait;
  opacity: .7;
}

.light-error {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  margin: 0;
  color: #a53a24;
  font-size: 12px;
  line-height: 1.4;
}

.deity-actions.has-offering-label {
  row-gap: 3px;
}

.offering-prices,
.offering-unavailable {
  grid-column: 1 / -1;
  margin: 0;
  color: #765a3e;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
}

.offering-unavailable {
  color: #8f493f;
}

.deity-actions button {
  position: relative;
  height: 40px;
  padding: 0 16px 4px;
  color: #fff;
  font: inherit;
  font-size: 16px;
  line-height: 36px;
  white-space: nowrap;
  border: 0;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px #f2b15f, 0 5px 8px rgba(52, 28, 15, .2);
  cursor: pointer;
  transition: filter .2s ease, transform .2s ease, box-shadow .2s ease;
}

.deity-actions button::before,
.deity-actions button::after {
  position: absolute;
  top: 50%;
  width: 5px;
  height: 5px;
  content: '';
  border: 1px solid #f6cc8e;
  transform: translateY(-50%) rotate(45deg);
}

.deity-actions button::before {
  left: 4px;
}

.deity-actions button::after {
  right: 4px;
}

.deity-actions .primary {
  background: linear-gradient(180deg, #e33310, #c82308);
}

.deity-actions .secondary {
  background: linear-gradient(180deg, #245ba3, #17488c);
}

.deity-actions button:hover,
.deity-actions button:focus-visible {
  filter: brightness(1.09);
  box-shadow: inset 0 0 0 1px #f6d09a, 0 8px 14px rgba(52, 28, 15, .25);
  transform: translateY(-2px);
}

.deity-actions button:focus-visible {
  outline: 2px solid #c7955f;
  outline-offset: 2px;
}

.deity-actions.is-large {
  grid-template-columns: repeat(2, 245px);
  gap: 24px;
}

.deity-actions.is-large button {
  height: 56px;
  padding-bottom: 4px;
  font-size: 24px;
  line-height: 52px;
}

@media (max-width: 680px) {
  .deity-actions.is-large {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .deity-actions.is-large button {
    width: 100%;
    height: 46px;
    font-size: 18px;
    line-height: 42px;
  }
}

:global(html[data-locale-layout='international'] .deity-actions button) {
  font-family: var(--font-ui-international);
  font-size: 13px;
}

:global(html[data-locale-layout='international'] .deity-actions.is-large button) {
  font-size: 16px;
}
</style>
