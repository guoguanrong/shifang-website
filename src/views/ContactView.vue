<template>
  <AccountPageShell class="information-page contact-page" :title="t('accountDetails.contact.title')"
    :eyebrow="t('accountDetails.contact.eyebrow')" :subtitle="t('accountDetails.contact.subtitle')" :breadcrumb="false">
    <p class="contact-introduction">{{ t('accountDetails.contact.introduction') }}</p>
    <div class="contact-cards">
      <section v-for="item in contacts" :key="item.id" class="contact-card">
        <img :src="item.icon" :class="item.id" alt="" />
        <div>
          <h2>{{ t(`accountDetails.contact.${item.id}`) }}</h2>
          <a v-if="item.href" :href="item.href">{{ item.value }}</a>
          <p v-else>{{ t('accountDetails.contact.address') }}</p>
        </div>
      </section>
    </div>
  </AccountPageShell>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AccountPageShell from '@/components/account/AccountPageShell.vue'
import emailIcon from '@/assets/account-details/contact-email.svg'
import phoneIcon from '@/assets/account-details/contact-phone.svg'
import locationIcon from '@/assets/account-details/contact-location.svg'
import '@/styles/account-details.css'

const { t } = useI18n()
const contacts = [
  { id: 'email', value: 'shifangtemple.info@gmail.com', href: 'mailto:shifangtemple.info@gmail.com', icon: emailIcon },
  { id: 'phone', value: '+1 (888) 555-0188', href: 'tel:+18885550188', icon: phoneIcon },
  { id: 'location', icon: locationIcon },
]
</script>
