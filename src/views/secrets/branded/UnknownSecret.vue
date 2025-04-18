<!-- src/components/secrets/branded/UnknownSecret.vue -->
<script setup lang="ts">
  import BaseUnknownSecret from '@/components/base/BaseUnknownSecret.vue';
  import type { BrandSettings } from '@/schemas/models/domain/brand';

  interface Props {
    brandSettings?: BrandSettings;
    branded?: boolean;
  }

  defineProps<Props>();
</script>

<template>
  <BaseUnknownSecret
    :branded="true"
    :brand-settings="brandSettings">
    <!-- Header with icon and title -->
    <template #header="{ brandSettings, getBackgroundColor }">
      <div class="mb-8 flex items-center space-x-4">
        <div
          class="flex size-12 items-center justify-center rounded-full"
          :class="brandSettings?.primary_color ? '' : 'bg-brand-100 dark:bg-brand-900'"
          :style="
            brandSettings?.primary_color
              ? {
                  backgroundColor: getBackgroundColor(brandSettings.primary_color),
                }
              : {}
          ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-6"
            :class="
              brandSettings?.button_text_light
                ? 'text-white'
                : 'text-brand-600 dark:text-brand-400'
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white"> {{ $t('not-found') }} </h2>
        </div>
      </div>
    </template>

    <!-- Main message -->
    <template #message="{ brandSettings }">
      <p class="text-gray-600 dark:text-gray-300">
        <span v-if="brandSettings?.instructions_post_reveal">
          {{ brandSettings?.instructions_post_reveal }}
        </span>
        <span v-else>
          {{ $t('information-shared-through-this-service-can-only') }}
        </span>
      </p>
    </template>

    <!-- Action button -->
    <template #action="{ brandSettings }">
      <router-link
        to="/"
        class="inline-block rounded-lg border-2 bg-white px-4 py-2 transition duration-300 ease-in-out hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-brand-400 dark:focus:ring-offset-gray-900"
        :style="
          brandSettings?.primary_color
            ? {
                color: brandSettings.primary_color,
                borderColor: brandSettings.primary_color,
              }
            : {
                color: 'var(--color-brand-500)',
                borderColor: 'var(--color-brand-500)',
              }
        ">
        {{ $t('return-to-home') }}
      </router-link>
    </template>
  </BaseUnknownSecret>
</template>
