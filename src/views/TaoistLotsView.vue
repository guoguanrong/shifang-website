<template>
  <BlessingTestLayout kind="lots">
    <section class="test-selection">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.lots.categoriesTitle')" />
      <div class="lot-category-grid">
        <button v-for="(category, index) in categories" :key="index" class="lot-category test-art-card" type="button"
          :aria-pressed="selected === index" @click="selectCategory(index)">
          <div class="lot-category-icon"><img :src="icons[index]" :width="[111, 119, 127, 125][index]" height="100" alt="" /></div>
          <h3>{{ category.title }}</h3><p>{{ category.text }}</p>
        </button>
      </div>
    </section>
    <section class="lot-draw">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.lots.drawTitle')" />
      <p>{{ alreadyDrawn ? t('blessings.details.lots.alreadyDrawn') : t('blessings.details.lots.limit') }}</p>
      <div class="lot-tabs" :aria-label="t('blessings.details.lots.categoriesTitle')">
        <button v-for="(category, index) in categories" :key="index" type="button"
          :aria-pressed="selected === index" @click="selectCategory(index)">{{ category.short }}</button>
      </div>
      <p class="lot-instruction">{{ t('blessings.details.lots.instruction') }}</p>
      <LotVessel :label="vesselLabel" :drawing="drawing" :selected-stick="selectedStick"
        @draw-end="finishDraw" @reveal-end="finishReveal" />
      <CeremonialButton :label="t('blessings.details.lots.draw')" :disabled="drawing || revealing || alreadyDrawn"
        :aria-busy="drawing || revealing" @click="startDraw" />
    </section>
    <section class="lot-guide test-panel offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.lots.guideTitle')" />
      <p>{{ t('blessings.details.lots.guide') }}</p>
    </section>
    <BlessingTestResultDialog v-if="requested" kind="lots" :selection="selected" :stick="selectedStick"
      :result="divinationResult" :confirm-label="t('blessings.details.results.lotsConfirm')"
      return-focus=".lot-draw .ceremonial-button" @close="requested = false" />
  </BlessingTestLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BlessingTestLayout from '@/components/blessings/BlessingTestLayout.vue'
import BlessingTestResultDialog from '@/components/blessings/BlessingTestResultDialog.vue'
import LotVessel from '@/components/blessings/LotVessel.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { getDivination, getDrawLots } from '@/api/pray'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'
import heading from '@/assets/blessing-tests/heading.svg'
import career from '@/assets/blessing-tests/career.png'
import wealth from '@/assets/blessing-tests/wealth.png'
import health from '@/assets/blessing-tests/health.png'
import love from '@/assets/blessing-tests/love.png'

const { t, tm } = useI18n()
const { isLoggedIn } = useUserSession()
const { openAuthModal } = useAuthModal()
const categories = computed(() => tm('blessings.details.lots.categories'))
const icons = [career, wealth, health, love]
const selected = ref(0)
const requested = ref(false)
const drawing = ref(false)
const revealing = ref(false)
const selectedStick = ref(null)
// 后端求签结果（DivinationResult）；失败时为 null，结果弹窗回退本地静态签文。
const divinationResult = ref(null)
// 今日是否已抽过签（后端每日一签限制）；查询失败按未抽处理，不阻塞抽签体验。
const alreadyDrawn = ref(false)

async function refreshDrawState() {
  try {
    alreadyDrawn.value = Number(await getDrawLots({ silent: true })) === 1
  } catch {
    alreadyDrawn.value = false
  }
}

onMounted(refreshDrawState)
// 登录成功后重新查询每日一签状态（未登录时查询会失败，按未抽处理）。
watch(isLoggedIn, value => { if (value) refreshDrawState() })

// 抽取：立即播放摇签动画，签文请求与动画并行；揭签动画结束后等签文就绪再开结果。
let divinationPromise = null
function startDraw() {
  // 未登录先引导登录，登录后再抽取即可继续。
  if (!isLoggedIn.value) {
    openAuthModal('login', () => startDraw())
    return
  }
  if (drawing.value || revealing.value || alreadyDrawn.value) return
  requested.value = false
  selectedStick.value = ['a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 6)]
  // 求签类型与签筒类别一一对应：1.事业 2.财运 3.健康 4.姻缘。
  // 非静默：后端每日一签限制（code 1006 "今日已抽签"）会立即以全局浮层提示。
  divinationPromise = getDivination({ type: selected.value + 1 })
    .then(result => { divinationResult.value = result })
    .catch(error => {
      if (Number(error?.code) === 1006 && String(error?.message || '').includes('已抽签')) {
        alreadyDrawn.value = true
      }
      divinationResult.value = null
    })
  drawing.value = true
}
function finishDraw() {
  if (!drawing.value) return
  drawing.value = false
  revealing.value = true
}
async function finishReveal() {
  if (!revealing.value) return
  revealing.value = false
  try { await divinationPromise } catch { divinationResult.value = null }
  // 仅在后端成功返回签文时展示结果并锁定当日状态；
  // 已抽签/请求失败不开结果弹窗，避免以静态演示签文冒充真实结果。
  if (divinationResult.value) {
    alreadyDrawn.value = true
    requested.value = true
  }
}
function selectCategory(index) {
  drawing.value = false
  revealing.value = false
  selectedStick.value = null
  selected.value = index
  requested.value = false
  divinationResult.value = null
}

// 签筒标签：摇签/揭晓动画期间显示所求类别，结果揭晓后显示本次签等级（如"上上签"）。
const vesselLabel = computed(() => {
  const levelKey = ({ 1: 'highest', 2: 'great', 3: 'good', 4: 'balanced', 5: 'lower', 6: 'lowest' })[Number(divinationResult.value?.level)]
  if (!drawing.value && !revealing.value && levelKey) return t('blessings.details.results.lots.grades.' + levelKey)
  return categories.value[selected.value]?.short || ''
})
</script>
