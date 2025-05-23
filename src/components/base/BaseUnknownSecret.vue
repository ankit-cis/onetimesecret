<!-- BaseUnknownSecret.vue -->
<script setup lang="ts">
  import type { BrandSettings } from '@/schemas/models/domain/brand';

  export interface Props {
    branded?: boolean;
    brandSettings?: BrandSettings;
  }

  defineProps<Props>();

  /**
   * Computes background color with 15% opacity for branded icon container
   */
  const getBackgroundColor = (color?: string): string => {
    return color ? `${color}15` : '';
  };
</script>

<template>
  <div
    class="unknown-secret"
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg p-8',
      branded ? 'shadow-xl w-full' : 'shadow-md',
      branded && brandSettings?.corner_style === 'sharp' ? 'rounded-none' : '',
    ]"
    :style="
      branded && brandSettings
        ? {
            fontFamily: brandSettings.font_family || 'inherit',
          }
        : {}
    ">
    <!-- Header slot for icon and title -->
    <slot
      name="header"
      :branded="branded"
      :brand-settings="brandSettings"
      :get-background-color="getBackgroundColor">
    </slot>

    <!-- Main content slot -->
    <div :class="{ 'space-y-6': branded }">
      <slot
        name="message"
        :branded="branded"
        :brand-settings="brandSettings">
      </slot>

      <slot
        name="alert"
        :branded="branded">
      </slot>

      <!-- Action button slot -->
      <slot
        name="action"
        :branded="branded"
        :brand-settings="brandSettings">
      </slot>
    </div>
  </div>
</template>
