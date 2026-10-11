<template>
  <!-- 云监工摄像头：六路画面，图片按顺序与语言包条目一一对应。 -->
  <section class="camera-section">
    <header class="camera-heading">
      <p>{{ t('cloudBuild.cameras.eyebrow') }}</p>
      <h2>{{ t('cloudBuild.cameras.title') }}</h2>
      <span>{{ t('cloudBuild.cameras.subtitle') }}</span>
    </header>

    <div class="camera-grid">
      <article v-for="(camera, index) in cameras" :key="camera.title" class="camera-card">
        <div class="camera-image">
          <img :class="`camera-photo camera-photo-${index + 1}`" :src="cameraImages[index]" :alt="camera.title" />
          <!-- LIVE 角标仅为静态示意，尚未接入实时视频流。 -->
          <span class="live-badge"><img :src="liveDot" alt="" aria-hidden="true" />LIVE</span>
        </div>
        <h3>{{ camera.title }}</h3>
      </article>
    </div>

    <p class="camera-note">{{ t('cloudBuild.cameras.note') }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import camera1 from '@/assets/cloud-build/camera-1.webp'
import camera2 from '@/assets/cloud-build/camera-2.webp'
import camera3 from '@/assets/cloud-build/camera-3.webp'
import camera4 from '@/assets/cloud-build/camera-4.webp'
import camera5 from '@/assets/cloud-build/camera-5.webp'
import camera6 from '@/assets/cloud-build/camera-6.webp'
import liveDot from '@/assets/cloud-build/live-dot.svg'

const { t, tm } = useI18n()
const cameras = computed(() => tm('cloudBuild.cameras.items'))
// 六路机位画面，顺序与语言包 items 保持一致。
const cameraImages = [camera1, camera2, camera3, camera4, camera5, camera6]
</script>

<style scoped>
.camera-section {
  position: relative;
  height: 849px;
  padding-top: 1px;
  overflow: hidden;
  background: #f3f0e9;
}

.camera-heading {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 512px;
  text-align: center;
  transform: translateX(-50%);
}

.camera-heading :is(p, h2, span) {
  display: block;
  margin: 0;
}

.camera-heading p {
  color: #d0a06d;
  font-family: var(--font-dyming-a);
  font-size: 24px;
  line-height: 22px;
}

.camera-heading h2 {
  margin-top: 12px;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 38px;
}

.camera-heading span {
  margin-top: 14px;
  color: #333;
  font-size: 16px;
  line-height: 15px;
}

/* 三列固定宽度卡片，整体绝对定位并在视口中居中。 */
.camera-grid {
  position: absolute;
  top: 224px;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(3, 380px);
  gap: 30px 51px;
  width: 1240px;
  transform: translateX(-50%);
}

.camera-card {
  height: 240px;
  overflow: hidden;
  background: linear-gradient(-38.08deg, #f3eae0 6.538%, #fff 35.173%);
  border-radius: 12px;
  transition: box-shadow .25s ease, transform .25s ease;
}

.camera-image {
  position: relative;
  width: 380px;
  height: 180px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.camera-photo {
  position: absolute;
  display: block;
  max-width: none;
}

.camera-photo-1,
.camera-photo-3,
.camera-photo-4 {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 各机位画面比例不同，逐张微调裁切与位移。 */
.camera-photo-2 {
  top: -113.2px;
  left: 0;
  width: 380px;
  height: 474.8px;
}

.camera-photo-5 {
  top: -191.8px;
  left: 0;
  width: 380px;
  height: 380px;
}

.camera-photo-6 {
  top: -21.3px;
  left: -62px;
  width: 442px;
  height: 294.7px;
}

.live-badge {
  position: absolute;
  top: 7px;
  left: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  width: 50px;
  height: 20px;
  padding-left: 6px;
  color: #fff;
  font-family: Inter, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 1.2px;
  background: rgba(0, 0, 0, .4);
  border-radius: 100px;
}

.live-badge img {
  width: 6px;
  height: 6px;
}

.camera-card h3 {
  margin: 0;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
  line-height: 60px;
  text-align: center;
  letter-spacing: 1.8px;
}

.camera-note {
  position: absolute;
  top: 759px;
  left: 50%;
  width: 600px;
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  letter-spacing: .8px;
  transform: translateX(-50%);
}

@media (hover: hover) and (pointer: fine) {
  .camera-card:hover {
    box-shadow: 0 12px 28px rgba(52, 42, 30, .14);
    transform: translateY(-5px);
  }
}

:global(html[data-locale-layout='international'] .camera-section .camera-heading h2),
:global(html[data-locale-layout='international'] .camera-section .camera-card h3) {
  font-family: Georgia, serif;
}

:global(html[data-locale-layout='international'] .camera-section .camera-heading h2) {
  font-size: 36px;
}

:global(html[data-locale-layout='international'] .camera-section .camera-card h3) {
  padding-inline: 8px;
  font-size: 14px;
  line-height: 20px;
}

:global(html[data-locale-layout='international'] .camera-section .camera-card) {
  display: grid;
  grid-template-rows: 180px 60px;
}

:global(html[data-locale-layout='international'] .camera-section .camera-card h3) {
  display: grid;
  place-items: center;
}

/* 窄屏放弃绝对定位，改回常规文档流，避免内容溢出。 */
@media (max-width: 1280px) {
  .camera-section {
    height: auto;
    min-height: 1040px;
    padding: 80px 24px 76px;
  }

  .camera-heading,
  .camera-grid,
  .camera-note {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
  }

  .camera-heading {
    width: min(100%, 600px);
    margin: 0 auto;
  }

  .camera-grid {
    grid-template-columns: repeat(2, 380px);
    width: 811px;
    margin: 70px auto 0;
  }

  .camera-note {
    width: min(100%, 600px);
    margin: 48px auto 0;
  }
}

@media (max-width: 850px) {
  .camera-section {
    min-height: 0;
    padding: 66px 16px 72px;
  }

  .camera-grid {
    grid-template-columns: minmax(0, 380px);
    justify-content: center;
    width: 100%;
    gap: 24px;
    margin-top: 58px;
  }
}

@media (max-width: 430px) {
  .camera-heading p {
    font-size: 18px;
  }

  .camera-heading h2 {
    margin-top: 8px;
    font-size: 34px;
  }

  .camera-heading span {
    margin-top: 12px;
    padding-inline: 14px;
    font-size: 14px;
    line-height: 20px;
  }

  .camera-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .camera-card {
    width: 100%;
    height: auto;
    aspect-ratio: 380 / 240;
  }

  .camera-image {
    width: 100%;
    height: auto;
    aspect-ratio: 380 / 180;
  }

  .camera-photo-2 {
    top: -62.9%;
    width: 100%;
    height: 263.8%;
  }

  .camera-photo-5 {
    top: -106.6%;
    width: 100%;
    height: 211.1%;
  }

  .camera-photo-6 {
    top: -11.84%;
    left: -16.32%;
    width: 116.32%;
    height: 163.7%;
  }

  .camera-card h3 {
    line-height: clamp(48px, 15.8vw, 60px);
  }

  .camera-note {
    margin-top: 38px;
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
