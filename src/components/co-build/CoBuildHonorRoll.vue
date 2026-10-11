<template>
  <section class="honor-section">
    <CoBuildSectionHeading :title="t('coBuild.honor.title')" :subtitle="t('coBuild.honor.subtitle')" />

    <!-- 两份相同名录首尾衔接，实现无空白的纵向自动轮播。 -->
    <div class="honor-window" :aria-label="t('coBuild.honor.title')">
      <div class="honor-marquee">
        <div v-for="copyIndex in 2" :key="copyIndex" class="honor-list" :aria-hidden="copyIndex === 2">
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
    </div>

    <p class="honor-blessing">{{ t('coBuild.honor.blessing') }}</p>
    <button class="honor-cta" type="button" @click="goToDonation">{{ t('coBuild.cta') }}</button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'
import anonymousSeal from '@/assets/co-build/donor-seal-anonymous.svg'
import personSeal from '@/assets/co-build/donor-seal-person.svg'

const { t, tm } = useI18n()
const donorSeeds = computed(() => tm('coBuild.honor.donors'))

// 设计稿每批展示 60 位善信；以语言包中的 12 个示例循环组成完整一批。
const donors = computed(() => Array.from({ length: 60 }, (_, index) => donorSeeds.value[index % donorSeeds.value.length]))

function goToDonation() {
  document.getElementById('donation-project')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
.honor-section {
  padding: 0 20px 53px;
  overflow: hidden;
  background: #f3f0e9;
}

.honor-window {
  width: 1440px;
  height: 450px;
  margin: 14px auto 0;
  overflow: hidden;
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
