<template>
  <!-- 生辰滚轮：三行窗口的自绘列表，选中项恒居中间行并高亮，点击行即切换取值。 -->
  <div class="birth-wheel test-art-card">
    <span class="birth-wheel-label">{{ label }}</span>
    <ul :id="id" class="birth-wheel-list" role="listbox" :aria-label="label" @wheel="handleWheel">
      <li v-for="(row, index) in windowRows" :key="index" class="birth-wheel-row">
        <button v-if="row.option" type="button" role="option" :aria-selected="row.active ? 'true' : 'false'"
          :class="{ 'is-active': row.active }" @click="$emit('update:modelValue', row.option.value)">
          {{ row.option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// options 形如 [{ value, label }]；配合 update:modelValue 即可支持 v-model。
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue'])

// 以选中项为中心的三行窗口；值未命中（如「请选择」占位）时以第一项为中心。
// 越界行补空占位，保证三行高度稳定、选中项始终位于中间。
const windowRows = computed(() => {
  const list = props.options
  const selected = list.findIndex(item => String(item.value) === String(props.modelValue))
  const center = selected < 0 ? 0 : selected
  return [center - 1, center, center + 1].map((index) => ({
    option: list[index] || null,
    active: index === center,
  }))
})

// 鼠标滚轮切换选项：向上滚 = 上一项，向下滚 = 下一项；
// 短间隔节流，避免一次滚动触发多次 wheel 跳过多项。
let wheelCooldown = 0

function handleWheel(event) {
  event.preventDefault()
  const now = Date.now()
  if (now - wheelCooldown < 120) return

  const list = props.options
  const selected = list.findIndex(item => String(item.value) === String(props.modelValue))
  const center = selected < 0 ? 0 : selected
  const next = center + (event.deltaY > 0 ? 1 : -1)
  if (next < 0 || next >= list.length) return

  wheelCooldown = now
  emit('update:modelValue', list[next].value)
}
</script>
