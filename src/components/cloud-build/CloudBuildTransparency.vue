<template>
  <section class="transparency-section">
    <div class="red-field red-field-left" aria-hidden="true" />
    <div class="red-field red-field-right" aria-hidden="true" />

    <div class="transparency-canvas">
      <div class="promise-copy">
        <header>
          <h2>{{ t('cloudBuild.transparency.title') }}</h2>
          <p>{{ t('cloudBuild.transparency.promise') }}</p>
        </header>

        <div class="promise-list">
          <article v-for="item in promises" :key="item">
            <span class="promise-icon" aria-hidden="true">
              <img :src="checkBackground" alt="" />
              <img :src="checkIcon" alt="" />
            </span>
            <p>{{ item }}</p>
          </article>
        </div>

        <!-- <button class="details-button" type="button" @click="router.push({ name: 'fund-details' })">
          <span>{{ t('cloudBuild.transparency.action') }}</span>
          <img :src="detailsArrow" alt="" aria-hidden="true" />
        </button> -->
      </div>

      <div class="chart-panel">
        <!-- 饼图由 ECharts 依据 chartItems 绘制，数据与配色变化时自动重绘。 -->
        <div class="pie-chart" aria-hidden="true">
          <div ref="chartEl" class="pie-canvas" />
          <span>{{ t('cloudBuild.transparency.chartTitle') }}</span>
        </div>

        <ul class="chart-legend">
          <li v-for="(item, index) in chartItems" :key="`${index}-${item.label}`"
            :class="{ 'is-highlighted': index === 0 }">
            <img :src="legendIcons[index]" alt="" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import checkBackground from '@/assets/cloud-build/check-bg.svg'
import checkIcon from '@/assets/cloud-build/check.svg'
import detailsArrow from '@/assets/cloud-build/details-arrow.svg'
import legendBlack from '@/assets/cloud-build/legend-black.svg'
import legendBlue from '@/assets/cloud-build/legend-blue.svg'
import legendDarkRed from '@/assets/cloud-build/legend-dark-red.svg'
import legendGreen from '@/assets/cloud-build/legend-green.svg'
import legendIndigo from '@/assets/cloud-build/legend-indigo.svg'
import legendRed from '@/assets/cloud-build/legend-red.svg'
import legendTan from '@/assets/cloud-build/legend-tan.svg'

// 按需注册，只打进饼图和提示框，避免把整包 ECharts 塞进首屏。
echarts.use([PieChart, TooltipComponent, CanvasRenderer])

// 与图例圆点取色一致，保证扇区和图例一一对应。
const CHART_COLORS = ['#CC3513', '#7F0001', '#2B59A2', '#09786B', '#3A4072', '#CAAB89', '#000000']

const { t, tm } = useI18n()
const router = useRouter()
const promises = computed(() => tm('cloudBuild.transparency.items'))
const chartItems = computed(() => tm('cloudBuild.transparency.chartItems'))
const legendIcons = [legendRed, legendDarkRed, legendBlue, legendGreen, legendIndigo, legendTan, legendBlack]

const chartEl = ref(null)
let chartInstance = null
let chartResizeObserver = null

// 语言包里的 value 是「42%」这类展示文案，转成数值供图表计算占比。
const chartSeriesData = computed(() =>
  chartItems.value.map((item, index) => ({
    name: item.label,
    value: Number.parseFloat(item.value) || 0,
    itemStyle: { color: CHART_COLORS[index % CHART_COLORS.length] },
  })),
)

function renderChart() {
  chartInstance?.setOption({
    tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
    series: [
      {
        type: 'pie',
        // 沿用旧切图的比例：外圈约 240px，中心留出约 80px 圆孔放标题。
        radius: ['30%', '92%'],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        data: chartSeriesData.value,
      },
    ],
  })
}

onMounted(() => {
  chartInstance = echarts.init(chartEl.value)
  renderChart()
  // 窄屏下面板尺寸会变，用 ResizeObserver 让画布跟着重绘。
  chartResizeObserver = new ResizeObserver(() => chartInstance?.resize())
  chartResizeObserver.observe(chartEl.value)
})

// 切换语言后文案变化，重新写入数据即可，不必重建实例。
watch(chartSeriesData, renderChart)

onBeforeUnmount(() => {
  chartResizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped>
.transparency-section {
  position: relative;
  height: 560px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8f5ef 0%, #f3f0e9 100%);
}

.red-field {
  position: absolute;
  top: 0;
  height: 560px;
  background: #d45f45;
}

.red-field::before {
  position: absolute;
  inset: 0;
  content: '';
  background: url('@/assets/cloud-build/red-texture.png') top left / 512px 512px repeat;
  mix-blend-mode: luminosity;
  opacity: .05;
}

.red-field::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(180deg, #cc3513 0%, rgba(180, 41, 12, 0) 100%);
}

.red-field-left {
  right: calc(50% + 700px);
  width: max(20px, calc((100vw - 1400px) / 2));
}

.red-field-right {
  left: calc(50% + 47px);
  right: 0;
}

.transparency-canvas {
  position: relative;
  z-index: 1;
  width: 1440px;
  height: 560px;
  margin: 0 auto;
}

.promise-copy {
  position: absolute;
  inset: 0 auto auto 0;
  width: 570px;
  height: 560px;
}

.promise-copy header {
  position: absolute;
  top: 65px;
  left: 83px;
  width: 420px;
  color: #2e4c7c;
}

.promise-copy h2 {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: .8px;
}

.promise-copy header p {
  margin: 3px 0 0;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: .8px;
}

.promise-list {
  position: absolute;
  top: 135px;
  left: 100px;
  display: grid;
  gap: 30px;
}

.promise-list article {
  position: relative;
  display: flex;
  align-items: center;
  width: 403px;
  height: 130px;
  padding-left: 60px;
  background: rgba(255, 255, 255, .1);
  border-radius: 20px;
  box-shadow: 0 3px 6px #f3eae0;
}

.promise-list article p {
  margin: 0;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  line-height: 30px;
}

.promise-icon {
  position: absolute;
  top: 31px;
  left: -17px;
  width: 64px;
  height: 64px;
}

.promise-icon img {
  position: absolute;
  width: 60px;
  height: 60px;
}

.promise-icon img:first-child {
  top: 4px;
  left: 0;
}

.promise-icon img:last-child {
  top: 0;
  left: 4px;
}

.details-button {
  position: absolute;
  top: 465px;
  left: 203px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 180px;
  height: 42px;
  padding: 0 14px;
  color: #fff;
  font: inherit;
  font-size: 16px;
  background: #cc3513 url('@/assets/co-build/button-texture.png') center / cover no-repeat;
  border: 1px solid #c29f79;
  border-radius: 100px;
  box-shadow: inset 0 0 0 3px #cc3513, inset 0 0 0 3.5px #c29f79;
  cursor: pointer;
  transition: filter .2s ease, transform .2s ease;
}

.details-button::before,
.details-button::after {
  position: absolute;
  top: 50%;
  width: 5px;
  height: 5px;
  content: '';
  border: 1px solid #f1d0a9;
  transform: translateY(-50%) rotate(45deg);
}

.details-button::before {
  left: 3px;
}

.details-button::after {
  right: 3px;
}

.details-button img {
  width: 24px;
  height: 24px;
}

.details-button:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

.chart-panel {
  position: absolute;
  top: 65px;
  left: 570px;
  width: 770px;
  height: 442px;
  background: #fff;
}

.pie-chart {
  position: absolute;
  top: 89px;
  left: 30px;
  width: 262px;
  height: 262px;
}

.pie-canvas {
  position: absolute;
  inset: 0;
}

.pie-chart span {
  position: absolute;
  z-index: 2;
  top: 110px;
  left: 111px;
  width: 40px;
  color: #000;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 1.6px;
}

.chart-legend {
  position: absolute;
  top: 74px;
  left: 395px;
  width: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.chart-legend li {
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr 48px;
  gap: 12px;
  align-items: center;
  height: 44px;
  padding: 0 10px 0 7px;
  color: #000;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

.chart-legend li.is-highlighted {
  height: 30px;
  margin-bottom: 7px;
  background: #f3f0e9;
  border-radius: 1000px;
}

.chart-legend img {
  width: 18px;
  height: 18px;
}

.chart-legend strong {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-align: right;
}

:global(html[data-locale-layout='international'] .transparency-section .promise-copy h2),
:global(html[data-locale-layout='international'] .transparency-section .promise-list article p) {
  font-family: Georgia, serif;
}

:global(html[data-locale-layout='international'] .transparency-section .promise-copy h2) {
  font-size: 27px;
}

:global(html[data-locale-layout='international'] .transparency-section .promise-list article p) {
  max-width: 315px;
  font-size: 18px;
  line-height: 24px;
}

:global(html[data-locale-layout='international'] .transparency-section .chart-legend li) {
  font-size: 12px;
  letter-spacing: 0;
}

@media (max-width: 1100px) {
  .transparency-section {
    height: auto;
    min-height: 980px;
    padding: 58px 24px 70px;
    background: linear-gradient(160deg, #f8f5ef 0 52%, #d45f45 52% 100%);
  }

  .red-field {
    display: none;
  }

  .transparency-canvas {
    display: flex;
    width: min(100%, 770px);
    height: auto;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .promise-copy {
    position: relative;
    width: min(100%, 570px);
    height: 490px;
  }

  .promise-copy header {
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .promise-list {
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
  }

  .details-button {
    top: 420px;
    left: 50%;
    transform: translateX(-50%);
  }

  .details-button:hover {
    transform: translateX(-50%) translateY(-2px);
  }

  .chart-panel {
    position: relative;
    top: auto;
    left: auto;
    width: min(100%, 770px);
    flex: 0 0 auto;
  }
}

@media (max-width: 650px) {
  .transparency-section {
    min-height: 1020px;
    padding: 50px 14px 58px;
  }

  .promise-copy {
    height: 440px;
  }

  .promise-copy h2 {
    font-size: 27px;
  }

  .promise-list {
    top: 82px;
    width: calc(100% - 10px);
    gap: 20px;
  }

  .promise-list article {
    width: 100%;
    height: 112px;
    padding: 20px 18px 20px 54px;
  }

  .promise-list article p {
    font-size: 19px;
    line-height: 25px;
  }

  .promise-icon {
    top: 25px;
    left: -10px;
    transform: scale(.82);
  }

  .details-button {
    top: 385px;
  }

  .chart-panel {
    display: flex;
    height: auto;
    min-height: 520px;
    padding: 28px 14px 30px;
    flex-direction: column;
    align-items: center;
  }

  .pie-chart {
    position: relative;
    top: auto;
    left: auto;
    flex: 0 0 262px;
  }

  .chart-legend {
    position: relative;
    top: auto;
    left: auto;
    width: min(100%, 320px);
    margin-top: 6px;
  }

  .chart-legend li {
    height: 38px;
    font-size: 14px;
  }

  :global(html[data-locale-layout='international'] .transparency-section .promise-copy h2) {
    font-size: 23px;
  }
}
</style>
