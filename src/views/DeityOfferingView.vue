<template>
  <!-- 神明供奉页：供奉对象由地址栏 ?deity= 决定，方案选择与下单表单都在本页完成。 -->
  <OfferingPageShell :title="t('offerings.deityTitle')" :eyebrow="t('offerings.deityEyebrow')" :subtitle="t('offerings.deitySubtitle')" :section="t('deityDetail.section')" section-to="/deities">
    <!-- 神龛示意区：神像、供桌、烛台、香炉与名牌都是展示素材。 -->
    <section class="shrine-display offering-paper">
      <div class="shrine-deity-heading"><img :src="shrineEmblem" alt="" /><p>{{ t('offerings.deityLabel') }}</p><h2>{{ deity.title }}</h2></div>
      <h3 class="shrine-example-heading"><img :src="headingLeft" alt="" /><span>{{ t('offerings.shrineTitle') }}</span><img :src="headingRight" alt="" /></h3>
      <div class="shrine-photo"><img :src="shrine" :alt="t('offerings.shrineAlt')" /></div>
      <div class="shrine-altar">
        <img class="altar-table" :src="altar" alt="" />
        <img class="altar-candle left" :src="candle" alt="" /><img class="altar-censer" :src="censer" alt="" /><img class="altar-candle right" :src="candle" alt="" />
        <p class="altar-nameplate">{{ t('offerings.nameplate') }}</p>
      </div>
      <p class="shrine-caption"><span class="offering-notice-icon" aria-hidden="true"><img :src="noticeIcon" alt="" /></span><span>{{ deity.title }} · {{ t('offerings.shrineCaption') }}</span></p>
    </section>
    <!-- 供奉方案与下单表单：选中的方案决定金额、周期与弹窗文案。 -->
    <section class="deity-offering-order offering-paper">
      <OrnateSectionHeading :title="t('offerings.plansTitle')" />
      <div class="deity-order-inner">
        <!-- 方案卡片是按钮组，aria-pressed 标记当前选中的方案。 -->
        <div class="offering-plans" role="group" :aria-label="t('offerings.plansTitle')">
          <button v-for="plan in plans" :key="plan.id" class="offering-plan" :class="plan.id" type="button" :aria-pressed="selectedPlan === plan.id" @click="selectedPlan = plan.id">
            <img :src="plan.image" alt="" /><span v-if="plan.id === 'yearly'" class="plan-saving">{{ t('offerings.saving') }}</span>
            <span class="plan-title">{{ t(`offerings.${plan.id}`) }}</span><span class="plan-description">{{ t(`offerings.${plan.id}Text`) }}</span>
            <span class="plan-price">${{ plan.amount }}<small> / {{ t(`offerings.${plan.period}`) }}</small></span>
          </button>
        </div>
        <OfferingOrderForm kind="deity" :amount="activePlan.amount" :period="t(`offerings.${activePlan.period}`)" @submit="details = $event" />
      </div>
    </section>
    <!-- details 非空即打开下单确认弹窗，关闭时置空。 -->
    <OfferingDialog v-if="details" kind="deity" :title="deity.title" :amount="activePlan.amount" :period="t(`offerings.${activePlan.period}`)" :plan-label="t(`offerings.${activePlan.id}`)" :details="details" @close="details = null" />
  </OfferingPageShell>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import OfferingPageShell from '@/components/offerings/OfferingPageShell.vue'
import OfferingOrderForm from '@/components/offerings/OfferingOrderForm.vue'
import OfferingDialog from '@/components/offerings/OfferingDialog.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import shrine from '@/assets/offerings/shrine.webp'
import altar from '@/assets/offerings/altar.png'
import candle from '@/assets/offerings/candle.svg'
import censer from '@/assets/offerings/censer.svg'
import shrineEmblem from '@/assets/offerings/shrine-emblem.svg'
import headingLeft from '@/assets/offerings/heading-left.svg'
import headingRight from '@/assets/offerings/heading-right.svg'
import noticeIcon from '@/assets/offerings/notice-icon.svg'
import monthly from '@/assets/offerings/monthly.png'
import yearly from '@/assets/offerings/yearly.png'
const { t, tm } = useI18n()
const route = useRoute()
// 供奉对象取 ?deity= 对应的神明，匹配不到时回退到主推神明。
const deity = computed(() => tm('deities.cards').find(item => item.id === route.query.deity) || tm('deities.featured'))
// 两种供奉方案：月供 18 与年供 180，period 决定价格后缀的单位。
const plans = [{ id: 'monthly', amount: 18, period: 'month', image: monthly }, { id: 'yearly', amount: 180, period: 'year', image: yearly }]
// 默认选中年供。
const selectedPlan = ref('yearly')
// 当前方案，供下单金额、周期与弹窗文案使用。
const activePlan = computed(() => plans.find(plan => plan.id === selectedPlan.value))
// 提交后的下单信息；非空即展示确认弹窗。
const details = ref(null)
</script>
