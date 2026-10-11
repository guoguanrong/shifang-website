<template>
  <AccountPageShell :title="t(`${pageKey}.title`)" :eyebrow="t(`${pageKey}.eyebrow`)" :subtitle="t(`${pageKey}.subtitle`)">
    <section class="history-list" :aria-labelledby="headingId">
      <header class="account-paper history-list-heading">
        <h2 :id="headingId">{{ t(`${pageKey}.heading`) }}</h2>
        <label class="record-example-toggle"><input v-model="showExamples" type="checkbox" />{{ t('accountPages.records.showExamples') }}</label>
      </header>
      <p class="history-example-notice">{{ t('accountPages.history.exampleNotice') }}</p>
      <AccountHistoryCard v-for="record in records" :key="record.id" :record="record" :kind="kind" />
      <div v-if="!records.length" class="record-empty" role="status"><h3>{{ t('accountPages.records.empty') }}</h3><p>{{ t('accountPages.history.emptyDescription') }}</p></div>
    </section>
  </AccountPageShell>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import AccountHistoryCard from '@/components/account/AccountHistoryCard.vue'
import { accountHistoryExamples } from '@/data/account-history-examples'
import '@/styles/account-history.css'

const props = defineProps({ kind: { type: String, required: true, validator: value => ['orders', 'events'].includes(value) } })
const { t } = useI18n()
const headingId = useId()
const showExamples = ref(true)
const pageKey = computed(() => `accountPages.history.${props.kind}Page`)
const records = computed(() => showExamples.value ? accountHistoryExamples[props.kind] : [])
</script>
