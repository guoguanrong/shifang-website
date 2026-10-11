<template>
  <!-- 我的记录页：kind 决定展示供灯 / 捐赠 / 供奉哪一类，三者共用本视图，
       标题、说明、跳转文案统一按 accountPages.<kind> 这一前缀从语言包取。 -->
  <AccountPageShell :title="t(`${pageKey}.title`)" :eyebrow="t(`${pageKey}.eyebrow`)" :subtitle="t(`${pageKey}.subtitle`)">
    <!-- 顶部说明卡：栏目介绍 + 回到对应业务页的入口。 -->
    <section class="account-paper record-explanation">
      <OrnateSectionHeading :title="t(`${pageKey}.explanationTitle`)" />
      <p>{{ t(`${pageKey}.explanation`) }}</p>
      <!-- i18n-t 让「继续供奉」这类句子里的链接位置由译文决定；scope="global" 表示 keypath 从根命名空间解析。 -->
      <i18n-t :keypath="`${pageKey}.continue`" tag="p" scope="global"><template #link><RouterLink :to="destination">{{ t(`${pageKey}.link`) }}</RouterLink></template></i18n-t>
    </section>

    <!-- 记录列表区：标题 id 供本区 aria-labelledby 引用。 -->
    <section class="record-list" :aria-labelledby="headingId">
      <header class="account-paper record-filter">
        <h2 :id="headingId">{{ t(`${pageKey}.details`) }}</h2>
        <div class="record-filter-row">
          <label :for="filterId">{{ t(`accountPages.records.${kind === 'donations' ? 'type' : 'status'}`) }}</label>
          <!-- 按状态/类型筛选：选项来自 filters 计算属性，切换后由 visibleRecords 过滤列表。 -->
          <select :id="filterId" v-model="filter">
            <option v-for="option in filters" :key="option" :value="option">{{ t(`accountPages.records.${option}`) }}</option>
          </select>
          <!-- role="status" 让筛选后的条数变化能被读屏播报；count 由 i18n 复数处理。 -->
          <span role="status">{{ t('accountPages.records.total', { count: visibleRecords.length }) }}</span>
          <!-- 示例记录开关：关闭后列表为空，页面显示空状态引导。 -->
          <label class="record-example-toggle"><input v-model="showExamples" type="checkbox" />{{ t('accountPages.records.showExamples') }}</label>
        </div>
        <!-- 免责声明：明确提示以下数据仅为展示样例。 -->
        <p class="record-example-notice">{{ t('accountPages.records.exampleNotice') }}</p>
      </header>
      <!-- 卡片点击图片时抛出 preview，由下方弹窗展示大图。 -->
      <AccountRecordCard v-for="record in visibleRecords" :key="record.id" :record="record" :kind="kind" @preview="preview = $event" />
      <!-- 空状态：提示可调整筛选或打开示例开关。 -->
      <div v-if="!visibleRecords.length" class="record-empty" role="status">
        <h3>{{ t('accountPages.records.empty') }}</h3><p>{{ t('accountPages.records.emptyDescription') }}</p>
        <RouterLink :to="destination">{{ t(`${pageKey}.link`) }} →</RouterLink>
      </div>
    </section>
    <!-- 图片预览弹窗；供灯目前上传的是视频，photo 为空时改用「暂不可预览」的说明文案。 -->
    <AccountFeedbackDialog v-if="preview" :title="t(`accountPages.examples.${preview.title}`)" :image="preview.photo"
      :description="t(`accountPages.records.${kind === 'lamps' ? 'videoUnavailable' : 'imagePreview'}`)" @close="preview = null" />
  </AccountPageShell>
</template>

<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import AccountRecordCard from '@/components/account/AccountRecordCard.vue'
import AccountFeedbackDialog from '@/components/account/AccountFeedbackDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import { accountRecordExamples } from '@/data/account-record-examples'

// kind 决定整页数据：lamps 供灯、donations 捐赠、deities 供奉，取值不在白名单内会在开发模式下告警。
const props = defineProps({ kind: { type: String, required: true, validator: value => ['lamps', 'donations', 'deities'].includes(value) } })
const { t } = useI18n()
// 用 useId 生成唯一 id，保证同页面出现多个本组件时 aria 关联也不会互相干扰。
const headingId = `record-heading-${useId()}`
const filterId = `record-filter-${useId()}`
// 语言包前缀，所有文案都挂在这个 key 下。
const pageKey = computed(() => `accountPages.${props.kind}`)
// 「继续供奉 / 再做一次」的跳转目标，按类型指向对应的业务页。
const destination = computed(() => ({ lamps: '/blessings/lamps', donations: '/cloud-build/fund-details', deities: '/deities' })[props.kind])
// 捐赠按类型筛选（money / goods），其余两类按状态筛选；all 表示不过滤。
const filters = computed(() => props.kind === 'donations' ? ['all', 'money', 'goods'] : ['all', 'active', 'pending', 'completed'])
const filter = ref('all')
// 是否展示 Figma 示例数据；真实记录接入前，页面内容完全依赖这个开关。
const showExamples = ref(true)
// 当前预览的记录，非 null 即打开弹窗。
const preview = ref(null)
// 数据取自本地示例文件：先按开关决定是否展示，再按筛选条件过滤（捐赠看 type，其余看 status）。
const visibleRecords = computed(() => showExamples.value ? accountRecordExamples[props.kind].filter(record => filter.value === 'all' || (props.kind === 'donations' ? record.type : record.status) === filter.value) : [])
// 切换记录类型时重置筛选并关闭预览，避免沿用上一类的筛选项（它在新类型里可能并不存在）。
watch(() => props.kind, () => { filter.value = 'all'; preview.value = null })
</script>
