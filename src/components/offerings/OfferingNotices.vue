<template>
  <!-- 供奉须知列表：未传 items 时回退到语言包里的默认须知。 -->
  <section class="offering-notices offering-paper">
    <OrnateSectionHeading :art="art" :title="title || t('offerings.noticesTitle')" />
    <ul><li v-for="(notice, index) in (items || tm('offerings.notices'))" :key="index"><span class="offering-notice-icon" aria-hidden="true"><img :src="noticeIcon" alt="" /></span><span><strong v-if="notice.title" class="notice-label">{{ notice.title }}</strong>{{ notice.text || notice }}</span></li></ul>
  </section>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import noticeIcon from '@/assets/offerings/notice-icon.svg'
// items 每项可以是字符串，也可以是 { title, text } 结构。
defineProps({ title: String, items: Array, art: String })
const { t, tm } = useI18n()
</script>
