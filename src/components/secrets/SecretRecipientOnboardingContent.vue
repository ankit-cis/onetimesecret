<script setup lang="ts">

interface Props {}
defineProps<Props>();

</script>

<template>
  <div>
    <div class="bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-7">
        <div class="text-center">
          <div
            class="flex justify-center font-semibold
            uppercase tracking-wide
            text-brandcomp-700 dark:text-brandcomp-600">
            <img
                id="logo-light"
                src="@/assets/img/wisegroup.jpg"
                class="w-32 sm:w-40 md:w-52 lg:w-[18rem] aspect-[2.6] h-auto object-contain rounded-md transition-transform dark:hidden"
                alt="Wise Group Logo"
              />
              <!-- Dark mode logo -->
              <img
                id="logo-dark"
                src="@/assets/img/wisegroup.svg"
                class="w-32 sm:w-40 md:w-52 lg:w-[18rem] aspect-[2.6] h-auto object-contain rounded-md transition-transform hidden dark:block"
                alt="Wise Group Logo (Dark)"
              />
        </div>
          <h3
            class="mt-1 text-3xl font-extrabold
              text-gray-500 dark:text-gray-300
              sm:text-3xl sm:tracking-tight lg:text-4xl">
            {{ $t('youve-got-secret-mail') }}
          </h3>
          <p
            class="mx-auto mt-5 max-w-2xl text-xl
              text-gray-400 dark:text-gray-400">
            {{ $t('a-secure-one-time-message-awaits-you') }} <br />
            {{ $t('before-you-open-it-heres-what-you-should-know') }}
          </p>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-600 dark:text-white">
              {{ $t('what-is-this') }}
            </h3>
            <p class="mt-3 text-base text-gray-400 dark:text-gray-300">
              {{ $t('onetime-secret-is-a-secure-way-to-share-sensitiv') }}
            </p>
          </div>
          <div class="mt-8 lg:mt-0">
            <h3 class="text-lg font-medium text-gray-600 dark:text-white">
              {{ $t('is-it-secure') }}
            </h3>
            <p class="mt-3 text-base text-gray-400 dark:text-gray-300">
              {{ $t('yes-after-viewing-the-secret-is-permanently-dele') }}
            </p>
          </div>
          <div class="mt-8 lg:mt-0">
            <h3 class="text-gray6900 whitespace-nowrap text-lg font-medium dark:text-white">
              {{ $t('what-happens-next') }}
            </h3>
            <p class="mt-3 text-base text-gray-400 dark:text-gray-300">
              {{ $t('when-ready-click-the-view-secret-button-at-the-t') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
