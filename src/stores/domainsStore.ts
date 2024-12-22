// src/stores/domainsStore.ts

import type { UpdateDomainBrandRequest } from '@/schemas/api';
import {
  ApiRecordResponse,
  ApiRecordsResponse,
  createRecordResponseSchema,
  createRecordsResponseSchema,
} from '@/schemas/api';
import { brandSettingschema, type BrandSettings } from '@/schemas/models';
import { customDomainSchema, type CustomDomain } from '@/schemas/models/domain';
import { createApi } from '@/utils/api';
import { isTransformError, transformResponse } from '@/utils/transforms';
import axios from 'axios';
import { defineStore } from 'pinia';
import type { ZodIssue } from 'zod';

const api = createApi();

/**
 * Domains store with centralized error handling
 * - Uses shared CustomDomain type with components
 * - Handles API transformation at edges only
 * - Centralizes error handling to avoid duplication
 */
export const useDomainsStore = defineStore('domains', {
  state: (): {
    domains: CustomDomain[];
    isLoading: boolean;
    defaultBranding: BrandSettings;
  } => ({
    domains: [],
    isLoading: false,
    defaultBranding: {} as BrandSettings,
  }),
  actions: {
    /**
     * Parse domain branding data using the centralized schema
     */
    parseDomainBranding(data: { brand: Record<string, unknown> }): { brand: BrandSettings } {
      try {
        const validated = transformResponse(brandSettingschema, data.brand);
        return { brand: validated };
      } catch (error) {
        console.warn('Failed to parse domain branding:', error);
        return { brand: this.defaultBranding };
      }
    },

    /**
     * Centralized error handler for API errors
     * @param error - The error thrown from an API call
     */
    handleApiError(error: unknown): never {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || error.message;
        console.error('API Error:', serverMessage);
        // You can extend this to handle specific error codes or scenarios
        throw new Error(serverMessage);
      } else if (isTransformError(error)) {
        console.error('Data Validation Error:', formatErrorDetails(error.details));
        throw new Error('Data validation failed.');
      } else if (error instanceof Error) {
        console.error('Unexpected Error:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Unexpected Error:', error);
        throw new Error('An unexpected error occurred.');
      }
    },

    /**
     * Refreshes the list of domains from the API
     */
    async refreshDomains() {
      this.isLoading = true;
      try {
        const response = await api.get<ApiRecordsResponse<CustomDomain>>('/api/v2/account/domains');

        const validated = transformResponse(
          createRecordsResponseSchema(customDomainSchema),
          response.data
        );

        this.domains = validated;
      } catch (error) {
        this.handleApiError(error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Updates the brand information of a specific domain
     * @param domain - The domain to update
     * @param brandUpdate - The brand update payload
     * @returns The updated domain record
     */
    async updateDomainBrand(domain: string, brandUpdate: UpdateDomainBrandRequest) {
      try {
        const response = await api.put<ApiRecordResponse<CustomDomain>>(
          `/api/v2/account/domains/${domain}/brand`,
          brandUpdate
        );

        const validated = transformResponse(
          createRecordResponseSchema(customDomainSchema),
          response.data
        );

        const domainIndex = this.domains.findIndex((d) => d.display_domain === domain);
        if (domainIndex !== -1) {
          this.domains[domainIndex] = validated.record;
        } else {
          this.domains.push(validated.record);
        }

        return validated.record;
      } catch (error) {
        this.handleApiError(error);
      }
    },

    /**
     * Adds a new domain to the store after validation
     * @param domain - The domain to add
     * @returns The added domain record
     */
    async addDomain(domain: string) {
      try {
        const response = await api.post<ApiRecordResponse<CustomDomain>>(
          '/api/v2/account/domains/add',
          {
            domain,
          }
        );

        const validated = transformResponse(
          createRecordResponseSchema(customDomainSchema),
          response.data
        );

        this.domains.push(validated.record);
        return validated.record;
      } catch (error) {
        this.handleApiError(error);
      }
    },

    /**
     * Deletes a domain and removes it from the store
     * @param domainName - The name of the domain to delete
     */
    async deleteDomain(domainName: string) {
      try {
        await api.post(`/api/v2/account/domains/${domainName}/remove`);
        this.domains = this.domains.filter((domain) => domain.display_domain !== domainName);
      } catch (error) {
        this.handleApiError(error);
      }
    },

    // Get brand settings for a domain
    async getBrandSettings(domain: string) {
      try {
        const response = await api.get(`/api/v2/account/domains/${domain}/brand`);
        return transformResponse(createRecordResponseSchema(brandSettingschema), response.data);
      } catch (error) {
        this.handleApiError(error);
      }
    },

    // Update brand settings
    async updateBrandSettings(domain: string, settings: Partial<BrandSettings>) {
      try {
        const response = await api.put(`/api/v2/account/domains/${domain}/brand`, {
          brand: settings,
        });
        return transformResponse(createRecordResponseSchema(brandSettingschema), response.data);
      } catch (error) {
        this.handleApiError(error);
      }
    },

    /**
     * Toggles public homepage access with optimistic update
     * @param domain - The domain to toggle access for
     * @returns The new homepage access status
     */
    async toggleHomepageAccess(domain: CustomDomain) {
      const newHomepageStatus = !domain.brand?.allow_public_homepage;
      const domainIndex = this.domains.findIndex((d) => d.display_domain === domain.display_domain);

      // Optimistic update
      if (domainIndex !== -1) {
        const optimisticUpdate = {
          ...domain,
          brand: {
            ...(domain.brand || {}),
            allow_public_homepage: newHomepageStatus,
          },
        };

        // Validate optimistic update
        const validated = transformResponse(customDomainSchema, optimisticUpdate);

        this.domains[domainIndex] = validated;
      }

      try {
        const response = await api.put<ApiRecordResponse<CustomDomain>>(
          `/api/v2/account/domains/${domain.display_domain}/brand`,
          {
            brand: { allow_public_homepage: newHomepageStatus },
          }
        );

        const validated = transformResponse(
          createRecordResponseSchema(customDomainSchema),
          response.data
        );

        // Update with server response
        if (domainIndex !== -1) {
          this.domains[domainIndex] = validated.record;
        }

        return newHomepageStatus;
      } catch (error) {
        // Revert on error
        if (domainIndex !== -1) {
          this.domains[domainIndex] = domain;
        }
        this.handleApiError(error);
      }
    },

    /**
     * Updates a domain in the store with validation
     * @param domain - The domain to update
     * @returns The updated domain record
     */
    async updateDomain(domain: CustomDomain) {
      try {
        const response = await api.put<ApiRecordResponse<CustomDomain>>(
          `/api/v2/account/domains/${domain.display_domain}`,
          domain
        );

        const validated = transformResponse(
          createRecordResponseSchema(customDomainSchema),
          response.data
        );

        const domainIndex = this.domains.findIndex(
          (d) => d.display_domain === domain.display_domain
        );

        if (domainIndex !== -1) {
          this.domains[domainIndex] = validated.record;
        } else {
          this.domains.push(validated.record);
        }

        return validated.record;
      } catch (error) {
        this.handleApiError(error);
      }
    },
  },
});

// Helper function to safely format error details
function formatErrorDetails(details: ZodIssue[] | string): string | Record<string, string> {
  if (typeof details === 'string') {
    return details;
  }

  return details.reduce(
    (acc, issue) => {
      const path = issue.path.join('.');
      acc[path] = issue.message;
      return acc;
    },
    {} as Record<string, string>
  );
}
