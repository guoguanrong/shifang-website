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
      <p>{{ t('blessings.details.lots.limit') }}</p>
      <div class="lot-tabs" :aria-label="t('blessings.details.lots.categoriesTitle')">
        <button v-for="(category, index) in categories" :key="index" type="button"
          :aria-pressed="selected === index" @click="selectCategory(index)">{{ category.short }}</button>
      </div>
      <p class="lot-instruction">{{ t('blessings.details.lots.instruction') }}</p>
      <LotVessel :label="categories[selected].short" :drawing="drawing" :selected-stick="selectedStick"
        @draw-end="finishDraw" @reveal-end="finishReveal" />
      <CeremonialButton :label="t('blessings.details.lots.draw')" :disabled="drawing || revealing"
        :aria-busy="drawing || revealing" @click="startDraw" />
    </section>
    <section class="lot-guide test-panel offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.lots.guideTitle')" />
      <p>{{ t('blessings.details.lots.guide') }}</p>
    </section>
    <BlessingTestResultDialog v-if="requested" kind="lots" :selection="selected" :stick="selectedStick"
      return-focus=".lot-draw .ceremonial-button" @close="requested = false" />
  </BlessingTestLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BlessingTestLayout from '@/components/blessings/BlessingTestLayout.vue'
import BlessingTestResultDialog from '@/components/blessings/BlessingTestResultDialog.vue'
import LotVessel from '@/components/blessings/LotVessel.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import heading from '@/assets/blessing-tests/heading.svg'
import career from '@/assets/blessing-tests/career.png'
import wealth from '@/assets/blessing-tests/wealth.png'
import health from '@/assets/blessing-tests/health.png'
import love from '@/assets/blessing-tests/love.png'

const { t, tm } = useI18n()
const categories = computed(() => tm('blessings.details.lots.categories'))
const icons = [career, wealth, health, love]
const selected = ref(0)
const requested = ref(false)
const drawing = ref(false)
const revealing = ref(false)
const selectedStick = ref(null)
// The vessel shakes, then the chosen stick rises; only after that rise does the reading open.
function startDraw() {
  if (drawing.value || revealing.value) return
  requested.value = false
  selectedStick.value = ['a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 6)]
  drawing.value = true
}
function finishDraw() {
  if (!drawing.value) return
  drawing.value = false
  revealing.value = true
}
function finishReveal() {
  if (!revealing.value) return
  revealing.value = false
  requested.value = true
}
function selectCategory(index) {
  drawing.value = false
  revealing.value = false
  selectedStick.value = null
  selected.value = index
  requested.value = false
}
</script>
