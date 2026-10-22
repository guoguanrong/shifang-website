<template>
  <section class="honor-section">
    <CoBuildSectionHeading :title="t('coBuild.honor.title')" :subtitle="t('coBuild.honor.subtitle')" />

    <!-- 名录充足时以两份相同列表首尾衔接实现无空白自动轮播；不足一屏时只渲染一份并停用动画；无真实数据时显示暂无数据提示。 -->
    <div class="honor-window" :class="{ 'is-static': !canMarquee }" :aria-label="t('coBuild.honor.title')">
      <div v-if="donors.length" class="honor-marquee">
        <div v-for="copyIndex in canMarquee ? 2 : 1" :key="copyIndex" class="honor-list"
          :aria-hidden="canMarquee && copyIndex === 2">
          <article v-for="(donor, index) in donors" :key="`${copyIndex}-${index}`">
            <span class="donor-avatar" :class="{ anonymous: donor.anonymous }">
              <img :src="donor.anonymous ? anonymousSeal : personSeal" alt="" aria-hidden="true" />
              <b>{{ donor.initial }}</b>
            </span>
            <span class="donor-name">{{ donor.name }}</span>
            <strong>{{ donor.gift }}</strong>
          </article>
        </div>
      </div>
      <p v-else class="honor-empty">{{ t('coBuild.honor.empty') }}</p>
    </div>

    <p class="honor-blessing">{{ t('coBuild.honor.blessing') }}</p>
    <button class="honor-cta" type="button" @click="goToDonation">{{ t('coBuild.cta') }}</button>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'
import { getDonateTargetList } from '@/api/donateTarget'
import { getMeritList } from '@/api/order'
import anonymousSeal from '@/assets/co-build/donor-seal-anonymous.svg'
import personSeal from '@/assets/co-build/donor-seal-person.svg'

const { t } = useI18n()
const router = useRouter()

// 接口数据：功德名录（已完成捐赠的订单）。
const apiDonors = ref([])

// 捐赠记录 → 名录条目：捐钱展示金额，捐物展示物品与数量；未留名的显示匿名。
function mapMerit(item) {
  const name = String(item.username || '').trim()
  const isGoods = Number(item.donateType) === 2
  return {
    name: name || t('coBuild.honor.anonymousName'),
    initial: name ? name.slice(0, 1) : t('coBuild.honor.anonymousInitial'),
    anonymous: !name,
    gift: isGoods
      ? `${item.itemName || ''} × ${Number(item.number || 1)}`
      : `$${Number(item.amount || 0).toLocaleString('en-US')}`,
  }
}

async function loadMeritList() {
  try {
    const result = await getMeritList({ page: 1, pageSize: 200 }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list
    apiDonors.value = Array.isArray(list) ? list.map(mapMerit) : []
  } catch {
    apiDonors.value = []
  }
}

// 只展示接口返回的真实功德名录；无数据/加载失败时保持为空，版块随之隐藏，不再以语言包示例兜底。
const donors = computed(() => apiDonors.value)

// 少于一屏（宽屏 6 列 × 2 行）时停用轮播并只渲染一份，避免同屏出现明显重复。
const MARQUEE_MIN = 12
const canMarquee = computed(() => donors.value.length >= MARQUEE_MIN)

onMounted(loadMeritList)

// 点击进入捐赠详情页：取第一个可用捐赠目标，跳转逻辑与共建 hero 的 goToDonation 一致。
async function goToDonation() {
  let goal = null
  try {
    const payload = await getDonateTargetList({ status: 1, page: 1, pageSize: 1 }, { silent: true })
    const result = payload?.data ?? payload
    const list = Array.isArray(result) ? result : result?.list || result?.records || []
    goal = (Array.isArray(list) ? list : []).find((item) => item.status === undefined || Number(item.status) === 1) || null
  } catch {
    goal = null
  }

  router.push({
    name: 'donation',
    query: {
      type: Number(goal?.type) === 2 ? '2' : '1',
      ...(goal?.id ? { targetId: String(goal.id) } : {}),
    },
  })
}
</script>

<style scoped>
.honor-section {
  padding: 0 20px 53px;
  overflow: hidden;
  background: #f8f5ed;
}

.honor-window {
  width: 1440px;
  height: 450px;
  margin: 14px auto 0;
  overflow: hidden;
}

/* 名录不足一屏：窗口高度自适应、停用滚动动画，条目原样静态展示。 */
.honor-window.is-static {
  height: auto;
}

/* 无真实数据时的空状态占位。 */
.honor-empty {
  display: grid;
  place-items: center;
  min-height: 220px;
  margin: 0;
  color: #a89a85;
  font-size: 15px;
  letter-spacing: 3px;
}

.honor-window.is-static .honor-marquee {
  animation: none;
}

.honor-marquee {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: honor-scroll 44s linear 2s infinite;
}

.honor-window:hover .honor-marquee {
  animation-play-state: paused;
}

.honor-list {
  display: grid;
  grid-template-columns: repeat(6, 231.67px);
  grid-auto-rows: 36px;
  gap: 10px;
}

.honor-list article {
  display: flex;
  height: 36px;
  align-items: center;
  padding: 0 13px 0 8px;
  background: rgba(255, 255, 255, .45);
  border-radius: 1000px;
  box-shadow: 0 2px 4px #f3eae0;
}

.donor-avatar {
  position: relative;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  margin-right: 8px;
}

.donor-avatar img {
  position: absolute;
  inset: 0;
  width: 24px;
  height: 24px;
}

.donor-avatar b {
  position: relative;
  z-index: 1;
  display: grid;
  height: 24px;
  place-items: center;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
}

.donor-name {
  min-width: 0;
  overflow: hidden;
  color: #333;
  font-size: 14px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.honor-list strong {
  flex: 0 0 auto;
  margin-left: auto;
  color: #caab89;
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.honor-blessing {
  margin: 20px 0 0;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 22px;
  line-height: 56px;
  text-align: center;
}

.honor-cta {
  display: block;
  width: 320px;
  height: 56px;
  margin: 12px auto 0;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  background: linear-gradient(90deg, #cc3513, #981c04), url('@/assets/co-build/button-texture.png') center / cover;
  border: 2px solid #c29f79;
  border-radius: 100px;
  box-shadow: inset 0 0 0 3px #cc3513, inset 0 0 0 4px #c29f79;
  cursor: pointer;
  transition: filter .2s ease, transform .2s ease;
}

.honor-cta:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

@keyframes honor-scroll {
  to {
    transform: translateY(calc(-50% - 5px));
  }
}

:global(html[data-locale-layout='international'] .honor-list article) {
  padding-right: 9px;
}

:global(html[data-locale-layout='international'] .donor-name) {
  font-family: Arial, sans-serif;
  font-size: 11px;
}

:global(html[data-locale-layout='international'] .honor-list strong) {
  font-size: 10px;
}

:global(html[data-locale-layout='international'] .honor-empty) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .honor-blessing),
:global(html[data-locale-layout='international'] .honor-cta) {
  font-family: Georgia, serif;
  font-size: 16px;
}

@media (max-width: 1439px) {
  .honor-window {
    width: min(100%, 830px);
  }

  .honor-list {
    grid-template-columns: repeat(4, minmax(0, 198px));
    justify-content: center;
  }
}

@media (max-width: 860px) {
  .honor-window {
    width: min(100%, 614px);
  }

  .honor-list {
    grid-template-columns: repeat(3, minmax(0, 198px));
  }

  .honor-marquee {
    animation-duration: 58s;
  }
}

@media (max-width: 640px) {
  .honor-section {
    padding-inline: 15px;
  }

  .honor-window {
    width: min(100%, 406px);
  }

  .honor-list {
    grid-template-columns: repeat(2, minmax(0, 198px));
  }

  .honor-marquee {
    animation-duration: 75s;
  }

  .honor-blessing {
    font-size: 17px;
    line-height: 30px;
  }

  .honor-cta {
    width: min(100%, 300px);
    height: 50px;
    font-size: 20px;
  }
}

@media (max-width: 430px) {
  .honor-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .honor-list article {
    padding-right: 7px;
  }

  .donor-name {
    font-size: 11px;
  }

  .honor-list strong {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .honor-marquee {
    animation: none;
  }

  .honor-window {
    overflow-y: auto;
  }
}
</style>
