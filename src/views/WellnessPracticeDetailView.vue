<template>
  <!-- 跟练视频详情页：正文按列表页携带的 ?id= 从跟练视频接口加载。 -->
  <CommunityDetailShell
    :section="t('wellness.hero.title')"
    :section-to="{ name: 'wellness' }"
    :eyebrow="t('wellness.practice.eyebrow')"
    :title="detailItem?.title || t('wellness.practice.title')"
  >
    <!-- 顶部元信息：难度 / 时长 / 形式。 -->
    <template v-if="detailItem" #meta>
      <span v-if="tags.length">{{ tags.join(' · ') }}</span>
    </template>

    <article v-if="detailItem" class="detail-surface detail-surface--video practice-detail-surface">
      <div class="detail-media">
        <video v-if="videoUrl" :key="videoUrl" :src="videoUrl" :poster="coverImage" controls playsinline />
        <img v-else :src="coverImage" :alt="detailItem.title || ''" />
      </div>
      <div class="practice-detail-body">
        <h2>{{ detailItem.title }}</h2>
        <p v-if="detailItem.intro" class="practice-detail-intro">{{ detailItem.intro }}</p>
        <div v-if="tags.length" class="practice-detail-tags">
          <span v-for="tag in tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </article>

    <!-- 功法脉络：infoArr（JSON 数组）解析出的图文小节，独立白卡展示。 -->
    <section v-if="infoSections.length" class="practice-info-card">
      <h2 class="practice-info-heading">{{ t('wellness.practice.infoTitle') }}</h2>
      <div v-for="(section, index) in infoSections" :key="index" class="practice-info-section">
        <h3>{{ section.title }}</h3>
        <p>{{ section.text }}</p>
      </div>
    </section>

    <!-- 无 id、视频不存在或加载失败时展示空态，不回退静态演示内容。 -->
    <p v-if="!detailItem" class="detail-empty" role="status">{{ t('wellness.practice.empty') }}</p>
  </CommunityDetailShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getSportWellnessById } from '@/api/sportWellness'
import CommunityDetailShell from '@/components/community/CommunityDetailShell.vue'
import baduanjin from '@/assets/wellness/practice-baduanjin.webp'
import changshou from '@/assets/wellness/practice-changshou.webp'
import jingang from '@/assets/wellness/practice-jingang.webp'
import liuzijue from '@/assets/wellness/practice-liuzijue.webp'
import taiji from '@/assets/wellness/practice-taiji.webp'
import wuqinxi from '@/assets/wellness/practice-wuqinxi.webp'

const { t } = useI18n()
const route = useRoute()

// 跟练视频详情（SportWellnessVo）：与列表页同源接口，按路由 ?id= 加载。
const detailItem = ref(null)

async function loadDetail(id) {
  detailItem.value = null
  if (!id) return

  try {
    const item = await getSportWellnessById(id, { silent: true })
    detailItem.value = item || null
  } catch {
    detailItem.value = null
  }
}

watch(() => route.query.id, loadDetail, { immediate: true })

// 接口无封面字段：按标题关键词匹配本地功法切图（与列表页同一套），未命中时按序兜底。
const practiceImages = [baduanjin, jingang, wuqinxi, changshou, liuzijue, taiji]
const COVER_MATCHES = [
  { keys: ['八段锦', 'baduanjin', 'eight brocade'], image: baduanjin },
  { keys: ['金刚功', 'jingang', 'jingang gong'], image: jingang },
  { keys: ['五禽戏', 'wuqinxi', 'five-animal'], image: wuqinxi },
  { keys: ['长寿功', 'changshou', 'longevity'], image: changshou },
  { keys: ['六字诀', 'liuzijue', 'healing sounds'], image: liuzijue },
  { keys: ['太极', 'taiji', 'tai chi'], image: taiji },
]

const coverImage = computed(() => {
  const title = String(detailItem.value?.title || '').toLowerCase()
  return COVER_MATCHES.find(({ keys }) => keys.some((key) => title.includes(key)))?.image
    || practiceImages[Number(route.query.id || 0) % practiceImages.length]
})

const videoUrl = computed(() => detailItem.value?.videoUrl || '')

// 标签：难度 / 时长 / 形式（难度支持中英文值归一）。
const difficultyLabel = computed(() => {
  const difficulty = String(detailItem.value?.difficulty || '').trim()
  const normalized = difficulty.toLowerCase()
  if (['入门', 'beginner', 'basic'].includes(normalized)) return t('wellness.practice.beginner')
  if (['进阶', 'advanced', 'intermediate'].includes(normalized)) return t('wellness.practice.advanced')
  return difficulty
})

const tags = computed(() => {
  const duration = Number(detailItem.value?.duration)
  return [
    difficultyLabel.value,
    duration > 0 ? `${duration} ${t('wellness.practice.durationUnit')}` : '',
    detailItem.value?.modality || '',
  ].filter(Boolean)
})

// 功法脉络：infoArr 为 JSON 数组（兼容字符串形态）；项支持 {title, text} 对象与纯字符串两种。
const infoSections = computed(() => {
  const raw = detailItem.value?.infoArr
  let list = []

  if (Array.isArray(raw)) {
    list = raw
  } else if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      list = Array.isArray(parsed) ? parsed : []
    } catch {
      list = []
    }
  }

  return list
    .map((entry) => {
      if (entry && typeof entry === 'object') {
        return { title: String(entry.title || ''), text: String(entry.text || entry.content || entry.desc || '') }
      }
      return { title: '', text: String(entry || '') }
    })
    .filter((section) => section.title || section.text)
})
</script>

<style scoped>
/* 视频播放器填满 16:9 媒体容器（video 默认按文件分辨率显示，会留大片空白）。 */
.detail-media video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* 信息条：标题、简介与标签。 */
.practice-detail-body { padding: 26px 36px 30px; }
.practice-detail-body h2 { margin: 0 0 10px; color: #111; font-family: var(--font-calligraphy); font-size: 22px; font-weight: 500; line-height: 1.3; }
.practice-detail-intro { margin: 0 0 14px; color: #4c463f; font-size: 14px; line-height: 1.7; }
.practice-detail-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.practice-detail-tags span { display: inline-flex; align-items: center; height: 20px; padding: 0 10px; color: #8a5422; font-size: 12px; background: #ffe9d2; border-radius: 100px; }

/* 功法脉络卡片：独立白卡，小节标题为金棕渐变标签条。 */
.practice-info-card {
  width: min(100%, 1240px);
  margin: 24px auto 0;
  padding: 34px 40px 40px;
  background: rgba(255, 253, 250, .92);
  border: 1px solid rgba(216, 172, 114, .45);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(72, 48, 26, .035);
}

.practice-info-heading {
  display: inline-flex;
  align-items: center;
  margin: 0 0 26px;
  padding: 5px 14px;
  color: #5e4e3e;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  background: linear-gradient(90deg, rgba(218, 190, 154, .78), rgba(244, 231, 213, .58) 65%, transparent);
  border-radius: 999px;
}

.practice-info-section + .practice-info-section { margin-top: 24px; }

.practice-info-section h3 {
  display: inline-flex;
  margin: 0 0 10px;
  padding: 4px 12px;
  color: #8a5422;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  background: linear-gradient(90deg, rgba(218, 190, 154, .78), rgba(244, 231, 213, .58) 65%, transparent);
  border-radius: 999px;
}

.practice-info-section p {
  margin: 0;
  color: #37332e;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 1.9;
  text-align: justify;
  white-space: pre-line;
}

.detail-empty {
  margin: 0;
  color: #8b7a63;
  font-size: 15px;
  text-align: center;
}
</style>
