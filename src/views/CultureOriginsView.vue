<template>
  <main class="culture-page" :class="{ 'is-international': isInternational }">
    <!-- 复用全站固定导航，语言切换由当前页面转交给 i18n。 -->
    <HomeHeader @select-locale="setLocale" />

    <!-- 首屏引言：书法标题、太极视觉、道教简介和经典引文。 -->
    <section id="top" class="culture-intro">
      <!-- 原稿背景逐层还原：云纹、山水渐显蒙版、飘带；装饰层不参与内容布局。 -->
      <div class="intro-artwork" aria-hidden="true">
        <div class="intro-bamboo" />
        <div class="intro-sky" />
        <div class="intro-landscape" />
        <div class="intro-ribbon" />
      </div>
      <div class="hero-calligraphy" role="img" :aria-label="t('culture.hero.title')" />
      <div class="intro-slogan">
        <span v-for="line in tm('culture.hero.lines')" :key="line">{{ line }}</span>
      </div>
      <div class="taichi-visual" aria-hidden="true">
        <img class="taichi-cloud taichi-cloud-left" :src="taichiCloud" alt="" />
        <img class="taichi-cloud taichi-cloud-right" :src="taichiCloud" alt="" />
        <img class="taichi" :src="taichi" alt="" />
      </div>

      <CultureHeading class="intro-heading"  :title="t('culture.intro.title')"
        :subtitle="t('culture.intro.subtitle')" />
      <CultureQuote class="intro-quote" :quote="t('culture.intro.quote')" :source="t('culture.intro.quoteSource')" />

      <div class="intro-panel">
        <div class="intro-copy">
          <p v-for="paragraph in tm('culture.intro.paragraphs')" :key="paragraph">{{ paragraph }}</p>
        </div>
        <CultureQuote :quote="t('culture.intro.secondQuote')" :source="t('culture.intro.secondQuoteSource')" />
      </div>
    </section>

    <!-- 五个核心概念：道、德、阴阳、五行、无为。 -->
    <section class="core-section culture-section">
      <CultureHeading :eyebrow="t('culture.core.eyebrow')" :title="t('culture.core.title')"
        :subtitle="t('culture.core.subtitle')" />
      <div class="core-grid culture-container">
        <article v-for="item in tm('culture.core.items')" :key="item.en" class="core-item">
          <div class="core-emblem"><strong>{{ item.char }}</strong><span>{{ item.en }}</span></div>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 道教经典书目：卡片支持悬停展开与自动轮播。 -->
    <section class="scriptures-section culture-section">
      <CultureHeading :eyebrow="t('culture.scriptures.eyebrow')" :title="t('culture.scriptures.title')"
        :subtitle="t('culture.scriptures.subtitle')" />
      <div class="book-row culture-container" @pointerenter="pauseBookAutoplay" @pointerleave="onBookRowLeave">
        <article v-for="(book, index) in tm('culture.scriptures.books')" :key="book.title" class="book-entry"
          :class="[`book-tone-${index % 4}`, { 'is-active': activeScriptureBook === index }]"
          :aria-expanded="activeScriptureBook === index" tabindex="0" :ref="el => setBookEl('scriptures', index, el)"
          @pointerenter="activateBook('scriptures', index)" @click="activateBook('scriptures', index)"
          @focus="activateBook('scriptures', index)" @blur="resumeBookAutoplay">
          <div class="book-cover">
            <div class="book-seal">{{ book.char }}</div>
            <div class="book-line" />
            <div class="book-label">{{ book.title }}</div>
            <i />
          </div>
          <p class="book-description">{{ book.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 道藏专题：深色背景上的介绍文字和第二组轮播书目。 -->
    <section class="canon-section culture-section">
      <CultureHeading :eyebrow="t('culture.canon.eyebrow')" :title="t('culture.canon.title')"
        :subtitle="t('culture.canon.subtitle')" light />
      <div class="canon-copy culture-container">
        <p v-for="paragraph in tm('culture.canon.paragraphs')" :key="paragraph">{{ paragraph }}</p>
      </div>
      <div class="book-row canon-books culture-container" @pointerenter="pauseBookAutoplay"
        @pointerleave="onBookRowLeave">
        <article v-for="(book, index) in tm('culture.canon.books')" :key="book.title" class="book-entry"
          :class="[`book-tone-${(index + 2) % 4}`, { 'is-active': activeCanonBook === index }]"
          :aria-expanded="activeCanonBook === index" tabindex="0" :ref="el => setBookEl('canon', index, el)"
          @pointerenter="activateBook('canon', index)" @click="activateBook('canon', index)"
          @focus="activateBook('canon', index)" @blur="resumeBookAutoplay">
          <div class="book-cover">
            <div class="book-seal">{{ book.char }}</div>
            <div class="book-line" />
            <div class="book-label">{{ book.title }}</div>
            <i />
          </div>
          <p class="book-description">{{ book.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 道教智慧在养生、处事与生态三个日常领域的应用。 -->
    <section class="daily-section culture-section">
      <CultureHeading :eyebrow="t('culture.daily.eyebrow')" :title="t('culture.daily.title')"
        :subtitle="t('culture.daily.subtitle')" light />
      <div class="daily-grid culture-container">
        <article v-for="(item, index) in tm('culture.daily.items')" :key="item.title" class="daily-card">
          <img :src="dailyImages[index]" alt="" />
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- 重要节日、结尾引文与页面收束文案。 -->
    <section class="festivals-section culture-section">
      <CultureHeading :eyebrow="t('culture.festivals.eyebrow')" :title="t('culture.festivals.title')"
        :subtitle="t('culture.festivals.subtitle')" />
      <div class="festival-grid culture-container">
        <article v-for="(item, index) in tm('culture.festivals.items')" :key="item.title" class="festival-card">
          <div class="festival-date">{{ item.date }}</div>
          <img :src="festivalIcons[index]" alt="" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
      <CultureQuote class="festival-quote" :quote="t('culture.festivals.quote')"
        :source="t('culture.festivals.quoteSource')" />
      <p class="culture-closing"><span v-for="line in tm('culture.festivals.closing')" :key="line">{{ line }}</span></p>
    </section>

    <!-- 复用全站页脚。 -->
    <HomeFooter />

  </main>
</template>

<script setup>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import taichiCloud from '@/assets/culture/design/taichi-cloud.png'
import taichiImage from '@/assets/culture/design/taichi.png'
import dailyWellness from '@/assets/culture/daily-wellness.webp'
import dailyConduct from '@/assets/culture/daily-conduct.webp'
import dailyEcology from '@/assets/culture/daily-ecology.webp'
import festivalLantern from '@/assets/culture/festival-lantern.png'
import festivalLotus from '@/assets/culture/festival-lotus.svg'
import festivalMeditation from '@/assets/culture/festival-meditation.svg'
import festivalPardon from '@/assets/culture/festival-pardon.svg'
import festivalWater from '@/assets/culture/festival-water.svg'
import festivalBook from '@/assets/culture/festival-book.png'

const { t, tm, locale } = useI18n()
// 将导入名映射为模板使用的简短变量名。
const taichi = taichiImage
// 图片数组顺序分别对应语言包中的 daily.items 和 festivals.items。
const dailyImages = [dailyWellness, dailyConduct, dailyEcology]
const festivalIcons = [festivalLantern, festivalLotus, festivalMeditation, festivalPardon, festivalWater, festivalBook]

// 页面级交互状态：国际化布局及两组书目当前展开项。
const isInternational = computed(() => !locale.value.toLowerCase().startsWith('zh'))
const activeScriptureBook = ref(0)
const activeCanonBook = ref(0)

// 两组书目各自维护定时器；数量与对应语言包中的书目条数一致。
const bookTimers = { scriptures: null, canon: null }
const bookCounts = { scriptures: 6, canon: 6 }
const BOOK_AUTOPLAY_DELAY = 3000

// 书目卡片的元素引用，供移动端把展开的卡片滚到可视区域。
const bookEls = { scriptures: [], canon: [] }
function setBookEl(type, index, el) {
  bookEls[type][index] = el
}

// 页面内部使用的统一标题组件，避免为仅此页使用的轻量结构再建文件。
const CultureHeading = defineComponent({
  props: { eyebrow: String, title: String, subtitle: String, light: Boolean },
  setup(props, { attrs }) {
    return () => h('header', { ...attrs, class: ['culture-heading', attrs.class, { 'is-light': props.light }] }, [
      h('p', { class: 'eyebrow' }, props.eyebrow),
      h('h2', props.title),
      h('p', { class: 'subtitle' }, props.subtitle),
    ])
  },
})

// 页面内部使用的经典引文组件，保留父级传入的 class 等属性。
const CultureQuote = defineComponent({
  props: { quote: String, source: String },
  setup(props, { attrs }) {
    return () => h('blockquote', { ...attrs, class: ['culture-quote', attrs.class] }, [h('p', props.quote), h('cite', props.source)])
  },
})

// 顶部导航触发的语言切换入口。
function setLocale(code) { setAppLocale(code) }

// 根据书目分组返回其响应式“当前展开项”。
function getActiveBook(type) {
  return type === 'scriptures' ? activeScriptureBook : activeCanonBook
}

// 清理指定书目分组的定时器，重复调用也保持安全。
function stopBookTimer(type) {
  if (bookTimers[type] !== null) {
    window.clearTimeout(bookTimers[type])
    bookTimers[type] = null
  }
}

// 3 秒后展开下一张卡片，并在回调结束时继续安排下一轮。
function scheduleBookAutoplay(type) {
  stopBookTimer(type)
  bookTimers[type] = window.setTimeout(() => {
    const activeBook = getActiveBook(type)
    activeBook.value = (activeBook.value + 1) % bookCounts[type]
    revealActiveBook(type)
    scheduleBookAutoplay(type)
  }, BOOK_AUTOPLAY_DELAY)
}

// 书列宽度不足时会横向滚动，把当前展开的卡片滚到可视区域中间。
// 桌面端整排无需滚动（scrollWidth 不超过可见宽度）时直接跳过。
async function revealActiveBook(type) {
  await nextTick()
  const el = bookEls[type][getActiveBook(type).value]
  const row = el?.parentElement
  if (!row || row.scrollWidth <= row.clientWidth) return

  const centered = el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2
  row.scrollTo({ left: Math.max(0, centered), behavior: 'smooth' })
}

// 鼠标进入任一书目区域时暂停两组轮播，避免自动状态干扰用户阅读。
function pauseBookAutoplay() {
  stopBookTimer('scriptures')
  stopBookTimer('canon')
}

// 鼠标离开或卡片失焦后，两组书目重新从 3 秒倒计时开始。
function resumeBookAutoplay() {
  scheduleBookAutoplay('scriptures')
  scheduleBookAutoplay('canon')
}

// 触屏抬手时也会派发 pointerleave，若照常恢复轮播，刚点开的卡片 3 秒后就被切走。
// 因此只有鼠标离开才恢复；触屏交由 blur（点到别处）恢复，保证点开的卡片停留可读。
function onBookRowLeave(event) {
  if (event.pointerType === 'mouse') resumeBookAutoplay()
}

// 用户悬停、点按或聚焦时立即展开目标卡片并停止自动轮播。
function activateBook(type, index) {
  pauseBookAutoplay()
  getActiveBook(type).value = index
  revealActiveBook(type)
}

onMounted(() => {
  // 启动两组书目轮播。
  resumeBookAutoplay()
})

onBeforeUnmount(() => {
  // 离开页面时清理定时器，避免后台继续执行。
  pauseBookAutoplay()
})
</script>

<style scoped>
.culture-page {
  overflow-x: clip;
  color: #333;
  background: #fff;
}

.culture-container {
  width: min(1240px, calc(100% - 48px));
  margin-inline: auto;
}

.culture-section {
  position: relative;
  overflow: hidden;
}

.culture-heading {
  position: relative;
  z-index: 2;
  width: min(760px, calc(100% - 40px));
  margin-inline: auto;
  text-align: center;
}

.culture-heading :deep(.eyebrow) {
  margin: 0 0 4px;
  color: #fff;
  font-family: var(--font-dyming-a);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.culture-heading :deep(h2) {
  margin: 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 40px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 2px;
}

.culture-heading :deep(.subtitle) {
  margin: 5px 0 0;
  font-size: 16px;
  line-height: 1.4;
}

.culture-heading.is-light :deep(h2),
.culture-heading.is-light :deep(.subtitle) {
  color: #fff;
}

.culture-intro {
  position: relative;
  isolation: isolate;
  height: 1559px;
  overflow: hidden;
  background: #f9f5ed;
}

.intro-artwork {
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
}

.intro-bamboo {
  position: absolute;
  top: -244px;
  left: calc(50% - 1088px);
  width: 522px;
  height: 998px;
  background: url('@/assets/culture/design/edge-texture.png') center / 100% 100% no-repeat;
  opacity: .2;
}

.intro-sky {
  position: absolute;
  inset: 0 0 auto;
  height: 567px;
  background: linear-gradient(10.837deg, #f9f5ed 58.882%, #fbe2c7 89.933%);
}

.intro-sky::before,
.intro-sky::after {
  position: absolute;
  inset: 0;
  content: '';
  opacity: .5;
  background: url('@/assets/culture/design/hero-cloud-left.png') center bottom / 100% 100% no-repeat;
}

.intro-sky::after {
  background-image: url('@/assets/culture/design/hero-cloud-right.png');
}

.intro-landscape {
  position: absolute;
  inset: 0;
  background: #fff;
  mask: url('@/assets/culture/design/intro-landscape-mask.svg') center / 100% 100% no-repeat;
}

.intro-landscape::before {
  position: absolute;
  inset: 0;
  content: '';
  background: url('@/assets/culture/design/intro-landscape.png') center bottom / 100% 100% no-repeat;
  opacity: .5;
}

.intro-ribbon {
  position: absolute;
  top: -4px;
  left: 0;
  width: 100%;
  height: 732px;
  /* mask: url('@/assets/culture/design/intro-ribbon-mask.svg') center / 100% 100% no-repeat; */
}

.intro-ribbon::before {
  position: absolute;
  top: 54px;
  left: -5%;
  width: 100%;
  height: 873px;
  content: '';
  background: url('@/assets/culture/design/intro-ribbon.png') center bottom / 100% 100% no-repeat;
  opacity: .6;
}

.hero-calligraphy {
  position: absolute;
  top: 195px;
  left: calc(50% - 620px);
  width: 725px;
  height: 136px;
  background: linear-gradient(96.398deg, #c29f79 8.076%, #d5ac77 30.943%, #dab98d 50.601%, #d0a266 71.06%, #b98b50 89.113%);
  mask: url('@/assets/culture/design/calligraphy-mask.png') center / 100% 100% no-repeat;
}

.intro-slogan {
  position: absolute;
  top: 358px;
  left: calc(50% - 552px);
  display: grid;
  color: #171717;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: .9px;
}

.taichi-visual {
  position: absolute;
  top: 111px;
  left: calc(50% + 151.18px);
  width: 446.64px;
  height: 399.32px;
}

.taichi-cloud {
  position: absolute;
  width: 52.569%;
  height: 93.007%;
  object-fit: contain;
  opacity: .3;
}

.taichi-cloud-left {
  left: 0;
  top: 6.994%;
}

.taichi-cloud-right {
  right: 0;
  top: 0;
  transform: rotate(180deg);
}

.taichi {
  position: absolute;
  top: 13.022%;
  left: 16.752%;
  width: 66.049%;
  height: 73.875%;
  object-fit: contain;
  transform: scaleX(-1);
  /* 只让太极图缓慢自转；云气保持静止，避免整组旋转时竖向云纹出现侧倒。 */
  animation: taichi-spin 20s linear infinite;
}

@keyframes taichi-spin {
  from {
    transform: scaleX(-1) rotate(0deg);
  }

  to {
    transform: scaleX(-1) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .taichi {
    animation: none;
  }
}

.intro-heading {
  position: absolute;
  top: 570.58px;
  left: 50%;
  transform: translateX(-50%);
}

.intro-heading :deep(.eyebrow) {
  font-size: 24px;
  font-weight: 400;
}

.intro-heading :deep(h2) {
  margin-top: 12px;
  font-size: 42px;
}

.intro-heading :deep(.subtitle) {
  margin-top: 10px;
}

.intro-quote {
  position: absolute;
  top: 710px;
  left: 50%;
  transform: translateX(-50%);
}

.culture-quote {
  display: grid;
  align-content: center;
  width: min(663px, calc(100% - 36px));
  height: 140px;
  padding: 30px 40px 18px;
  color: #8c6b42;
  text-align: center;
  background: url('@/assets/culture/design/quote-scroll.webp') center / 100% 100% no-repeat;
  border: 0;
}

.culture-quote :deep(p) {
  margin: 0 0 7px;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  line-height: 1.25;
}

.culture-quote :deep(cite) {
  font-size: 16px;
  font-style: normal;
  text-align: right;
}

.intro-panel {
  position: absolute;
  top: 896px;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1240px;
  height: 575px;
  padding: 54px 54px 52px;
  color: #fff;
  background: linear-gradient(180deg, #cc3513, rgba(180, 41, 12, 0)), #d45f45;
  transform: translateX(-50%);
}

.intro-panel::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: url('@/assets/culture/design/panel-texture.png') left top / 512px 512px repeat;
  mix-blend-mode: luminosity;
  mask-image: linear-gradient(transparent, #000);
  opacity: .05;
}

.intro-copy {
  position: relative;
  z-index: 1;
  width: 100%;
}

.intro-copy p {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 28px;
  text-indent: 2em;
  text-align: justify;
  letter-spacing: .8px;
}

.intro-panel .culture-quote {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  margin-top: auto;
  color: #8c6b42;
}

.core-section {
  height: 540px;
  padding-top: 76px;
  background: #fff;
}

.core-section::before {
  position: absolute;
  inset: 0 0 auto;
  height: 302px;
  content: '';
  background: url('@/assets/culture/design/core-cloud.png') center top / 100% 100% no-repeat;
  mix-blend-mode: luminosity;
}

.core-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 42px;
  margin-top: 66px;
}

.core-item {
  text-align: center;
}

.core-emblem {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: center;
  width: 138px;
  height: 138px;
  margin: 0 auto 34px;
  background: url('@/assets/culture/core-emblem.svg') center / contain no-repeat;
}

.core-emblem strong {
  font-family: var(--font-calligraphy);
  font-size: 58px;
  font-weight: 400;
  line-height: .95;
}

.core-emblem span {
  color: #cc3513;
  font-family: var(--font-dyming-a);
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  white-space: pre-line;
}

.core-item p {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  line-height: 1.45;
  letter-spacing: 1px;
}

.scriptures-section {
  height: 700px;
  padding-top: 69px;
  background: linear-gradient(#fff 48.077%, #c29f79 100%);
}

.book-row {
  display: flex;
  gap: 16px;
  margin-top: 67px;
}

.book-entry {
  display: flex;
  flex: 0 0 160px;
  width: 160px;
  min-width: 0;
  overflow: hidden;
  cursor: pointer;
  outline: 0;
  transition: width .52s cubic-bezier(.22, .7, .2, 1), flex-basis .52s cubic-bezier(.22, .7, .2, 1);
}

.book-entry.is-active {
  flex-basis: 336px;
  width: 336px;
}

.book-entry:focus-visible .book-cover {
  outline: 3px solid rgba(204, 53, 19, .3);
  outline-offset: -3px;
}

.book-cover {
  position: relative;
  flex: 0 0 160px;
  height: 400px;
  overflow: hidden;
  background: linear-gradient(135deg, #cc3513, #981c04);
  border: 1px solid #f2d2af;
  border-radius: 12px;
  box-shadow: inset 0 0 0 6px rgba(255, 255, 255, .08), inset 0 0 0 7px #f2d2af;
}

.book-cover::after {
  position: absolute;
  inset: 0;
  content: '';
  background: url('@/assets/culture/design/book-pattern.png') center / cover;
  mix-blend-mode: luminosity;
  opacity: .2;
}

.book-tone-1 .book-cover {
  background: linear-gradient(135deg, #2b59a2, #163464);
}

.book-tone-2 .book-cover {
  background: linear-gradient(135deg, #09786b, #033f38);
}

.book-tone-3 .book-cover {
  background: linear-gradient(135deg, #3a4072, #262c59);
}

.book-seal {
  position: absolute;
  z-index: 1;
  top: 29px;
  left: 50%;
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  color: #111;
  font-family: var(--font-calligraphy);
  font-size: 51px;
  background: #fff;
  border: 2px solid #1c3043;
  border-radius: 45% 45% 48% 48%;
  transform: translateX(-50%);
}

.book-line {
  position: absolute;
  z-index: 1;
  top: 111px;
  bottom: 31px;
  left: 50%;
  width: 1px;
  background: #f2d2af;
}

.book-label {
  position: absolute;
  z-index: 2;
  top: 149px;
  left: 50%;
  display: grid;
  width: 50px;
  min-height: 152px;
  padding: 14px 10px;
  place-items: center;
  color: #111;
  font-family: var(--font-calligraphy);
  font-size: 22px;
  line-height: 1.35;
  text-align: center;
  writing-mode: vertical-rl;
  background: #f2d2af;
  border: 2px solid #d19966;
  border-radius: 25px;
  transform: translateX(-50%);
}

.book-cover i {
  position: absolute;
  z-index: 2;
  bottom: 27px;
  left: 50%;
  width: 9px;
  height: 9px;
  background: currentColor;
  border: 1px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
}

.book-description {
  flex: 0 0 176px;
  height: 386px;
  /* 新版原型文案更长，收紧正文排版以保证展开后能够完整显示。 */
  padding: 32px 18px 18px;
  margin: 7px 0;
  overflow: hidden;
  color: #222;
  font-size: 15px;
  line-height: 1.8;
  text-align: justify;
  background: #fffaf1;
  border: 1px solid #f2d2af;
  border-left: 0;
  border-radius: 0 12px 12px 0;
  opacity: 0;
  transform: translateX(-14px);
  transition: opacity .3s ease, transform .45s cubic-bezier(.22, .7, .2, 1);
}

.book-entry.is-active .book-description {
  opacity: 1;
  transform: translateX(0);
}

.book-entry.is-active .book-cover {
  box-shadow: inset 0 0 0 6px rgba(255, 255, 255, .1), inset 0 0 0 7px #f2d2af, 0 12px 26px rgba(39, 29, 18, .2);
}

.canon-section {
  height: 900px;
  padding-top: 58px;
  color: #fff;
  background: linear-gradient(#c29f79 0 573px, #fff 573px);
}

.canon-section::before {
  position: absolute;
  inset: 271px 0 auto;
  height: 302px;
  content: '';
  background: url('@/assets/culture/design/canon-cloud.png') center / 100% 100% no-repeat;
  mix-blend-mode: luminosity;
  opacity: .5;
  transform: rotate(180deg);
}

.canon-section .culture-heading :deep(h2) {
  font-size: 36px;
}

.canon-copy {
  position: relative;
  z-index: 2;
  margin-top: 52px;
  font-family: var(--font-calligraphy);
}

.canon-copy p {
  margin: 0 0 6px;
  font-size: 16px;
  line-height: 1.75;
  text-align: justify;
  letter-spacing: .5px;
}

.canon-books {
  position: relative;
  z-index: 2;
  margin-top: 52px;
}

.canon-books .book-description {
  color: #222;
}

.daily-section {
  height: 696px;
  padding-top: 73px;
  color: #fff;
  background: radial-gradient(ellipse 83.333% 83.333% at 51.145% 114.511%, rgba(255, 255, 255, .6), transparent), #2b59a2;
}

.daily-section::before {
  position: absolute;
  inset: 0;
  content: '';
  background: url('@/assets/culture/design/daily-pattern.webp') left top / 317.7px 558.02px repeat;
  mix-blend-mode: luminosity;
  opacity: .08;
}

.daily-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 380px);
  justify-content: space-between;
  margin-top: 69px;
}

.daily-card {
  position: relative;
  height: 378px;
  overflow: hidden;
  border-radius: 28px 28px 26px 26px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, .2);
  transition: transform .25s ease, box-shadow .25s ease;
}

.daily-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.daily-card>div {
  position: absolute;
  inset: 50% 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 24px 24px;
  text-align: center;
  background: linear-gradient(transparent, rgba(0, 0, 0, .88));
}

.daily-card h3 {
  margin: 0 0 17px;
  font-family: var(--font-calligraphy);
  font-size: 30px;
  font-weight: 400;
}

.daily-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.35;
  letter-spacing: 1px;
}

.festivals-section {
  height: 1150px;
  padding-top: 76px;
  isolation: isolate;
  background: #fff;
}

.festivals-section::before,
.festivals-section::after {
  position: absolute;
  z-index: -1;
  content: '';
  pointer-events: none;
}

.festivals-section::before {
  top: 0;
  left: -7.18%;
  width: 59.89%;
  height: 441px;
  background: url('@/assets/culture/design/festival-cloud.png') center / 100% 100% no-repeat;
  opacity: .2;
}

.festivals-section::after {
  top: 667.6px;
  left: 35.37%;
  width: 100%;
  height: 1440px;
  background: url('@/assets/culture/design/festival-cloud-bottom.png') center / 100% 100% no-repeat;
  mix-blend-mode: luminosity;
  opacity: .1;
}

.festival-grid {
  display: grid;
  grid-template-columns: repeat(3, 340px);
  gap: 35px 60px;
  justify-content: center;
  margin-top: 63px;
}

.festival-card {
  position: relative;
  height: 250px;
  padding: 25px 28px 18px 50px;
  text-align: center;
  background: #fff;
  border: 1px solid #d9aa75;
  border-radius: 22px 22px 30px 22px;
  box-shadow: inset 0 0 0 1px rgba(242, 210, 175, .2);
  transition: transform .25s ease, box-shadow .25s ease;
}

.festival-card::after {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 30px;
  height: 30px;
  content: '';
  background: #fff;
  border-right: 1px solid #d9aa75;
  border-bottom: 1px solid #d9aa75;
  border-radius: 0 0 25px 0;
}

.festival-date {
  position: absolute;
  top: 18px;
  left: -12px;
  display: grid;
  width: 36px;
  height: 170px;
  padding: 15px 7px;
  place-items: center;
  color: #f2d2af;
  font-size: 17px;
  line-height: 1.25;
  writing-mode: vertical-rl;
  background: #d93614;
  border: 2px solid #f2d2af;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #d93614;
}

.festival-card img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin: 0 auto;
}

.festival-card h3 {
  margin: 5px 0 14px;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  font-weight: 400;
  line-height: 1.15;
  white-space: nowrap;
}

.festival-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: .4px;
  font-family: var(--font-calligraphy);
}

.festival-quote {
  margin: 74px auto 0;
}

.culture-closing {
  display: grid;
  font-family: var(--font-calligraphy);
  gap: 8px;
  margin: 50px auto 0;
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: .8px;
}

@media (hover: hover) and (pointer: fine) {

  .daily-card:hover,
  .festival-card:hover {
    box-shadow: 0 16px 32px rgba(23, 48, 66, .22);
    transform: translateY(-6px);
  }
}

.is-international .hero-calligraphy {
  display: none;
}

.is-international .intro-slogan {
  top: 210px;
  width: 560px;
  font-family: Georgia, serif;
  font-size: 29px;
  line-height: 1.35;
}

.is-international .culture-heading :deep(h2) {
  font-family: Georgia, serif;
  font-size: 36px;
  letter-spacing: 0;
}

.is-international .culture-heading :deep(.subtitle) {
  font-size: 15px;
}

.is-international .canon-copy p {
  font-size: 18px;
  line-height: 1.55;
  letter-spacing: 0;
  text-align: left;
  text-indent: 0;
}

/* 英文首屏正文位于 1240px 宽栏中，原 18px 偏小，单独放大一号提升可读性。 */
.is-international .intro-copy p {
  font-size: 21px;
  line-height: 1.6;
  letter-spacing: 0;
  text-align: left;
  text-indent: 0;
}

.is-international .intro-panel {
  height: auto;
  min-height: 575px;
}

.is-international .intro-panel .culture-quote {
  margin-top: 28px;
}

.is-international .culture-quote :deep(p) {
  font-family: Georgia, serif;
  font-size: 20px;
}

.is-international .core-emblem strong,
.is-international .book-label,
.is-international .daily-card h3,
.is-international .festival-card h3 {
  font-family: Georgia, serif;
}

.is-international .core-item p {
  font-size: 18px;
  letter-spacing: 0;
}

.is-international .book-label {
  font-size: 18px;
  /* 英文同样采用竖排，拉丁字母按词组旋转，效果与原型中的 Blessing 标签一致。 */
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.is-international .book-description {
  font-size: 14px;
  line-height: 1.6;
}

.is-international .canon-copy {
  margin-top: 38px;
}

.is-international .canon-books {
  margin-top: 34px;
}

.is-international .daily-card p {
  font-size: 14px;
  letter-spacing: 0;
}

.is-international .festival-card h3 {
  font-size: 22px;
  white-space: normal;
}

.is-international .festival-card p {
  font-size: 16px;
  line-height: 1.35;
}

@media (max-width: 1439px) {

  .culture-intro,
  .core-section,
  .scriptures-section,
  .canon-section,
  .daily-section,
  .festivals-section {
    height: auto;
    min-height: 0;
  }

  .culture-intro {
    padding: 80px 24px;
  }

  .hero-calligraphy,
  .intro-slogan,
  .taichi-visual,
  .intro-heading,
  .intro-quote,
  .intro-panel {
    position: relative;
    inset: auto;
    left: auto;
    top: auto;
    transform: none;
  }

  .hero-calligraphy {
    display: block;
    width: min(720px, 88%);
    height: auto;
    aspect-ratio: 725 / 136;
    margin: 10px auto 28px;
  }

  .intro-slogan {
    width: min(560px, 100%);
    margin: 0 auto 32px;
    font-size: 17px;
    text-align: center;
  }

  .taichi-visual {
    width: min(420px, 90vw);
    height: auto;
    aspect-ratio: 446.64 / 399.32;
    margin: 0 auto 36px;
  }

  .intro-heading {
    margin-bottom: 32px;
  }

  .intro-quote {
    margin: 0 auto 42px;
  }

  .intro-panel {
    width: min(900px, 100%);
    height: auto;
    margin: 0 auto;
    padding: 42px 35px;
  }

  .intro-panel .culture-quote {
    margin-top: 32px;
  }

  .core-section,
  .scriptures-section,
  .canon-section,
  .daily-section,
  .festivals-section {
    padding: 70px 24px 80px;
  }

  .core-grid {
    grid-template-columns: repeat(3, 210px);
    justify-content: center;
    gap: 48px 55px;
  }

  /* 与 PC 端保持同一套效果：一排书脊，选中的卡片横向展开出简介。
     整排放不下时书列可横向滚动，展开的卡片会自动滚到可视区域。 */
  .book-row {
    position: relative;
    display: flex;
    gap: 16px;
    width: fit-content;
    max-width: 100%;
    margin-inline: auto;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .book-row::-webkit-scrollbar {
    display: none;
  }

  .book-entry {
    flex: 0 0 132px;
    width: 132px;
  }

  .book-entry.is-active {
    flex-basis: 348px;
    width: 348px;
  }

  .book-cover {
    flex: 0 0 132px;
    width: 132px;
  }

  /* 折叠态下由 flex 收成 0 宽，展开后占满封面之外的剩余空间。 */
  .book-description {
    flex: 1 1 0;
    width: auto;
  }

  .canon-copy {
    max-width: 860px;
  }

  .canon-section {
    background: linear-gradient(#c29f79 0 60%, #fff 90%);
  }

  .canon-section::before {
    top: 40%;
  }

  .is-international .intro-slogan {
    top: auto;
    width: min(560px, 100%);
  }

  .daily-grid {
    grid-template-columns: repeat(2, minmax(280px, 380px));
    justify-content: center;
    gap: 28px;
  }

  .festival-grid {
    grid-template-columns: repeat(2, 340px);
  }
}

@media (min-width: 1001px) and (max-width: 1439px) {

  /* 中等桌面宽度仍保留左右首屏构图，只让正文按实际内容增高。 */
  .culture-intro {
    padding-top: 570.58px;
    padding-bottom: 88px;
  }

  .hero-calligraphy {
    position: absolute;
    top: 195px;
    left: 6.944%;
    width: 50.347%;
    margin: 0;
  }

  .intro-slogan {
    position: absolute;
    top: calc(195px + 9.444vw + 27px);
    left: 11.667%;
    width: 40%;
    margin: 0;
    text-align: left;
  }

  .taichi-visual {
    position: absolute;
    top: 111px;
    left: 60.5%;
    width: 31.017%;
    margin: 0;
  }

  .intro-heading {
    margin-bottom: 42px;
  }

  .intro-panel {
    width: calc(100% - 104px);
    min-height: 575px;
    padding: 54px;
  }

  .intro-panel .culture-quote {
    margin-top: 32px;
  }

  .is-international .intro-slogan {
    top: 190px;
    width: 42%;
    font-size: 25px;
  }
}

@media (max-width: 760px) {
  .culture-intro {
    padding: 55px 18px;
  }

  .culture-heading :deep(h2),
  .is-international .culture-heading :deep(h2) {
    font-size: 29px;
  }

  .culture-heading :deep(.eyebrow) {
    font-size: 16px;
  }

  .culture-heading :deep(.subtitle) {
    font-size: 13px;
  }

  .culture-quote {
    height: auto;
    min-height: 110px;
    padding: 18px 10vw 14px;
  }

  .culture-quote :deep(p) {
    font-size: 19px;
  }

  .culture-quote :deep(cite) {
    font-size: 11px;
    text-align: center;
  }

  .intro-panel {
    padding: 32px 20px;
  }

  .intro-landscape {
    mask-image: linear-gradient(transparent 35%, #000 85%);
  }

  .intro-landscape::before {
    background-size: auto 100%;
  }

  .intro-ribbon {
    top: 200px;
    width: 100%;
    left: 0;
  }

  .intro-ribbon::before {
    width: 100%;
    left: 0;
  }

  .is-international .intro-slogan {
    font-size: 24px;
  }

  .is-international .intro-copy p {
    font-size: 17px;
    line-height: 1.7;
  }

  .is-international .culture-quote :deep(p) {
    font-size: 17px;
  }

  .intro-copy p {
    font-size: 13px;
    line-height: 1.65;
    text-align: left;
  }

  .core-grid {
    grid-template-columns: repeat(2, minmax(130px, 210px));
    gap: 42px 18px;
    width: 100%;
  }

  .core-emblem {
    margin-bottom: 20px;
    transform: scale(.9);
  }

  .core-item p {
    font-size: 13px;
  }

  /* 手机端同样是横向展开，只是把书脊收窄到 96px、展开宽度收到 280px。 */
  .book-row {
    gap: 10px;
    margin-top: 40px;
  }

  .book-entry {
    flex: 0 0 96px;
    width: 96px;
  }

  .book-entry.is-active {
    flex-basis: 280px;
    width: 280px;
  }

  .book-cover {
    flex: 0 0 96px;
    width: 96px;
    height: 320px;
  }

  .book-label {
    top: 112px;
    min-height: 118px;
    font-size: 18px;
  }

  .book-description {
    height: 320px;
    margin: 0;
    padding: 18px 14px;
    font-size: 12px;
    line-height: 1.7;
  }

  .book-label {
    top: 140px;
    min-height: 135px;
  }

  .canon-copy p {
    font-size: 13px;
    text-align: left;
  }

  .daily-grid {
    grid-template-columns: minmax(280px, 380px);
    width: 100%;
  }

  .daily-card {
    height: 360px;
  }

  .festival-grid {
    grid-template-columns: minmax(280px, 340px);
    width: 100%;
  }

  .festival-card {
    height: auto;
    min-height: 250px;
  }

  .festival-quote {
    margin-top: 55px;
  }

  .culture-closing {
    margin-top: 36px;
    font-size: 14px;
  }

}
</style>
