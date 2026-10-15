<template>
  <!-- 本命星次：选完农历生辰后揭晓，结果统一由 BlessingTestResultDialog 呈现。 -->
  <BlessingTestLayout kind="zodiac">
    <section class="zodiac-panel test-panel offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.zodiac.revealTitle')" />
      <!-- 生辰由三个滚轮选择；提交时按是否选完整决定展示星次还是通用提示。 -->
      <form class="birthday-form" @submit.prevent="reveal">
        <p>{{ t('blessings.details.zodiac.instructions') }}</p>
        <div class="birthday-grid">
          <BirthDateWheel id="birth-year" v-model="year" :label="t('blessings.details.zodiac.year')" :options="yearOptions" />
          <BirthDateWheel id="birth-month" v-model="month" :label="t('blessings.details.zodiac.month')" :options="monthOptions" />
          <BirthDateWheel id="birth-day" v-model="day" :label="t('blessings.details.zodiac.day')" :options="dayOptions" />
        </div>
        <!-- 三项选全后实时回显生辰与生肖，aria-live 让读屏用户听到变化。 -->
        <p v-if="hasBirthday" class="birthday-summary" aria-live="polite">{{ t('blessings.details.zodiac.summary', {
          year: yearOptions.find(option => option.value === Number(year))?.label,
          month: monthOptions.find(option => option.value === month)?.label,
          day: dayOptions.find(option => option.value === Number(day))?.label,
          animal: tm('blessings.details.animals')[((Number(year) - 4) % 12 + 12) % 12],
        }) }}</p>
        <p v-else class="birthday-summary">{{ t('blessings.details.results.chooseBirthday') }}</p>
        <CeremonialButton type="submit" :label="t('blessings.details.zodiac.reveal')" />
        <!-- 推算请求进行中与所选年份查不到农历月份数据时的状态提示。 -->
        <p v-if="loading" class="test-status" role="status">{{ t('blessings.details.results.loading') }}</p>
        <p v-if="year && !months.length" class="test-status" role="status">{{ t('blessings.details.zodiac.calendarUnavailable') }}</p>
        <p class="birthday-note">{{ t('blessings.details.zodiac.note') }}</p>
      </form>
    </section>
    <!-- resultKind 决定弹窗类型：'zodiac' 展示星次，'notice' 提示先补全生日；result 为接口推算结果。 -->
    <BlessingTestResultDialog v-if="resultKind" :kind="resultKind" :result="constellation" @close="resultKind = ''" />
  </BlessingTestLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BlessingTestLayout from '@/components/blessings/BlessingTestLayout.vue'
import BlessingTestResultDialog from '@/components/blessings/BlessingTestResultDialog.vue'
import BirthDateWheel from '@/components/blessings/BirthDateWheel.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'
import heading from '@/assets/blessing-tests/heading.svg'
import { getConstellation } from '@/api/pray'
import { getLunarMonths } from '@/utils/lunar-birthday'

const { t, tm } = useI18n()
const { isLoggedIn } = useUserSession()
const { openAuthModal } = useAuthModal()
// 农历生辰：年、月、日三个滚轮各自的值。
const year = ref('')
const month = ref('')
const day = ref('')
// 空字符串表示不弹窗；'zodiac' 展示星次，'notice' 提示先补全生日。
const resultKind = ref('')
// 年份可选范围：1900 年至当前年份。
const yearOptions = computed(() => [{ value: '', label: t('blessings.details.results.chooseYear') }, ...Array.from({ length: new Date().getFullYear() - 1899 }, (_, index) => ({
  value: 1900 + index, label: t('blessings.details.zodiac.yearValue', { value: 1900 + index }),
}))])
// 农历月份依赖年份（可能含闰月）；取不到数据时返回空数组，由界面给出提示。
const months = computed(() => {
  if (!year.value) return []
  try { return getLunarMonths(Number(year.value)) } catch { return [] }
})
// 闰月使用单独的文案（闰 X 月）。
const monthOptions = computed(() => [{ value: '', label: t('blessings.details.results.chooseMonth') }, ...months.value.map(item => ({
  value: item.value,
  label: t(`blessings.details.zodiac.${item.leap ? 'leapMonthValue' : 'monthValue'}`, { value: item.number }),
}))])
// 可选天数随所选月份变化（含闰月天数）。
const dayOptions = computed(() => [{ value: '', label: t('blessings.details.results.chooseDay') }, ...Array.from({ length: months.value.find(item => item.value === month.value)?.days || 0 }, (_, index) => ({
  value: index + 1, label: t('blessings.details.zodiac.dayValue', { value: index + 1 }),
}))])
// 三项都选且日期落在该月天数范围内，才算一个完整的生辰。
const hasBirthday = computed(() => !!year.value && !!month.value && !!day.value
  && months.value.some(item => item.value === month.value && Number(day.value) >= 1 && Number(day.value) <= item.days))
// 生日不完整时只给出提示弹窗；选全后调用后端按公历生日推算星次并展示结果。
const constellation = ref(null)
const loading = ref(false)

async function reveal() {
  // 未登录先引导登录，登录后再点揭晓即可继续。
  if (!isLoggedIn.value) {
    openAuthModal('login')
    return
  }
  if (!hasBirthday.value) {
    resultKind.value = 'notice'
    return
  }
  if (loading.value) return

  loading.value = true
  try {
    constellation.value = await getConstellation({
      year: Number(year.value),
      month: Number(month.value),
      day: Number(day.value),
    }, { silent: true })
  } catch {
    // 推算失败时结果弹窗回退为本地静态演示数据。
    constellation.value = null
  } finally {
    loading.value = false
  }

  resultKind.value = 'zodiac'
}
// 换年后若原月份不存在（例如闰月消失），清空月份避免选中无效值。
watch(months, values => {
  if (!values.some(item => item.value === month.value)) month.value = ''
}, { flush: 'sync' })
// 换月后修正越界的日期（如从 30 天的月份切到 29 天）。
watch(dayOptions, values => {
  if (!month.value) day.value = ''
  else if (Number(day.value) > values.length - 1) day.value = values.length - 1
}, { flush: 'sync' })
// 生辰一有改动就收起已打开的结果弹窗。
watch([year, month, day], () => { resultKind.value = '' })
</script>
