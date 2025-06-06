<script setup lang="ts">
  import type { BrandSettings } from '@/schemas/models/domain/brand';
  import BaseUnknownSecret from '@/components/base/BaseUnknownSecret.vue';

  interface Props {
    branded?: boolean;
    brandSettings?: BrandSettings;
  }

  defineProps<Props>();
</script>

<template>
  <BaseUnknownSecret
    :branded="branded"
    :brand-settings="brandSettings">
    <template #header="{}">
      <div class="mb-8 items-center">
        <svg
          class="mx-auto mb-4 size-20 text-brand-500"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path
            d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>

        <h1
          class="mb-6 text-3xl font-bold text-gray-800 dark:text-white"
          :aria-label="$t('information-no-longer-available')">
          {{ $t('that-information-is-no-longer-available') }}
        </h1>
      </div>
    </template>

    <template #message="{}">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg py-8 text-lg">
        <em>{{ $t('welcome-to-onetime-secret') }}</em>
        {{ $t('information-shared-through-our-service-can-only-') }}
      </div>
    </template>

    <template #alert="{}">
      <!-- Canonical alert styling -->
      <div
        :class="[
          'border-l-4 border-gray-500 bg-brandcomp-50 dark:bg-gray-600',
          branded ? 'p-4' : 'mb-8 p-5',
        ]">
        <p :class="['text-brandcomp-700 dark:text-brandcomp-200', 'text-lg font-medium']">
          {{ $t('if-youre-unsure-what-to-do-next-please-follow-up') }}
        </p>
      </div>
    </template>

    <template #action="{}">
      <!-- Canonical action button -->
      <router-link
        to="/"
        :class="[
          'inline-block rounded-lg border-2 transition duration-300 ease-in-out',
          'bg-white dark:bg-gray-800',
          'hover:bg-brand-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          'focus:ring-brand-500 dark:focus:ring-brand-400',
          'px-6 py-3 font-brand text-lg hover:border-brand-600 dark:hover:border-brand-400',
        ]"
        :style="{
          color: 'var(--color-brand-500)',
          borderColor: 'var(--color-brand-500)',
        }"
        :aria-label="$t('return-to-home-page')">
        {{ $t('return-to-home') }}
      </router-link>
    </template>
  </BaseUnknownSecret>
</template>
