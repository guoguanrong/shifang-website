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
          <h3>{{ t(`accountPages.examples.${record.title}`) }}</h3>
          <p>{{ t(kind === 'donations' ? `accountPages.records.${record.type}` : `accountPages.examples.${record.wish}`) }}</p>
        </div>
        <!-- 金额只在有值时显示；状态值同时用作 class，便于按状态着色。 -->
        <div class="record-card-state">
          <div><strong v-if="record.amount">{{ money(record.amount) }}</strong><span class="record-status" :class="record.status">{{ t(`accountPages.records.${record.status}`) }}</span></div>
          <time :datetime="record.date">{{ formattedDate }}</time>
        </div>
      </header>
      <!-- 捐赠没有供奉图片，这一整块只在供灯与供奉两类下渲染。 -->
      <template v-if="kind !== 'donations'">
        <!-- 有图时整块是按钮，点击把整条记录抛给父级打开预览弹窗。 -->
        <button v-if="record.photo" class="record-media" type="button" :aria-label="t('accountPages.records.preview', { title: t(`accountPages.examples.${record.title}`) })" @click="emit('preview', record)">
          <img :src="record.photo" :alt="t(`accountPages.examples.${record.title}`)" loading="lazy" />
          <!-- 供灯记录实际是视频，加个播放角标；纯符号故对读屏隐藏。 -->
          <span v-if="kind === 'lamps'" class="record-play" aria-hidden="true">▶</span>
          <span class="record-media-label">{{ t('accountPages.records.sampleImage') }}</span>
        </button>
        <div v-else class="record-media-pending">
          <svg viewBox="0 0 40 36" fill="none" aria-hidden="true"><rect x="2" y="2" width="36" height="32" rx="3" /><path d="m4 29 10-11 9 8 6-6 8 9" /><circle cx="27" cy="11" r="4" /></svg>
          <div><p>{{ t(`accountPages.records.${kind === 'lamps' ? 'videoPending' : 'photoPending'}`) }}</p><small>{{ t(`accountPages.records.${kind === 'lamps' ? 'videoPendingDescription' : 'photoPendingDescription'}`) }}</small></div>
        </div>
      </template>
      <!-- 明细区：供奉方案、功德主、生辰、邮箱、祈愿都是可选字段，有数据才渲染。 -->
      <dl class="record-details">
        <div v-if="record.plan"><dt>{{ t('accountPages.records.plan') }}</dt><dd>{{ t(`accountPages.records.${record.plan}`) }}</dd></div>
        <div><dt>{{ t('accountPages.records.devotee') }}</dt><dd>{{ t(`accountPages.examples.${record.devotee}`) }}</dd></div>
        <div v-if="record.birth"><dt>{{ t('accountPages.records.birth') }}</dt><dd>{{ record.birth }}</dd></div>
        <div v-if="record.email"><dt>{{ t('accountPages.records.email') }}</dt><dd>{{ record.email }}</dd></div>
        <div class="record-wish"><dt>{{ t('accountPages.records.wish') }}</dt><dd>{{ t(`accountPages.examples.${record.wish}`) }}</dd></div>
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
// 日期按当前语言格式化，hour12: false 统一使用 24 小时制。
const formattedDate = computed(() => new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(props.record.date)))
// 金额按当前语言格式化；币种固定 USD，且不显示小数。
const money = amount => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
</script>
