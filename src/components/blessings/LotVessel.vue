<template>
  <div class="lot-vessel" :class="{ 'is-drawing': drawing }" aria-hidden="true">
    <div class="lot-vessel-canvas">
      <img class="lot-halo" :src="art('lot-halo.png')" alt="" />
      <img v-for="(ring, index) in ['ring-a', 'ring-b', 'ring-c']" :key="ring" :class="`lot-ring ring-${index}`"
        :src="art(`${ring}.svg`)" alt="" />
      <img v-for="side in ['left', 'right']" :key="side" class="lot-dot" :class="side" :src="art('ring-dot.svg')"
        alt="" />
      <img v-for="side in ['left', 'right']" :key="`small-${side}`" class="lot-small-dot" :class="side"
        :src="art('ring-small-dot.svg')" alt="" />
      <div class="lot-vessel-body" @animationend.self="$emit('draw-end')">
        <img class="lot-back" :src="art('lot-back.png')" alt="" />
        <div v-for="stick in sticks" :key="stick.name" class="lot-stick-box" :style="stick.box"
          :class="{ 'is-selected': !drawing && selectedStick === stick.name }"
          @animationend.self="finishReveal(stick.name, $event)">
          <img :src="art(`stick-${stick.name}.png`)" :style="stick.leaf" alt="" />
        </div>
        <img class="lot-front" :src="art('lot-front.png')" alt="" />
        <span class="lot-vessel-label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  drawing: { type: Boolean, default: false },
  selectedStick: { type: String, default: null, validator: value => value === null || ['a', 'b', 'c', 'd', 'e', 'f'].includes(value) },
})
const emit = defineEmits(['draw-end', 'reveal-end'])
function finishReveal(name, event) {
  // A final rattle event can arrive after shaking has ended; only the rise completes the draw.
  if (event.animationName.startsWith('stick-rise') && !props.drawing && props.selectedStick === name) emit('reveal-end')
}
const assets = import.meta.glob('/src/assets/blessing-tests/{lot-*,ring-*,stick-*}', { eager: true, query: '?url', import: 'default' })
const art = name => assets[`/src/assets/blessing-tests/${name}`]
// Coordinates are relative to the 562 × 554 Figma illustration, keeping each rotated leaf separate.
// 六支签按扇形从左到右排列，最后一支（上上）在最右侧、最后绘制，避免被其他签遮住。
const sticks = [
  ['a', 269, 60, 49.609, 256, 49.609, 256, 0],
  ['c', 270.72, 66.73, 126.284, 262.687, 50.307, 259.605, 17.56],
  ['d', 207.51, 60.74, 101.682, 264.416, 50.307, 259.605, -11.65],
  ['e', 163, 66.45, 147.172, 262.968, 51.025, 263.31, -22.31],
  ['f', 277.91, 60.74, 91.467, 264.319, 50.307, 259.605, 9.27],
  ['b', 275.61, 60.74, 153.7, 261.29, 51.025, 263.31, 24],
].map(([name, left, top, width, height, leafWidth, leafHeight, angle]) => ({
  name,
  box: { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`, '--draw-x': `${284 - left - width / 2}px` },
  leaf: { width: `${leafWidth}px`, height: `${leafHeight}px`, '--stick-angle': `${angle}deg` },
}))
</script>

<style scoped>
.lot-vessel {
  container-type: inline-size;
  width: min(100%, 562px);
  aspect-ratio: 562 / 554;
  margin: 90px auto -22px;
}

.lot-vessel-canvas {
  position: relative;
  width: 562px;
  height: 554px;
  transform: scale(calc(100cqw / 562px));
  transform-origin: top left;
}

.lot-vessel-canvas>img,
.lot-vessel-body>img {
  position: absolute;
}

.lot-vessel-body {
  position: absolute;
  inset: 0;
  transform-origin: 284px 490px;
}

.lot-halo {
  inset: 0;
  width: 562px;
  height: 554px;
  mix-blend-mode: multiply;
  opacity: .5;
}

.ring-0 {
  left: 83px;
  top: 78px;
  width: 400px;
  height: 400px;
}

.ring-1 {
  left: 77px;
  top: 72px;
  width: 412px;
  height: 412px;
}

.ring-2 {
  left: 70.5px;
  top: 65.5px;
  width: 425px;
  height: 425px;
}

.lot-dot {
  width: 9px;
  height: 9px;
  top: 273px;
}

.lot-dot.left {
  left: 73px;
}

.lot-dot.right {
  left: 484px;
}

.lot-small-dot {
  width: 3px;
  height: 3px;
}

.lot-small-dot.left {
  left: 76px;
  top: 285px;
}

.lot-small-dot.right {
  left: 487px;
  top: 267px;
}

.lot-back {
  left: 212px;
  top: 182px;
  width: 145px;
  height: 35px;
}

.lot-stick-box {
  position: absolute;
  display: grid;
  place-items: center;
}

.lot-stick-box img {
  max-width: none;
  object-fit: contain;
  transform: rotate(var(--stick-angle));
}

.lot-stick-box.is-selected {
  z-index: 1;
  animation: stick-rise .9s cubic-bezier(.22, .68, .22, 1) forwards;
}

.lot-stick-box.is-selected img {
  animation: stick-straighten .9s ease-out forwards;
}

.lot-front {
  z-index: 2;
  left: 200px;
  top: 196px;
  width: 167.78px;
  height: 301px;
}

.lot-vessel-label {
  position: absolute;
  z-index: 3;
  top: 270px;
  left: 264px;
  display: grid;
  place-items: center;
  width: 42px;
  height: 80px;
  padding: 5px 10px;
  border-radius: 25px;
  color: #f8d7a4;
  background: #bb351f;
  font-size: 24px;
  line-height: 1.05;
  word-break: break-all;
}

/* Animate inside the scaled canvas so mobile sizing and the original stick angles stay intact. */
.is-drawing .lot-vessel-body {
  animation: vessel-shake 1.6s ease-in-out;
}

.is-drawing .lot-stick-box {
  animation: stick-rattle .2s ease-in-out 8;
  transform-origin: center bottom;
}

.is-drawing .lot-stick-box:nth-of-type(even) {
  animation-direction: reverse;
}

.is-drawing .lot-halo {
  animation: halo-glow 1.6s ease-in-out;
}

.is-drawing .ring-1 {
  animation: ring-turn 1.6s ease-in-out;
}

@keyframes vessel-shake {

  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }

  12%,
  36%,
  60% {
    transform: translate(-7px, -5px) rotate(-7deg);
  }

  24%,
  48%,
  72% {
    transform: translate(7px, -10px) rotate(7deg);
  }

  84% {
    transform: translate(-3px, -3px) rotate(-3deg);
  }

  94% {
    transform: translate(2px, 0) rotate(2deg);
  }
}

@keyframes stick-rattle {

  0%,
  100% {
    transform: translateY(0) rotate(0);
  }

  35% {
    transform: translateY(-13px) rotate(-2deg);
  }

  70% {
    transform: translateY(-5px) rotate(2deg);
  }
}

@keyframes halo-glow {

  0%,
  100% {
    opacity: .5;
    transform: scale(1);
  }

  50% {
    opacity: .85;
    transform: scale(1.035);
  }
}

@keyframes ring-turn {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(180deg);
  }
}

@keyframes stick-rise {
  0% {
    transform: translate(0, 0);
  }

  35% {
    transform: translate(0, -45px);
  }

  82% {
    transform: translate(var(--draw-x), -145px);
  }

  100% {
    transform: translate(var(--draw-x), -135px);
  }
}

@keyframes stick-straighten {
  from {
    transform: rotate(var(--stick-angle));
  }

  to {
    transform: rotate(0);
  }
}

@media (prefers-reduced-motion: reduce) {

  .lot-stick-box.is-selected,
  .lot-stick-box.is-selected img {
    animation-duration: .01ms;
  }

  .is-drawing .lot-vessel-body {
    animation: vessel-shake .01ms;
  }

  .is-drawing .lot-stick-box,
  .is-drawing .lot-halo,
  .is-drawing .ring-1 {
    animation: none;
  }
}

:global(html[data-locale-layout='international'] .lot-vessel-label) {
  left: 235px;
  top: 286px;
  width: 100px;
  height: 46px;
  padding: 5px;
  font-size: 17px;
  word-break: normal;
}
</style>
