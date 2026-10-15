<template>
  <figure class="deity-hierarchy" aria-labelledby="hierarchy-title">
    <figcaption id="hierarchy-title">{{ hierarchy.title }}</figcaption>
    <div class="hierarchy-root hierarchy-sanqing">{{ hierarchy.sanqing }}</div>
    <div class="hierarchy-connection"><span>{{ hierarchy.connection }}</span></div>
    <div class="hierarchy-root hierarchy-doumu">{{ hierarchy.doumu }}</div>

    <!-- 桌面保持树状连线；窄屏将两个关系分组纵向排列，文字不随画布缩小。 -->
    <div class="hierarchy-branches">
      <section v-for="(group, index) in hierarchy.groups" :key="index" class="hierarchy-group"
        :class="{ 'is-offspring': index === 1 }">
        <h3>{{ group.title }}</h3>
        <ul class="hierarchy-nodes">
          <li v-for="(node, nodeIndex) in group.nodes" :key="nodeIndex" class="hierarchy-node">
            <h4>{{ node.title }}</h4>
            <p>{{ node.description }}</p>
          </li>
        </ul>
      </section>
    </div>
  </figure>
</template>

<script setup>
defineProps({ hierarchy: { type: Object, required: true } })
</script>

<style scoped>
.deity-hierarchy {
  margin: 30px 0 0;
  padding: 40px 30px 60px;
  background: #f8f5ed;
  border-radius: 20px;
}

.deity-hierarchy figcaption {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  font-size: 28px;
  line-height: 1.4;
  text-align: center;
}

.deity-hierarchy figcaption::before,
.deity-hierarchy figcaption::after {
  width: 90px;
  height: 1px;
  content: '';
  background: linear-gradient(90deg, transparent, #c29f79);
}

.deity-hierarchy figcaption::after {
  transform: rotate(180deg);
}

.hierarchy-root {
  display: grid;
  place-items: center;
  min-height: 120px;
  padding: 26px 40px;
  color: #fff;
  font-size: clamp(22px, 2vw, 32px);
  line-height: 1.5;
  text-align: center;
  background-position: center;
  background-size: calc(100% - 12px) calc(100% - 12px), 100% 100%;
  background-repeat: no-repeat;
}

.hierarchy-sanqing {
  background-image: url('@/assets/deities/detail/hierarchy-sanqing-fill.png'), url('@/assets/deities/detail/hierarchy-sanqing-frame.png');
}

.hierarchy-doumu {
  background-image: url('@/assets/deities/detail/hierarchy-doumu-fill.png'), url('@/assets/deities/detail/hierarchy-doumu-frame.png');
}

.hierarchy-connection {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hierarchy-connection::before,
.hierarchy-connection::after {
  width: 1px;
  height: 40px;
  content: '';
  background: #c29f79;
}

.hierarchy-connection span,
.hierarchy-group h3 {
  padding: 12px 20px;
  background: url('@/assets/deities/card-tag.svg') center / 100% 100% no-repeat;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
}

.hierarchy-branches {
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 10px;
  padding-top: 80px;
  position: relative;
}

.hierarchy-branches::before {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 40px;
  content: '';
  background: #c29f79;
}

.hierarchy-branches::after {
  position: absolute;
  top: 40px;
  left: 35%;
  right: 15%;
  height: 40px;
  content: '';
  border: 1px solid #c29f79;
  border-bottom: 0;
}

.hierarchy-group {
  min-width: 0;
}

.hierarchy-group h3 {
  width: fit-content;
  max-width: 100%;
  min-width: 180px;
  min-height: 50px;
  margin: 0 auto 90px;
  position: relative;
}

.hierarchy-group h3::after {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 1px;
  height: 40px;
  content: '';
  background: #c29f79;
}

.hierarchy-nodes {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.is-offspring .hierarchy-nodes {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hierarchy-node {
  position: relative;
  min-height: 180px;
  padding: 26px 12px 22px;
  color: #fff;
  text-align: center;
  background: url('@/assets/deities/detail/hierarchy-stars-fill.png') center / calc(100% - 6px) calc(100% - 6px) no-repeat, url('@/assets/deities/detail/hierarchy-stars-frame.png') center / 100% 100% no-repeat;
}

.is-offspring .hierarchy-node {
  background-image: url('@/assets/deities/detail/hierarchy-children-fill.png'), url('@/assets/deities/detail/hierarchy-children-frame.png');
}

.hierarchy-node::before {
  position: absolute;
  bottom: 100%;
  left: 50%;
  height: 50px;
  width: 1px;
  content: '';
  background: #c29f79;
}

.hierarchy-node::after {
  position: absolute;
  top: -50px;
  left: 0;
  width: calc(100% + 10px);
  height: 1px;
  content: '';
  background: #c29f79;
}

.hierarchy-node:first-child::after {
  left: 50%;
  width: calc(50% + 10px);
}

.hierarchy-node:last-child::after {
  width: 50%;
}

.hierarchy-node h4 {
  display: grid;
  align-items: end;
  position: relative;
  min-height: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c29f79;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
}

.hierarchy-node h4::after {
  position: absolute;
  bottom: -4px;
  left: calc(50% - 3px);
  width: 6px;
  height: 6px;
  content: '';
  background: #fff;
  border: 1px solid #c29f79;
  transform: rotate(45deg);
}

.hierarchy-node p {
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.45;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

@media (max-width: 1200px) {
  .hierarchy-branches {
    grid-template-columns: 1fr;
    gap: 36px;
    padding-top: 40px;
  }

  .hierarchy-branches::after {
    display: none;
  }

  .hierarchy-group h3 {
    margin-bottom: 60px;
  }

  .hierarchy-group h3::after {
    height: 20px;
  }

  .hierarchy-node::before {
    height: 40px;
  }

  .hierarchy-node::after {
    top: -40px;
  }

  .is-offspring .hierarchy-nodes {
    max-width: 600px;
    margin-inline: auto;
  }
}

@media (max-width: 760px) {
  .deity-hierarchy {
    padding: 24px 14px 30px;
  }

  .deity-hierarchy figcaption {
    margin-bottom: 24px;
    font-size: 21px;
  }

  .deity-hierarchy figcaption::before,
  .deity-hierarchy figcaption::after {
    display: none;
  }

  .hierarchy-root {
    min-height: 110px;
    padding: 22px;
    font-size: 20px;
  }

  .hierarchy-connection span {
    max-width: 90%;
    font-size: 14px;
  }

  .hierarchy-connection::before,
  .hierarchy-connection::after {
    height: 24px;
  }

  .hierarchy-nodes,
  .is-offspring .hierarchy-nodes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .hierarchy-group h3 {
    margin-bottom: 24px;
  }

  .hierarchy-group h3::after,
  .hierarchy-node::before,
  .hierarchy-node::after {
    display: none;
  }

  .hierarchy-node {
    padding: 26px 14px;
  }
}

:global(html[data-locale-layout='international'] .hierarchy-node h4) {
  min-height: 68px;
  font-family: var(--font-ui-international);
  font-size: 14px;
}

:global(html[data-locale-layout='international'] .hierarchy-node p) {
  font-family: var(--font-ui-international);
  font-size: 12px;
}
</style>
