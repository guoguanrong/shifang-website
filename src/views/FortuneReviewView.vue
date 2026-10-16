<template>
  <!-- 运势评测：先选生肖，选中即弹出结果；下方另附化太岁的护佑方式说明。 -->
  <BlessingTestLayout kind="fortune">
    <section class="test-selection">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.fortune.selectionTitle')" />
      <!-- 十二生肖选择，点击后直接打开结果弹窗。 -->
      <div class="animal-grid">
        <button v-for="(animal, index) in animals" :key="animal.name" type="button" class="animal-card test-art-card"
          :aria-pressed="selected === index" @click="previewResult(index)">
          <div class="animal-icon"><img :src="animal.src" :width="animal.width" :height="animal.height" alt="" /></div>
          <h3>{{ tm('blessings.details.animals')[index] }}</h3>
        </button>
      </div>
    </section>
    <!-- 护佑方式卡片，仅作展示，不参与测算。 -->
    <section class="protection-panel test-panel offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.fortune.protectionTitle')" />
      <div class="protection-grid">
        <article v-for="(item, index) in tm('blessings.details.fortune.protection')" :key="index" class="protection-card test-art-card">
          <div class="protection-icon"><img :src="protectionIcons[index]" :width="[100, 119, 125][index]" :height="index === 0 ? 104 : 100" alt="" /></div>
          <h3>{{ item.title }}</h3><p>{{ item.text }}</p>
        </article>
      </div>
    </section>
    <!-- 结果弹窗按所选生肖展示接口推算的流年运势。 -->
    <BlessingTestResultDialog v-if="showResult" kind="fortune" :selection="selected" :result="fortuneResult" @close="showResult = false" />
  </BlessingTestLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BlessingTestLayout from '@/components/blessings/BlessingTestLayout.vue'
import BlessingTestResultDialog from '@/components/blessings/BlessingTestResultDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import { getFortune } from '@/api/pray'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'
import heading from '@/assets/blessing-tests/heading.svg'
import talisman from '@/assets/blessing-tests/protection-talisman.png'
import kindness from '@/assets/blessing-tests/protection-kindness.png'
import season from '@/assets/blessing-tests/protection-season.png'

const { t, tm } = useI18n()
const { isLoggedIn } = useUserSession()
const { openAuthModal } = useAuthModal()
// 选中的生肖下标；null 表示尚未选择。
const selected = ref(null)
const showResult = ref(false)
// 接口推算的流年运势（FortuneResult）；失败时为 null，弹窗回退静态示例。
const fortuneResult = ref(null)
const fetching = ref(false)
// 生肖名固定用中文传给后端（接口按中文生肖匹配），与界面语言无关。
const ZODIAC_NAMES = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 记录生肖、调用后端推算流年运势，完成后打开结果弹窗。
async function previewResult(index) {
  // 未登录先引导登录，登录后再点生肖即可继续。
  if (!isLoggedIn.value) {
    openAuthModal('login', () => previewResult(index))
    return
  }
  selected.value = index
  if (fetching.value) return

  fetching.value = true
  try {
    // 不静默：失败时全局浮层直接显示后端 msg / 网络错误，便于定位为何无数据。
    fortuneResult.value = await getFortune({ zodiac: ZODIAC_NAMES[index] })
  } catch {
    fortuneResult.value = null
  } finally {
    fetching.value = false
  }

  showResult.value = true
}
// 三张护佑方式图标。
const protectionIcons = [talisman, kindness, season]
// 批量引入十二生肖图片，避免逐个 import。
const sources = import.meta.glob('/src/assets/blessing-tests/{rat,ox,tiger,rabbit,dragon,snake,horse,goat,monkey,rooster,dog,pig}.png', { eager: true, query: '?url', import: 'default' })
// [生肖, 宽, 高]，顺序与 i18n 里的 animals 一致，尺寸取自设计稿。
const animals = [
  ['rat', 90, 64], ['ox', 78, 70], ['tiger', 111, 52], ['rabbit', 65, 80],
  ['dragon', 85, 80], ['snake', 90, 41], ['horse', 78, 80], ['goat', 66, 80],
  ['monkey', 86, 64], ['rooster', 63, 80], ['dog', 72, 80], ['pig', 90, 54],
].map(([name, width, height]) => ({ name, width, height, src: sources[`/src/assets/blessing-tests/${name}.png`] }))
</script>
