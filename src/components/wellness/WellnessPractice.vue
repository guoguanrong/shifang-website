<template>
  <!-- 养生功法：六张卡片，含封面播放按钮、标签与「开始练习」。 -->
  <section class="practice-section">
    <WellnessSectionHeading
      :eyebrow="t('wellness.practice.eyebrow')"
      :title="t('wellness.practice.title')"
      :subtitle="t('wellness.practice.subtitle')"
    />

    <div v-if="items.length" class="practice-grid">
      <article v-for="(item, index) in items" :key="item.id || `${item.title}-${index}`" class="practice-card">
        <div class="practice-cover">
          <img :src="getCover(item, index)" alt="" />
          <!-- 播放按钮与「开始跟练」均跳转到跟练视频详情页。 -->
          <button class="play-button" type="button" :aria-label="`${t('wellness.practice.action')}：${item.title}`" @click="goDetail(item)">
            <img :src="playCircle" alt="" /><img :src="playIcon" alt="" />
          </button>
        </div>
        <div class="practice-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.intro }}</p>
          <div class="practice-tags"><span v-for="tag in getTags(item)" :key="tag">{{ tag }}</span></div>
          <button class="practice-action" type="button" @click="goDetail(item)">{{ t('wellness.practice.action') }}</button>
        </div>
      </article>
    </div>
    <p v-if="isLoading" class="practice-message">{{ t('wellness.practice.loading') }}</p>
    <div v-else-if="loadError" class="practice-message">
      <span>{{ t('wellness.practice.loadError') }}</span>
      <button type="button" @click="retryLoad">{{ t('wellness.practice.retry') }}</button>
    </div>
    <p v-else-if="!items.length" class="practice-message">{{ t('wellness.practice.empty') }}</p>
    <button v-if="hasMore" class="more-button" type="button" :disabled="isLoading" @click="loadMore">
      {{ isLoading ? t('wellness.practice.loadingMore') : t('wellness.practice.more') }}<span aria-hidden="true">›</span>
    </button>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getSportWellnessList } from '@/api/sportWellness'
import playCircle from '@/assets/wellness/play-circle.svg'
import playIcon from '@/assets/wellness/play-icon.svg'
import baduanjin from '@/assets/wellness/practice-baduanjin.webp'
import changshou from '@/assets/wellness/practice-changshou.webp'
import jingang from '@/assets/wellness/practice-jingang.webp'
import liuzijue from '@/assets/wellness/practice-liuzijue.webp'
import taiji from '@/assets/wellness/practice-taiji.webp'
import wuqinxi from '@/assets/wellness/practice-wuqinxi.webp'
import WellnessSectionHeading from './WellnessSectionHeading.vue'

const PAGE_SIZE = 6
const { t } = useI18n()
const router = useRouter()
const items = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const loadError = ref(false)
const failedPage = ref(1)
const failedAppend = ref(false)
const hasMore = computed(() => currentPage.value < totalPages.value)
const practiceImages = [baduanjin, jingang, wuqinxi, changshou, liuzijue, taiji]

function getPage(payload) {
  const page = payload?.data && !payload.list && !payload.records ? payload.data : payload
  const rows = Array.isArray(page) ? page : page?.list || page?.records || []
  return { page, rows }
}

function isShown(value) {
  return value === undefined || value === null
    || value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true'
}

async function loadPage(pageNumber, append = false) {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = false
  failedPage.value = pageNumber
  failedAppend.value = append
  try {
    const result = await getSportWellnessList({ page: pageNumber, pageSize: PAGE_SIZE, show: true })
    const { page, rows } = getPage(result)
    const visibleRows = rows.filter((item) => isShown(item.show))
    items.value = append ? [...items.value, ...visibleRows] : visibleRows
    currentPage.value = pageNumber
    const pageCount = Number(page?.totalPage ?? page?.totalPages)
    const totalRows = Number(page?.totalRow ?? page?.total ?? 0)
    totalPages.value = pageCount > 0
      ? pageCount
      : totalRows > 0
        ? Math.ceil(totalRows / PAGE_SIZE)
        : visibleRows.length === PAGE_SIZE ? pageNumber + 1 : pageNumber
  } catch {
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

function loadMore() {
  if (hasMore.value) loadPage(currentPage.value + 1, true)
}

function retryLoad() {
  loadPage(failedPage.value, failedAppend.value)
}

function getCover(item, index) {
  const title = String(item.title || '').toLowerCase()
  const matches = [
    { keys: ['八段锦', 'baduanjin', 'eight brocade'], image: baduanjin },
    { keys: ['金刚功', 'jingang', 'jingang gong'], image: jingang },
    { keys: ['五禽戏', 'wuqinxi', 'five-animal'], image: wuqinxi },
    { keys: ['长寿功', 'changshou', 'longevity'], image: changshou },
    { keys: ['六字诀', 'liuzijue', 'healing sounds'], image: liuzijue },
    { keys: ['太极', 'taiji', 'tai chi'], image: taiji },
  ]
  return matches.find(({ keys }) => keys.some((key) => title.includes(key)))?.image
    || practiceImages[index % practiceImages.length]
}

function getTags(item) {
  const difficulty = String(item.difficulty || '').trim()
  const normalizedDifficulty = difficulty.toLowerCase()
  const difficultyLabel = ['入门', 'beginner', 'basic'].includes(normalizedDifficulty)
    ? t('wellness.practice.beginner')
    : ['进阶', 'advanced', 'intermediate'].includes(normalizedDifficulty)
      ? t('wellness.practice.advanced')
      : difficulty
  const duration = Number(item.duration)
  return [
    difficultyLabel,
    duration > 0 ? `${duration} ${t('wellness.practice.durationUnit')}` : '',
    item.modality || '',
  ].filter(Boolean)
}

// 点击卡片/播放按钮：跳转到跟练视频详情页（由详情页加载视频并播放）。
function goDetail(item) {
  router.push({
    name: 'wellness-practice-detail',
    query: item?.id != null ? { id: String(item.id) } : {},
  })
}

onMounted(() => loadPage(1))
</script>

<style scoped>
.practice-section { min-height: 557px; height: auto; padding-bottom: 84px; background: #f8f5ed; }
/* 三列卡片，窄屏依次降为两列、一列。 */
.practice-grid { display: grid; grid-template-columns: repeat(3, 446.67px); gap: 30px 50px; width: 1440px; margin: 39px auto 0; }
.practice-card { height: 368px; overflow: hidden; background: linear-gradient(130deg, #fff 35%, #f3eae0 100%); border-radius: 12px; transition: box-shadow .25s ease, transform .25s ease; }
.practice-cover { position: relative; width: 100%; height: 180px; overflow: hidden; border-radius: 12px 12px 0 0; }
.practice-cover > img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.practice-card:nth-child(2) .practice-cover > img { object-position: center 39%; }.practice-card:nth-child(3) .practice-cover > img { object-position: center 43%; }
.play-button { position: absolute; top: 75px; left: 50%; width: 43px; height: 40px; padding: 0; background: none; border: 0; cursor: pointer; transform: translateX(-50%); transition: transform .2s ease, filter .2s ease; }
.play-button img { position: absolute; inset: 0; width: 100%; height: 100%; }.play-button img:last-child { top: 2px; left: 0; }
.practice-body { position: relative; height: 188px; padding: 20px; }
.practice-body h3 { width: 100%; margin: 0 0 5px; color: #000; font-family: var(--font-calligraphy); font-size: 18px; font-weight: 400; line-height: 20px; letter-spacing: 1.8px; }
.practice-body p { height: 40px; margin: 0; color: #000; font-size: 12px; line-height: 20px; letter-spacing: 1.2px; }
.practice-tags { display: flex; gap: 12px; margin-top: 5px; }
.practice-tags span { display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 18px; padding: 0 8px; color: #000; font-size: 12px; line-height: 18px; background: #ffe9d2; border-radius: 100px; }
.practice-action { min-width: 137px; height: 36px; padding: 0 22px; margin-top: 14px; color: #fff; font-family: var(--font-calligraphy); font-size: 14px; letter-spacing: 1.4px; background: #cc3513; border: 1px solid #c29f79; border-radius: 100px; box-shadow: inset 0 0 0 2px #cc3513, inset 0 0 0 2.5px #c29f79; cursor: pointer; transition: filter .2s ease, transform .2s ease; }
.more-button { display: flex; align-items: center; justify-content: center; gap: 3px; min-width: 140px; height: 36px; padding: 0 12px 0 23px; margin: 30px auto 0; color: #fff; font-family: var(--font-calligraphy); font-size: 16px; letter-spacing: 1.6px; background: #cc3513; border: 0; border-radius: 100px; box-shadow: inset 0 0 0 2px #cc3513, inset 0 0 0 2.5px #f2d2af; cursor: pointer; transition: filter .2s ease, transform .2s ease; }
.more-button span { font-family: Arial, sans-serif; font-size: 27px; line-height: 1; }
.more-button:disabled { cursor: wait; opacity: .7; }
.practice-message { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 36px auto 0; color: #62584e; font-size: 14px; text-align: center; }
.practice-message button { padding: 0; color: #a33219; background: none; border: 0; cursor: pointer; text-decoration: underline; }

@media (hover: hover) and (pointer: fine) { .practice-card:hover { box-shadow: 0 16px 35px rgba(35,57,70,.15); transform: translateY(-6px); }.practice-card:hover .practice-cover > img { transform: scale(1.045); }.play-button:hover { filter: brightness(1.12); transform: translateX(-50%) scale(1.1); }.practice-action:hover,.more-button:hover { filter: brightness(1.08); transform: translateY(-2px); } }

@media (max-width: 1439px) { .practice-section { height: auto; padding-bottom: 84px; }.practice-grid { grid-template-columns: repeat(2, minmax(0, 380px)); justify-content: center; width: calc(100% - 40px); } }
@media (max-width: 820px) { .practice-grid { grid-template-columns: minmax(0, 380px); margin-top: 38px; } }
@media (max-width: 430px) { .practice-grid { width: calc(100% - 28px); grid-template-columns: 1fr; }.practice-card { height: 382px; }.practice-body { padding-inline: 17px; }.practice-body p { height: 54px; font-size: 12px; line-height: 18px; }.practice-action { margin-top: 12px; } }

:global(html[data-locale-layout='international'] .practice-section h3),
:global(html[data-locale-layout='international'] .practice-section p),
:global(html[data-locale-layout='international'] .practice-section button) { font-family: Georgia, serif; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .practice-section .practice-body h3) { font-size: 18px; }
:global(html[data-locale-layout='international'] .practice-section .practice-body p) { font-size: 12.5px; line-height: 17px; }
:global(html[data-locale-layout='international'] .practice-section .practice-tags) { gap: 7px; }
:global(html[data-locale-layout='international'] .practice-section .practice-tags span) { font-size: 10px; }
</style>
