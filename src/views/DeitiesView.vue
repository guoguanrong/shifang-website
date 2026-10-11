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
        />

        <!-- 卡片内容和图片通过稳定 id 关联；翻译包只管理文案，不重复打包图片。 -->
        <TransitionGroup name="deity-list" tag="div" class="deities-grid">
          <DeityCard
            v-for="deity in filteredDeities"
            :key="deity.id"
            :deity="deity"
            :image="deityImages[deity.id]"
            :merit-label="t('deities.meritLabel')"
          />
        </TransitionGroup>

        <p v-if="filteredDeities.length === 0" class="empty-state">{{ t('deities.empty') }}</p>
      </section>
    </main>

    <HomeFooter />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import DeitiesHero from '@/components/deities/DeitiesHero.vue'
import DeityCard from '@/components/deities/DeityCard.vue'
import DeityFeaturedCard from '@/components/deities/DeityFeaturedCard.vue'
import DeityFilters from '@/components/deities/DeityFilters.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import { deityImages } from '@/components/deities/deityImages'

const { t, tm } = useI18n()
const activeFilter = ref('all')

const featured = computed(() => tm('deities.featured'))
const deities = computed(() => tm('deities.cards'))
const filteredDeities = computed(() => {
  if (activeFilter.value === 'all') return deities.value
  return deities.value.filter((deity) => deity.categories.includes(activeFilter.value))
})

async function setLocale(nextLocale) {
  await setAppLocale(nextLocale)
}
</script>

<style scoped>
.deities-page { min-width: 320px; overflow-x: clip; background: #f8f5ed; }
.deities-catalog { min-height: 3852px; padding-bottom: 61px; background: #f8f5ed; }

.deities-grid {
  display: grid;
  grid-template-columns: repeat(3, 466.67px);
  gap: 50px 20px;
  justify-content: center;
  width: 1440px;
  margin: 50px auto 0;
}

.empty-state { margin: 80px auto 0; color: #8e6e49; font-size: 18px; text-align: center; }
.deity-list-enter-active, .deity-list-leave-active, .deity-list-move { transition: opacity .25s ease, transform .25s ease; }
.deity-list-enter-from, .deity-list-leave-to { opacity: 0; transform: translateY(16px); }

@media (max-width: 1439px) {
  .deities-catalog { min-height: 0; }
  .deities-grid { grid-template-columns: repeat(2, 400px); width: min(100%, 840px); }
}

@media (max-width: 860px) {
  .deities-grid { grid-template-columns: 400px; width: 400px; }
}

@media (max-width: 430px) {
  .deities-grid {
    grid-template-columns: minmax(0, 1fr);
    width: calc(100% - 28px);
    row-gap: 34px;
  }
}

:global(html[data-locale-layout='international'] .deities-grid) { row-gap: 50px; }
</style>
