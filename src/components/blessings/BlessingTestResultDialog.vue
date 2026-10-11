<template>
  <Teleport to="body">
    <dialog ref="dialog" class="blessing-service-dialog blessing-result-dialog" :class="`result-${kind}`"
      :aria-labelledby="titleId" :aria-describedby="descriptionId" @close="emit('close')" @click="onBackdrop">
      <div class="service-dialog-content result-dialog-content">
        <button class="service-dialog-close" type="button" :aria-label="t('offerings.close')" @click="dialog.close()">
          <img :src="closeIcon" width="20" height="20" alt="" />
        </button>
        <header class="service-dialog-heading">
          <img :src="emblem" width="138.436" height="138.436" alt="" aria-hidden="true" />
          <h2 :id="titleId">{{ title }}</h2>
          <span v-if="kind === 'zodiac'" class="result-star-eyebrow">{{ t(`${prefix}.zodiac.eyebrow`) }}</span>
        </header>

        <template v-if="kind === 'zodiac'">
          <div :id="descriptionId" class="star-result">
            <p class="star-birthday">{{ t(`${prefix}.zodiac.birthday`) }}</p>
            <div class="star-name"><span>{{ t(`${prefix}.zodiac.roman`) }}</span><h3>{{ t(`${prefix}.zodiac.name`) }}</h3></div>
            <p class="star-guardian">{{ t(`${prefix}.zodiac.guardianLabel`) }} <strong>{{ t(`${prefix}.zodiac.mansion`) }}</strong> <span>{{ t(`${prefix}.zodiac.guardian`) }}</span></p>
            <dl class="star-facts">
              <div><dt>{{ t(`${prefix}.zodiac.signLabel`) }}</dt><dd>{{ t(`${prefix}.zodiac.sign`) }}</dd></div>
              <div><dt>{{ t(`${prefix}.zodiac.animalLabel`) }}</dt><dd>{{ t(`${prefix}.zodiac.animal`) }}</dd></div>
              <div><dt>{{ t(`${prefix}.zodiac.birthYear`) }}</dt><dd>{{ t(`${prefix}.zodiac.born`) }}</dd></div>
            </dl>
            <h4>{{ t(`${prefix}.zodiac.traits`) }}</h4>
            <p class="star-detail">{{ t(`${prefix}.zodiac.character`) }}</p>
            <h4>{{ t(`${prefix}.zodiac.annualTitle`) }}</h4>
            <p class="star-detail">{{ t(`${prefix}.zodiac.annualReading`) }}</p>
          </div>
        </template>
        <div v-else :id="descriptionId" class="service-dialog-copy">
          <template v-if="kind === 'five'">
            <p>{{ t(`${prefix}.five.element`, { element: element.title }) }}</p>
            <p>{{ element.text.replace('\n', ' · ') }}<template v-if="selection === 2"> {{ t(`${prefix}.five.waterAdvice`) }}</template></p>
          </template>
          <p v-else-if="kind === 'lots'">{{ t(`${prefix}.lots.readings.${lotKey}`) }}</p>
          <p v-else-if="kind === 'fortune'">{{ t(`${prefix}.fortune.${selection === 1 ? 'oxReading' : 'unavailable'}`) }}</p>
          <p v-else>{{ t(`${prefix}.notice.message`) }}</p>
        </div>
        <p v-if="['five', 'lots', 'fortune'].includes(kind)" class="service-dialog-blessing">{{ t(`${prefix}.${kind}.blessing`) }}</p>
        <div class="service-dialog-actions">
          <CeremonialButton :label="t(`${prefix}.${kind === 'notice' ? 'understood' : 'confirm'}`)" @click="dialog.close()" />
        </div>
        <p v-if="kind !== 'notice'" class="service-dialog-preview">{{ t(`${prefix}.${kind === 'zodiac' ? 'zodiacPreview' : 'preview'}`) }}</p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import closeIcon from '@/assets/blessing-tests/result-close.svg'
import emblem from '@/assets/blessing-tests/result-emblem.svg'
import '@/styles/blessing-service-dialog.css'
import '@/styles/blessing-test-results.css'

const props = defineProps({
  kind: { type: String, required: true, validator: value => ['five', 'lots', 'fortune', 'zodiac', 'notice'].includes(value) },
  selection: { type: Number, default: 0 },
  stick: { type: String, default: 'f' },
  returnFocus: { type: String, default: '' },
})
const emit = defineEmits(['close'])
const { t, tm } = useI18n()
const prefix = 'blessings.details.results'
const titleId = useId()
const descriptionId = useId()
const dialog = ref(null)
const element = computed(() => tm('blessings.details.five.elements')[props.selection] || tm('blessings.details.five.elements')[0])
// These IDs correspond to the text printed on the six exported stick images.
const lotKey = computed(() => ({ a: 'great', b: 'highest', c: 'lower', d: 'lowest', e: 'good', f: 'balanced' })[props.stick] || 'balanced')
const title = computed(() => {
  if (props.kind === 'five') return t(`${prefix}.five.title`, { element: element.value.title })
  if (props.kind === 'lots') return t(`${prefix}.lots.title`, {
    category: tm('blessings.details.lots.categories')[props.selection]?.title,
    grade: t(`${prefix}.lots.grades.${lotKey.value}`),
  })
  if (props.kind === 'fortune') return t(`${prefix}.fortune.title`, { animal: tm('blessings.details.animals')[props.selection] })
  return t(`${prefix}.${props.kind}.title`)
})
let previousFocus
let previousOverflow
onMounted(() => {
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
})
onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  const target = previousFocus?.isConnected && previousFocus !== document.body
    ? previousFocus : props.returnFocus ? document.querySelector(props.returnFocus) : null
  target?.focus({ preventScroll: true })
})
function onBackdrop(event) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.value.close()
}
</script>
