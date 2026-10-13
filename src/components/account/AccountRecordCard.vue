<template>
  <!-- 单条记录卡片：kind 决定配色后缀，也决定副标题取什么——捐赠显示类型，其余显示祈愿。 -->
  <article class="record-card" :class="`record-card-${kind}`">
    <!-- 订单编号。 -->
    <p class="record-number">{{ record.id }}</p>
    <div class="record-surface">
      <header class="record-card-heading">
        <!-- 头像属装饰性图片：alt 留空，避免与紧邻的标题重复播报。 -->
        <img class="record-avatar" :src="record.avatar" alt="" width="66" height="66" loading="lazy" />
        <div class="record-card-title">
          <h3>{{ record.titleText || t(`accountPages.examples.${record.title}`) }}</h3>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <!-- 金额只在有值时显示；状态值同时用作 class，便于按状态着色。 -->
        <div class="record-card-state">
          <div><strong v-if="record.amount">{{ money(record.amount) }}</strong><span class="record-status" :class="record.status">{{ t(`accountPages.records.${record.status}`) }}</span></div>
          <time v-if="formattedDate" :datetime="record.date">{{ formattedDate }}</time>
        </div>
      </header>
      <!-- 捐赠没有供奉图片，这一整块只在供灯与供奉两类下渲染。 -->
      <template v-if="kind !== 'donations'">
        <!-- 有图或视频时整块是按钮，点击把整条记录抛给父级打开预览弹窗。 -->
        <button v-if="record.photo || record.video" class="record-media" type="button" :aria-label="t('accountPages.records.preview', { title: record.titleText || t(`accountPages.examples.${record.title}`) })" @click="emit('preview', record)">
          <video v-if="record.video && !record.photo" :src="record.video" muted playsinline preload="metadata" />
          <img v-else :src="record.photo" :alt="record.titleText || t(`accountPages.examples.${record.title}`)" loading="lazy" />
          <!-- 供灯记录实际是视频，加个播放角标；纯符号故对读屏隐藏。 -->
          <span v-if="record.video" class="record-play" aria-hidden="true">▶</span>
          <span class="record-media-label">{{ record.mediaLabel || t('accountPages.records.sampleImage') }}</span>
        </button>
        <div v-else class="record-media-pending">
          <svg viewBox="0 0 40 36" fill="none" aria-hidden="true"><rect x="2" y="2" width="36" height="32" rx="3" /><path d="m4 29 10-11 9 8 6-6 8 9" /><circle cx="27" cy="11" r="4" /></svg>
          <div><p>{{ t(`accountPages.records.${kind === 'lamps' ? 'videoPending' : 'photoPending'}`) }}</p><small>{{ t(`accountPages.records.${kind === 'lamps' ? 'videoPendingDescription' : 'photoPendingDescription'}`) }}</small></div>
        </div>
      </template>
      <!-- 明细区：供奉方案、功德主、生辰、邮箱、祈愿都是可选字段，有数据才渲染。 -->
      <dl class="record-details">
        <div v-if="record.plan || record.planText"><dt>{{ t('accountPages.records.plan') }}</dt><dd>{{ record.planText || t(`accountPages.records.${record.plan}`) }}</dd></div>
        <div v-if="devotee"><dt>{{ t('accountPages.records.devotee') }}</dt><dd>{{ devotee }}</dd></div>
        <div v-if="record.birth"><dt>{{ t('accountPages.records.birth') }}</dt><dd>{{ record.birth }}</dd></div>
        <div v-if="record.email"><dt>{{ t('accountPages.records.email') }}</dt><dd>{{ record.email }}</dd></div>
        <div v-if="wish" class="record-wish"><dt>{{ t('accountPages.records.wish') }}</dt><dd>{{ wish }}</dd></div>
      </dl>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// record 为一条记录数据；kind 为 lamps / donations / deities，决定配色与文案分支。
const props = defineProps({ record: { type: Object, required: true }, kind: { type: String, required: true } })
// 点击图片时把整条记录抛出去，由父级决定如何预览。
const emit = defineEmits(['preview'])
const { t, locale } = useI18n()
const subtitle = computed(() => props.record.subtitleText || (props.record.wish || props.record.type ? t(props.kind === 'donations' ? `accountPages.records.${props.record.type}` : `accountPages.examples.${props.record.wish}`) : ''))
const devotee = computed(() => props.record.devoteeText || (props.record.devotee ? t(`accountPages.examples.${props.record.devotee}`) : ''))
const wish = computed(() => props.record.wishText || (props.record.wish ? t(`accountPages.examples.${props.record.wish}`) : ''))
// 日期按当前语言格式化，hour12: false 统一使用 24 小时制。
const formattedDate = computed(() => {
  const date = new Date(props.record.date)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
})
// 金额按当前语言格式化；币种固定 USD，整数不带小数。
const money = amount => {
  const value = Number(amount)
  const digits = Number.isInteger(value) ? 0 : 2
  return new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: 2 }).format(value)
}
</script>
