<template>
  <!-- 生辰滚轮：用原生 select（size=3）模拟滚轮效果，选项由父级传入。 -->
  <div class="birth-wheel test-art-card">
    <label :for="id">{{ label }}</label>
    <select :id="id" :value="modelValue" size="3" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</template>

<script setup>
// options 形如 [{ value, label }]；配合 update:modelValue 即可支持 v-model。
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
})
defineEmits(['update:modelValue'])
</script>
