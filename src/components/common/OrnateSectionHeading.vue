<template><!-- 通用装饰小标题：未传 art 时使用内置的卷草纹徽记。 --><div class="ornate-heading"><img :src="art || emblem" alt="" aria-hidden="true" /><h2>{{ title }}</h2></div></template>
<script setup>
import emblem from '@/assets/events/section-emblem.svg'
// title 必填；art 可传入自定义徽记图片，缺省使用内置图案。
defineProps({ title: { type: String, required: true }, art: String })
</script>
<style scoped>
/* 徽记绝对定位铺满，标题压在其上居中显示。 */
.ornate-heading { position:relative; display:grid; place-items:center; height:138px; text-align:center; }
.ornate-heading img { position:absolute; top:0; width:138px; height:138px; }
.ornate-heading h2 { position:relative; z-index:1; margin:0; color:#333; font:32px/1.2 var(--font-calligraphy); letter-spacing:1px; white-space:nowrap; }
@media (max-width:600px) { .ornate-heading { height:108px; } .ornate-heading img { width:108px; height:108px; } .ornate-heading h2 { max-width:90vw; font-size:25px; white-space:normal; } }
</style>
