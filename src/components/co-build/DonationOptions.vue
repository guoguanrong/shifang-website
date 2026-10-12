<template>
  <!-- 捐赠选项：善款模式选择金额（含自填），实物模式选择物品与数量。 -->
  <section class="donation-options">
    <OrnateSectionHeading :art="headingArt" :title="t(`donation.${mode === 'goods' ? 'chooseGoods' : 'chooseAmount'}`)" />
    <p v-if="mode === 'goods'" class="donation-goods-note">{{ t('donation.goodsNote') }}</p>
    <!-- 快捷金额：点击后清空自填金额，保证两种输入互斥。 -->
    <div v-if="mode === 'money'" class="donation-amounts" role="group" :aria-label="t('donation.chooseAmount')">
      <button v-for="(value, index) in amounts" :key="value" type="button" class="donation-choice"
        :class="{ selected: !customAmount && amount === value }" :aria-pressed="!customAmount && amount === value"
        @click="emit('update:amount', value); emit('update:customAmount', '')">
        <strong>$ {{ value }}</strong><span>{{ t(`donation.amountLabels.${index}`) }}</span>
      </button>
    </div>
    <!-- 实物卡片：选中项由父级的 itemIndex 控制。 -->
    <div v-else class="donation-goods" role="group" :aria-label="t('donation.chooseGoods')">
      <button v-for="(item, index) in goods" :key="item.id" type="button" class="donation-choice donation-goods-card"
        :class="{ selected: itemIndex === index }" :aria-pressed="itemIndex === index"
        @click="emit('update:itemIndex', index)">
        <span class="donation-item-art">
          <img v-if="item.picture || item.image" :src="item.picture || item.image" alt="" aria-hidden="true" />
          <span v-else aria-hidden="true">{{ String(item.name || '').slice(0, 1) }}</span>
        </span>
        <span class="donation-item-title">{{ item.name }}</span>
        <span>{{ item.useType || item.unit }}</span><strong>$ {{ item.price }} <small>{{ item.unit }}</small></strong>
      </button>
    </div>
    <p v-if="mode === 'goods' && !goods.length" class="donation-error" role="status">{{ t('donation.noGoods') }}</p>
    <div v-if="mode === 'money'" class="donation-option-input">
      <label for="donation-custom">{{ t('donation.custom') }}</label>
      <div class="donation-field"><span aria-hidden="true">$</span>
        <input id="donation-custom" :value="customAmount" type="number" min="50" max="999999999" step="0.01" inputmode="decimal"
          :placeholder="t('donation.customPlaceholder')" :aria-invalid="invalidAmount" :aria-describedby="invalidAmount ? 'donation-amount-error' : undefined"
          @input="emit('update:customAmount', $event.target.value)" />
      </div>
    </div>
    <div v-else class="donation-option-input">
      <label for="donation-quantity">{{ t('donation.quantity') }}</label>
      <select id="donation-quantity" :value="quantity" @change="emit('update:quantity', Number($event.target.value))">
        <option v-for="value in [1, 2, 5, 10, 20, 50, 100]" :key="value" :value="value">{{ t('donation.quantityValue', { count: value }) }}</option>
      </select>
    </div>
    <p v-if="mode === 'money' && invalidAmount" id="donation-amount-error" class="donation-error" role="status">{{ t('donation.amountError') }}</p>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import headingArt from '@/assets/donation/heading.svg'

// 本组件不持有状态，所有选择都通过 update:* 事件回写给父级。
defineProps({ mode: String, amount: Number, customAmount: String, itemIndex: Number, quantity: Number, invalidAmount: Boolean, goods: Array })
const emit = defineEmits(['update:amount', 'update:customAmount', 'update:itemIndex', 'update:quantity'])
const { t } = useI18n()
// 预设的快捷金额档位。
const amounts = [50, 100, 500, 1000]
</script>
