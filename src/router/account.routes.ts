import DefaultFooter from '@/components/layout/DefaultFooter.vue';
import DefaultHeader from '@/components/layout/DefaultHeader.vue';
import { AsyncDataResult, CustomDomainResponse } from '@/schemas/api/responses';
import api from '@/utils/api';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/account',
    name: 'Account',
    components: {
      default: () => import('@/views/account/AccountIndex.vue'),
      header: DefaultHeader,
      footer: DefaultFooter,
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account/domains/:domain/verify',
    name: 'AccountDomainVerify',
    components: {
      default: () => import('@/views/account/AccountDomainVerify.vue'),
      header: DefaultHeader,
      footer: DefaultFooter,
    },
    meta: {
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/account/domains/add',
    name: 'AccountDomainAdd',
    components: {
      default: () => import('@/views/account/AccountDomainAdd.vue'),
      header: DefaultHeader,
      footer: DefaultFooter,
    },
    meta: {
      requiresAuth: true,
      layoutProps: {
        displayFeedback: false,
      },
    },
    props: true,
  },
  {
    path: '/account/domains',
    name: 'AccountDomains',
    components: {
      default: () => import('@/views/account/AccountDomains.vue'),
      header: DefaultHeader,
      footer: DefaultFooter,
    },
    meta: {
      requiresAuth: true,
    },
    props: true,
  },
  // Update the route configuration
  {
    path: '/account/domains/:domain/brand',
    name: 'AccountDomainBrand',
    components: {
      default: () => import('@/views/account/AccountDomainBrand.vue'),
      header: DefaultHeader,
      footer: DefaultFooter,
    },
    meta: {
      requiresAuth: true,
    },
    props: true,
    beforeEnter: async (to, from, next) => {
      try {
        const domain = to.params.domain as string;
        const response = await api.get<CustomDomainResponse>(
          `/api/v2/account/domains/${domain}/brand`
        );

        const initialData: AsyncDataResult<CustomDomainResponse> = {
          status: response.status,
          data: response.data,
          error: null,
        };

        to.meta.initialData = initialData; // Could fix this by adding a AccountInitialData type
        next();
      } catch (error) {
        console.error('Error fetching domain brand data:', error);
        const initialData: AsyncDataResult<CustomDomainResponse> = {
          status: 500,
          data: null,
          error:
            error instanceof Error ? error.message : 'Failed to fetch domain brand data',
        };

        to.meta.initialData = initialData;
        next();
      }
    },
  },
  {
    path: '/colonel',
    name: 'Colonel',
    components: {
      default: () => import('@/views/colonel/ColonelIndex.vue'),
      header: DefaultHeader,
      footer: DefaultFooter,
    },
    meta: {
      isAdmin: true,
      requiresAuth: true,
    },
    props: true,
  },
];

export default routes;
