<template>
  <section class="process-section">
    <CoBuildSectionHeading :title="t('coBuild.process.title')" />

    <div class="process-stage">
      <!-- 三步流程之间的曲线直接使用 Figma 导出的矢量。 -->
      <img class="process-wave" :src="processWave" alt="" aria-hidden="true" />
      <div class="process-grid">
        <article v-for="(item, index) in steps" :key="item.title">
          <figure>
            <img class="process-frame" :src="processFrames[index]" alt="" aria-hidden="true" />
            <img class="process-photo" :src="processPhotos[index]" :alt="item.title" />
          </figure>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </div>

    <aside class="trust-banner">
      <h3>{{ t('coBuild.process.trustTitle') }}</h3>
      <p>{{ t('coBuild.process.trustText') }}</p>
    </aside>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'
import processWave from '@/assets/co-build/process-wave.svg'
import processFrame1 from '@/assets/co-build/process-frame-1.svg'
import processFrame2 from '@/assets/co-build/process-frame-2.svg'
import processFrame3 from '@/assets/co-build/process-frame-3.svg'
import process1 from '@/assets/co-build/process-1.png'
import process2 from '@/assets/co-build/process-2.png'
import process3 from '@/assets/co-build/process-3.png'

const { t, tm } = useI18n()
const steps = computed(() => tm('coBuild.process.steps'))
const processFrames = [processFrame1, processFrame2, processFrame3]
const processPhotos = [process1, process2, process3]
</script>

<style scoped>
.process-section {
  padding: 0 0 80px;
  overflow: hidden;
  background: #f8f5ed;
}

.process-stage {
  position: relative;
  height: 396px;
  margin-top: 2px;
}

.process-wave {
  position: absolute;
  top: 0;
  left: 50%;
  width: max(100%, 1442px);
  height: 54px;
  transform: translateX(-50%);
}

.process-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 440.67px);
  gap: 59px;
  justify-content: center;
  width: 1440px;
  margin: 84px auto 0;
}

.process-grid article {
  text-align: center;
}

.process-grid figure {
  position: relative;
  width: 168px;
  height: 160px;
  margin: 0 auto;
}

.process-frame {
  position: absolute;
  top: 0;
  left: 4px;
  width: 160px;
  height: 160px;
}

.process-photo {
  position: absolute;
  top: 5px;
  left: 9px;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  transition: transform .3s ease;
}

.process-grid article:hover .process-photo {
  transform: scale(1.035);
}

.process-grid h3 {
  margin: 22px 0 14px;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  font-weight: 400;
  line-height: 34px;
}

.process-grid p {
  width: 440.67px;
  min-height: 80px;
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

.trust-banner {
  display: grid;
  width: 1440px;
  height: 120px;
  margin: -1px auto 0;
  place-content: center;
  color: #333;
  text-align: center;
  background: linear-gradient(90deg, rgba(255, 255, 255, .2), #fff 20%, #fff 80%, rgba(255, 255, 255, .2));
  border-radius: 20px;
}

.trust-banner h3 {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 38px;
  font-weight: 400;
  line-height: 46px;
  color: #CAAB89;
}

.trust-banner p {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 18px;
}

:global(html[data-locale-layout='international'] .process-grid h3),
:global(html[data-locale-layout='international'] .trust-banner h3) {
  font-family: Georgia, serif;
}

:global(html[data-locale-layout='international'] .process-grid h3) {
  font-size: 22px;
}

:global(html[data-locale-layout='international'] .process-grid p) {
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .trust-banner h3) {
  font-size: 30px;
}

@media (max-width: 1439px) {
  .process-section {
    padding-inline: 24px;
  }

  .process-stage {
    height: auto;
  }

  .process-wave {
    display: none;
  }

  .process-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
    width: min(100%, 1000px);
    margin-top: 18px;
  }

  .process-grid p {
    width: 100%;
  }

  .trust-banner {
    width: min(100%, 1000px);
    height: auto;
    min-height: 120px;
    margin-top: 40px;
    padding: 24px;
  }
}

@media (max-width: 760px) {
  .process-section {
    padding: 0 15px 58px;
  }

  .process-grid {
    grid-template-columns: 1fr;
    width: min(100%, 440px);
    gap: 34px;
  }

  .process-grid p {
    max-width: 380px;
    min-height: 0;
    margin-inline: auto;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: .4px;
  }

  .trust-banner h3 {
    font-size: 25px;
    line-height: 33px;
  }

  .trust-banner p {
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
