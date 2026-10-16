<template>
  <BlessingTestLayout kind="five">
    <section class="test-selection">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.five.elementsTitle')" />
      <div class="element-grid">
        <article v-for="(element, index) in tm('blessings.details.five.elements')" :key="index" class="element-card test-art-card">
          <div class="element-icon"><img :src="icons[index]" :width="58" :height="index === 4 ? 51 : 58" alt="" /></div>
          <h3>{{ element.title }}</h3><p>{{ element.text }}</p>
        </article>
      </div>
    </section>
    <section class="personality-quiz test-panel offering-paper">
      <OrnateSectionHeading :art="heading" :title="t('blessings.details.five.quizTitle')" />
      <div v-if="stage === 'intro'" class="quiz-body">
        <p>{{ t('blessings.details.five.instructions') }}</p>
        <CeremonialButton :label="t('blessings.details.five.start')" @click="startTest" />
      </div>
      <div v-else-if="stage === 'question'" class="quiz-body">
        <p>{{ t('blessings.details.five.progress', { current: 1, total: 5 }) }}</p>
        <h3>{{ t('blessings.details.five.question') }}</h3>
        <div class="quiz-options">
          <button v-for="(option, index) in tm('blessings.details.five.options')" :key="index" type="button"
            class="test-choice" @click="previewResult(index)">{{ option }}</button>
        </div>
      </div>
      <div v-else class="quiz-body" role="status">
        <p>{{ t('blessings.details.five.pending') }}</p>
        <CeremonialButton :label="t('blessings.details.five.restart')" @click="stage = 'intro'" />
      </div>
    </section>
    <BlessingTestResultDialog v-if="showResult" kind="five" :selection="selectedElement"
      return-focus=".personality-quiz .ceremonial-button" @close="showResult = false" />
  </BlessingTestLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BlessingTestLayout from '@/components/blessings/BlessingTestLayout.vue'
import BlessingTestResultDialog from '@/components/blessings/BlessingTestResultDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import { useUserSession } from '@/composables/useUserSession'
import { useAuthModal } from '@/composables/useAuthModal'
import heading from '@/assets/blessing-tests/heading.svg'
import metal from '@/assets/blessing-tests/metal.svg'
import wood from '@/assets/blessing-tests/wood.svg'
import water from '@/assets/blessing-tests/water.svg'
import fire from '@/assets/blessing-tests/fire.svg'
import earth from '@/assets/blessing-tests/earth.svg'

const { t, tm } = useI18n()
const { isLoggedIn } = useUserSession()
const { openAuthModal } = useAuthModal()
const icons = [metal, wood, water, fire, earth]
// Figma supplies the first question only; do not invent the remaining question bank or a score.
const stage = ref('intro')
const showResult = ref(false)
const selectedElement = ref(0)
function startTest() {
  if (!isLoggedIn.value) {
    openAuthModal('login', () => { stage.value = 'question' })
    return
  }
  stage.value = 'question'
}
function previewResult(index) {
  selectedElement.value = index
  stage.value = 'pending'
  showResult.value = true
}
</script>
