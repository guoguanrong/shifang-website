<template>
  <!-- 历史记录卡片：复用 record-card 样式；kind 为 orders 时展示订单费用，否则展示活动预约信息。 -->
  <article class="record-card history-card" :class="`history-card-${kind}`">
    <header class="record-card-heading">
      <!-- 头像为装饰图片，alt 留空；标题由 record.title 直接给出完整文案。 -->
      <img class="record-avatar" :src="shownAvatar" alt="" width="66" height="66" loading="lazy" @error="avatarFailed = true" />
      <div class="record-card-title"><h3>{{ record.titleText || t(record.title) }}</h3><p class="history-reference">{{ record.id }}</p></div>
      <div class="record-card-state">
        <span class="record-status">{{ t(`accountPages.history.${record.status}`) }}</span>
        <time v-if="kind === 'orders' && formattedDate" :datetime="record.date">{{ formattedDate }}</time>
      </div>
    </header>
    <!-- 订单：点灯本身免费，只收取材料费，两项分开列出。 -->
    <dl v-if="kind === 'orders'" class="history-order-costs">
      <template v-if="record.costs">
        <div v-for="cost in record.costs" :key="cost.label"><dt>{{ cost.label }}</dt><dd :class="{ 'history-free': cost.free }">{{ cost.value }}</dd></div>
      </template>
      <template v-else>
        <div><dt>{{ t('accountPages.history.lighting') }}</dt><dd class="history-free">{{ t('accountPages.history.free') }}</dd></div>
        <div><dt>{{ t('accountPages.history.materials') }}</dt><dd>{{ formattedAmount }}</dd></div>
      </template>
    </dl>
    <!-- 活动：私人预约显示「预约时间」，公开法会显示「活动时间」；随后列出地点、功德主、电话与祈愿。 -->
    <template v-else>
      <dl class="history-event-facts">
        <div><dt>{{ t(`accountPages.history.${record.type === 'private' ? 'appointmentTime' : 'eventTime'}`) }}</dt><dd>{{ record.timeText || formattedDate || '—' }}</dd></div>
        <div><dt>{{ t('accountPages.history.location') }}</dt><dd>{{ record.locationText || (record.location ? t(`accountPages.history.${record.location}`) : '—') }}</dd></div>
      </dl>
      <dl class="record-details">
        <div v-if="devotee"><dt>{{ t('accountPages.records.devotee') }}</dt><dd>{{ devotee }}</dd></div>
        <div v-if="record.phone"><dt>{{ t('accountPages.history.phone') }}</dt><dd>{{ record.phone }}</dd></div>
        <div v-if="wish" class="record-wish"><dt>{{ t('accountPages.records.wish') }}</dt><dd>{{ wish }}</dd></div>
      </dl>
    </template>
  </article>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import orderAvatar from '@/assets/account-pages/order-avatar.webp'

// record 为一条历史记录；kind 为 orders（订单）或 events（活动预约），决定展示哪一组字段。
const props = defineProps({ record: { type: Object, required: true }, kind: { type: String, required: true } })
const { t, locale } = useI18n()
const avatarFailed = ref(false)
watch(() => props.record.avatar, () => { avatarFailed.value = false })
const shownAvatar = computed(() => (!props.record.avatar || avatarFailed.value) ? orderAvatar : props.record.avatar)
const devotee = computed(() => props.record.devoteeText || (props.kind === 'events' && !props.record.titleText ? t('accountPages.examples.sampleDevotee') : ''))
const wish = computed(() => props.record.wishText || (props.record.type && !props.record.titleText ? t(`accountPages.history.events.${props.record.type}.wish`) : ''))
// 日期按当前语言格式化，统一 24 小时制。
const formattedDate = computed(() => {
  const date = new Date(props.record.date)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
})
// 金额按当前语言格式化，币种固定 USD、不带小数；缺失时按 0 处理，避免出现 NaN。
const formattedAmount = computed(() => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(props.record.amount || 0))
</script>
