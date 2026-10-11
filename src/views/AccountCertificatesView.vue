<template>
  <AccountPageShell class="account-details-page" :title="t('accountDetails.certificates.title')"
    :eyebrow="t('accountDetails.certificates.eyebrow')" :subtitle="t('accountDetails.certificates.subtitle')" account-trail>
    <section class="certificate-panel" aria-labelledby="certificate-heading">
      <h2 id="certificate-heading">{{ t('accountDetails.certificates.heading') }}</h2>
      <p>{{ t('accountDetails.certificates.description') }}</p>
      <p class="certificate-example-note">{{ t('accountDetails.certificates.example') }}</p>
      <div class="certificate-grid">
        <figure v-for="(certificate, index) in certificates" :key="index">
          <img :src="certificate.preview" :alt="t(`accountDetails.certificates.${index === 1 ? 'templateAlt' : 'imageAlt'}`)"
            width="680" height="980" :loading="index > 1 ? 'lazy' : 'eager'" />
          <figcaption>
            <a :href="certificate.download" :download="t('accountDetails.certificates.filename', { number: index + 1 })">
              {{ t('accountDetails.certificates.download') }}
              <span class="certificate-link-index">{{ t('accountDetails.certificates.sample', { number: index + 1 }) }}</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  </AccountPageShell>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import certificate from '@/assets/account-details/certificate.png'
import template from '@/assets/account-details/certificate-template.png'
import certificatePreview from '@/assets/account-details/certificate.webp'
import templatePreview from '@/assets/account-details/certificate-template.webp'
import '@/styles/account-details.css'

const { t } = useI18n()
const sample = { preview: certificatePreview, download: certificate }
const certificates = [sample, { preview: templatePreview, download: template }, sample, sample]
</script>
