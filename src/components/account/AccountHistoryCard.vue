<template>
  <!-- 历史记录卡片：复用 record-card 样式；kind 为 orders 时展示订单费用，否则展示活动预约信息。 -->
  <article class="record-card history-card" :class="`history-card-${kind}`">
    <header class="record-card-heading">
      <!-- 头像为装饰图片，alt 留空；标题由 record.title 直接给出完整文案。 -->
      <img class="record-avatar" :src="record.avatar" alt="" width="66" height="66" loading="lazy" />
      <div class="record-card-title"><h3>{{ t(record.title) }}</h3><p class="history-reference">{{ record.id }}</p></div>
      <div class="record-card-state">
        <span class="record-status">{{ t(`accountPages.history.${record.status}`) }}</span>
        <time v-if="kind === 'orders'" :datetime="record.date">{{ formattedDate }}</time>
      </div>
    </header>
    <!-- 订单：点灯本身免费，只收取材料费，两项分开列出。 -->
    <dl v-if="kind === 'orders'" class="history-order-costs">
      <div><dt>{{ t('accountPages.history.lighting') }}</dt><dd class="history-free">{{ t('accountPages.history.free') }}</dd></div>
      <div><dt>{{ t('accountPages.history.materials') }}</dt><dd>{{ formattedAmount }}</dd></div>
    </dl>
    <!-- 活动：私人预约显示「预约时间」，公开法会显示「活动时间」；随后列出地点、功德主、电话与祈愿。 -->
    <template v-else>
      <dl class="history-event-facts">
        <div><dt>{{ t(`accountPages.history.${record.type === 'private' ? 'appointmentTime' : 'eventTime'}`) }}</dt><dd><time :datetime="record.date">{{ formattedDate }}</time></dd></div>
        <div><dt>{{ t('accountPages.history.location') }}</dt><dd>{{ t(`accountPages.history.${record.location}`) }}</dd></div>
      </dl>
      <dl class="record-details">
        <div><dt>{{ t('accountPages.records.devotee') }}</dt><dd>{{ t('accountPages.examples.sampleDevotee') }}</dd></div>
        <div><dt>{{ t('accountPages.history.phone') }}</dt><dd>{{ record.phone }}</dd></div>
        <div class="record-wish"><dt>{{ t('accountPages.records.wish') }}</dt><dd>{{ t(`accountPages.history.events.${record.type}.wish`) }}</dd></div>
      </dl>
    </template>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// record 为一条历史记录；kind 为 orders（订单）或 events（活动预约），决定展示哪一组字段。
const props = defineProps({ record: { type: Object, required: true }, kind: { type: String, required: true } })
const { t, locale } = useI18n()
// 日期按当前语言格式化，统一 24 小时制。
const formattedDate = computed(() => new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(props.record.date)))
// 金额按当前语言格式化，币种固定 USD、不带小数；缺失时按 0 处理，避免出现 NaN。
const formattedAmount = computed(() => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(props.record.amount || 0))
</script>
