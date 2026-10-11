<template>
  <AccountPageShell class="information-page policy-page" :class="`policy-page-${kind}`"
    :title="t(`${pageKey}.title`)" :eyebrow="t(`${pageKey}.eyebrow`)" :subtitle="t(`${pageKey}.subtitle`)" :breadcrumb="false">
    <article class="policy-document" :aria-label="t(`${pageKey}.title`)" :lang="locale">
      <section v-for="(_, index) in sections" :key="index" :aria-labelledby="`policy-section-${index}`">
        <h2 :id="`policy-section-${index}`">{{ t(`${pageKey}.sections.${index}.title`) }}</h2>
        <i18n-t :keypath="`${pageKey}.sections.${index}.body`" tag="p" scope="global">
          <template #privacyLink><RouterLink to="/privacy">{{ t('policyPages.privacyLink') }}</RouterLink></template>
          <template #email><a :href="`mailto:${email}`">{{ email }}</a></template>
        </i18n-t>
      </section>
    </article>
  </AccountPageShell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import '@/styles/account-details.css'

const props = defineProps({
  kind: { type: String, required: true, validator: value => ['legal', 'privacy', 'compliance'].includes(value) },
})
const { t, tm, locale } = useI18n()
const pageKey = computed(() => `policyPages.${props.kind}`)
const sections = computed(() => tm(`${pageKey.value}.sections`))
const email = 'shifangtemple.info@gmail.com'
</script>
