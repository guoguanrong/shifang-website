<template>
  <div class="bagua" aria-hidden="true">
    <!-- 八卦盘由设计稿的圆环和八个卦象原件分层组合，缩放时不会失真。 -->
    <img class="bagua-bg" :src="baguaBg" alt="" />
    <img class="ring outer" :src="outerRing" alt="" />
    <img class="ring middle" :src="middleRing" alt="" />
    <img class="ring inner" :src="innerRing" alt="" />
    <img v-for="mark in marks" :key="mark.name" class="trigram" :class="mark.name" :src="mark.src" alt="" />
    <span class="center-char">道</span>
    <span v-for="label in labels" :key="label.name" class="bagua-label" :class="label.name">{{ label.text }}</span>
  </div>
</template>

<script setup>
import baguaBg from '@/assets/wellness/bagua-bg.webp'
import innerRing from '@/assets/wellness/bagua-ring-inner.svg'
import middleRing from '@/assets/wellness/bagua-ring-middle.svg'
import outerRing from '@/assets/wellness/bagua-ring-outer.svg'
import dui from '@/assets/wellness/trigram-dui.svg'
import gen from '@/assets/wellness/trigram-gen.svg'
import kan from '@/assets/wellness/trigram-kan.svg'
import kun from '@/assets/wellness/trigram-kun.svg'
import li from '@/assets/wellness/trigram-li.svg'
import qian from '@/assets/wellness/trigram-qian.svg'
import xun from '@/assets/wellness/trigram-xun.svg'
import zhen from '@/assets/wellness/trigram-zhen.svg'

// name 同时是定位类名，数据顺序按八卦方位组织。
const marks = [
  { name: 'qian', src: qian }, { name: 'xun', src: xun }, { name: 'kan', src: kan }, { name: 'gen', src: gen },
  { name: 'kun', src: kun }, { name: 'zhen', src: zhen }, { name: 'li', src: li }, { name: 'dui', src: dui },
]
const labels = [
  { name: 'qian', text: '乾' }, { name: 'xun', text: '巽' }, { name: 'kan', text: '坎' }, { name: 'gen', text: '艮' },
  { name: 'kun', text: '坤' }, { name: 'zhen', text: '震' }, { name: 'li', text: '离' }, { name: 'dui', text: '兑' },
]
</script>

<style scoped>
.bagua {
  position: relative;
  width: 392px;
  height: 412px;
  flex: none;
}

.bagua img,
.bagua span {
  position: absolute;
}

.bagua-bg {
  top: 36px;
  left: 25px;
  width: 340px;
  height: 340px;
}

.outer {
  top: 46px;
  left: 35px;
  width: 320px;
  height: 320px;
}

.middle {
  top: 123px;
  left: 112px;
  width: 166px;
  height: 166px;
}

.inner {
  top: 178px;
  left: 167px;
  width: 56px;
  height: 56px;
}

.trigram {
  width: 19px;
  height: 17px;
}

.trigram.qian {
  top: 56px;
  left: 185px;
}

.trigram.xun {
  top: 98px;
  left: 283px;
  transform: rotate(45deg);
}

.trigram.kan {
  top: 196px;
  left: 329px;
  transform: rotate(90deg);
}

.trigram.gen {
  top: 298px;
  left: 283px;
  transform: rotate(-45deg);
}

.trigram.kun {
  top: 339px;
  left: 185px;
}

.trigram.zhen {
  top: 298px;
  left: 87px;
  transform: rotate(-135deg);
}

.trigram.li {
  top: 197px;
  left: 45px;
  transform: rotate(-90deg);
}

.trigram.dui {
  top: 98px;
  left: 87px;
  transform: rotate(-45deg);
}

.center-char {
  top: 188px;
  left: 179px;
  color: #111;
  font-family: var(--font-calligraphy);
  font-size: 30px;
  line-height: 36px;
}

.bagua-label {
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 36px;
  text-align: center;
}

.bagua-label.qian {
  top: 0;
  left: 185px;
}

.bagua-label.xun {
  top: 52px;
  left: 321px;
}

.bagua-label.kan {
  top: 188px;
  right: 0;
}

.bagua-label.gen {
  top: 323px;
  left: 318px;
}

.bagua-label.kun {
  bottom: 0;
  left: 185px;
}

.bagua-label.zhen {
  top: 323px;
  left: 53px;
}

.bagua-label.li {
  top: 188px;
  left: 0;
}

.bagua-label.dui {
  top: 51px;
  left: 57px;
}

@media (max-width: 520px) {
  .bagua {
    transform: scale(.78);
    transform-origin: top center;
    margin-bottom: -91px;
  }
}
</style>
