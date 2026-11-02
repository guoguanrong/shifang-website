<template>
  <div class="deities-page">
    <!-- 全站导航、语言切换和页脚继续复用，保持各独立页面体验一致。 -->
    <HomeHeader @select-locale="setLocale" />

    <main>
      <DeitiesHero />

      <section class="deities-catalog">
        <DeityFilters v-model="activeFilter" />

        <DeityFeaturedCard
          v-if="activeFilter === 'all' || featured.categories.includes(activeFilter)"
          :deity="featured"
          :merit-label="t('deities.meritLabel')"
          :worship-loaded="worshipLoaded"
        />

        <!-- 卡片内容和图片通过稳定 id 关联；翻译包只管理文案，不重复打包图片。 -->
        <TransitionGroup name="deity-list" tag="div" class="deities-grid">
          <DeityCard
            v-for="deity in filteredDeities"
            :key="deity.id"
            :deity="deity"
            :image="deityImages[deity.id]"
            :merit-label="t('deities.meritLabel')"
            :worship-loaded="worshipLoaded"
          />
        </TransitionGroup>

        <p v-if="filteredDeities.length === 0" class="empty-state">{{ t('deities.empty') }}</p>
      </section>
    </main>

    <HomeFooter />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import DeitiesHero from '@/components/deities/DeitiesHero.vue'
import DeityCard from '@/components/deities/DeityCard.vue'
import DeityFeaturedCard from '@/components/deities/DeityFeaturedCard.vue'
import DeityFilters from '@/components/deities/DeityFilters.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import { deityImages } from '@/components/deities/deityImages'
import { getWorshipList } from '@/api/worship'
import { deityGodNames, getWorshipRecords } from '@/data/deityWorship'

const { t, tm } = useI18n()
const activeFilter = ref('all')
const worshipRecords = ref([])
const worshipLoaded = ref(false)

const recordsByName = computed(() => new Map(worshipRecords.value.map((record) => [record.matchGod, record])))
function getWorshipForDeity(id) {
  return recordsByName.value.get(deityGodNames[id]) || null
}

const featured = computed(() => {
  const deity = tm('deities.featured')
  return { ...deity, worship: getWorshipForDeity(deity.id) }
})
// 卡片顺序与设计稿一致，由语言包 cards 数组顺序决定（切换语言保持同序）。
const deities = computed(() => tm('deities.cards').map((deity) => ({
  ...deity,
  worship: getWorshipForDeity(deity.id),
})))
const filteredDeities = computed(() => {
  if (activeFilter.value === 'all') return deities.value
  return deities.value.filter((deity) => deity.categories.includes(activeFilter.value))
})

async function loadWorshipRecords() {
  try {
    const payload = await getWorshipList({ page: 1, pageSize: 1000 })
    worshipRecords.value = getWorshipRecords(payload)
    worshipLoaded.value = true
  } catch {
    worshipRecords.value = []
  }
}

async function setLocale(nextLocale) {
  await setAppLocale(nextLocale)
}

onMounted(loadWorshipRecords)
</script>

<style scoped>
.deities-page { min-width: 320px; overflow-x: clip; background: #f8f5ed; }
.deities-catalog { min-height: 3852px; padding-bottom: 61px; background: #f8f5ed; }

/* 卡片流式换行并整体居中；列间距 86.67px = 设计稿 466.67px 栅格位 - 400px 卡片宽， */
/* 保证与 Figma 相同的列节奏，同时让筛选后不足一行的卡片也居中排列。 */
.deities-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 50px 86.67px;
  width: min(100%, 1440px);
  margin: 50px auto 0;
}

.deities-grid > * { flex: 0 0 auto; }

.empty-state { margin: 80px auto 0; color: #8e6e49; font-size: 18px; text-align: center; }
.deity-list-enter-active, .deity-list-leave-active, .deity-list-move { transition: opacity .25s ease, transform .25s ease; }
.deity-list-enter-from, .deity-list-leave-to { opacity: 0; transform: translateY(16px); }

@media (max-width: 1439px) {
  .deities-catalog { min-height: 0; }
}

@media (max-width: 430px) {
  .deities-grid {
    width: calc(100% - 28px);
    row-gap: 34px;
  }

  .deities-grid > * { flex-basis: 100%; }
}

:global(html[data-locale-layout='international'] .deities-grid) { row-gap: 50px; }
</style>
