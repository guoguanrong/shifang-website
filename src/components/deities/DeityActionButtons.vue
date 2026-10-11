<template>
  <!-- 神明卡片操作区：点灯（暂为占位）与前往供奉。 -->
  <div class="deity-actions" :class="{ 'is-large': large }">
    <button class="primary" type="button">{{ t('deities.actions.light') }}</button>
    <!-- 供奉按钮带上神明 id 跳转，供奉页据此回显对应神明；.stop 避免触发卡片自身的点击。 -->
    <button class="secondary" type="button" @click.stop="router.push({ name: 'deity-offering', query: { deity: deityId } })">{{ t('deities.actions.offer') }}</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// large 用于详情页放大版样式；deityId 会随供奉按钮一起传给供奉页。
defineProps({ large: Boolean, deityId: { type: String, default: 'doumu' } })
const router = useRouter()
const { t } = useI18n()
</script>

<style scoped>
/* 两枚等宽按钮；is-large 时整体放大并加宽。 */
.deity-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 157.5px));
  gap: 33.5px;
}

.deity-actions button {
  position: relative;
  height: 40px;
  padding: 0 16px 4px;
  color: #fff;
  font: inherit;
  font-size: 16px;
  line-height: 36px;
  white-space: nowrap;
  border: 0;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px #f2b15f, 0 5px 8px rgba(52, 28, 15, .2);
  cursor: pointer;
  transition: filter .2s ease, transform .2s ease, box-shadow .2s ease;
}

.deity-actions button::before,
.deity-actions button::after {
  position: absolute;
  top: 50%;
  width: 5px;
  height: 5px;
  content: '';
  border: 1px solid #f6cc8e;
  transform: translateY(-50%) rotate(45deg);
}

.deity-actions button::before {
  left: 4px;
}

.deity-actions button::after {
  right: 4px;
}

.deity-actions .primary {
  background: linear-gradient(180deg, #e33310, #c82308);
}

.deity-actions .secondary {
  background: linear-gradient(180deg, #245ba3, #17488c);
}

.deity-actions button:hover,
.deity-actions button:focus-visible {
  filter: brightness(1.09);
  box-shadow: inset 0 0 0 1px #f6d09a, 0 8px 14px rgba(52, 28, 15, .25);
  transform: translateY(-2px);
}

.deity-actions button:focus-visible {
  outline: 2px solid #c7955f;
  outline-offset: 2px;
}

.deity-actions.is-large {
  grid-template-columns: repeat(2, 245px);
  gap: 24px;
}

.deity-actions.is-large button {
  height: 56px;
  padding-bottom: 4px;
  font-size: 24px;
  line-height: 52px;
}

@media (max-width: 680px) {
  .deity-actions.is-large {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .deity-actions.is-large button {
    width: 100%;
    height: 46px;
    font-size: 18px;
    line-height: 42px;
  }
}

:global(html[data-locale-layout='international'] .deity-actions button) {
  font-family: var(--font-ui-international);
  font-size: 13px;
}

:global(html[data-locale-layout='international'] .deity-actions.is-large button) {
  font-size: 16px;
}
</style>
