// stores/metadataStore.ts
import { useErrorHandler } from '@/composables/useErrorHandler';
import type { MetadataRecords, MetadataRecordsDetails } from '@/schemas/api/endpoints';
import { ApiError } from '@/schemas/api/errors';
import { responseSchemas } from '@/schemas/api/responses';
import { Metadata, MetadataDetails } from '@/schemas/models/metadata';
import { createApi } from '@/utils/api';
import { type AxiosInstance } from 'axios';
import { defineStore } from 'pinia';

// Define valid states as a value (not just a type)
export const METADATA_STATUS = {
  NEW: 'new',
  SHARED: 'shared',
  RECEIVED: 'received',
  BURNED: 'burned',
  VIEWED: 'viewed',
  ORPHANED: 'orphaned',
} as const;

interface StoreState {
  // Base properties required for all stores
  isLoading: boolean;
  error: ApiError | null;
  // Metadata-specific properties
  currentRecord: Metadata | null;
  currentDetails: MetadataDetails | null;
  records: MetadataRecords[];
  details: MetadataRecordsDetails | {};
  initialized: boolean;
  count: number | null;
}

export const useMetadataStore = defineStore('metadata', {
  state: (): StoreState => ({
    isLoading: false,
    error: null,
    currentRecord: null as Metadata | null,
    currentDetails: null,
    records: [],
    details: {},
    initialized: false,
    count: null,
  }),

  getters: {
    recordCount: (state) => state.count,

    canBurn(state: StoreState): boolean {
      if (!state.currentRecord) return false;
      const validStates = [
        METADATA_STATUS.NEW,
        METADATA_STATUS.SHARED,
        METADATA_STATUS.VIEWED,
      ] as const;
      return (
        validStates.includes(state.currentRecord.state as (typeof validStates)[number]) &&
        !state.currentRecord.burned
      );
    },
  },

  actions: {
    // Inject API client through closure
    _api: null as AxiosInstance | null,

    /**
     *  Wraps async operations with loading state management. A poor dude's plugin.
     *
     * Implementation Note: Originally attempted as a Pinia plugin but moved to a
     * store action due to testing challenges. The plugin approach required complex
     * setup with proper plugin initialization in tests, which introduced more
     * complexity than value. While plugins are better for cross-store
     * functionality, this simple loading pattern works fine as a store
     * action and is much easier to test.
     *
     * The original plugin implementation kept failing with "_withLoading does not
     * exist" errors in tests, likely due to plugin initialization timing issues.
     * This direct approach sidesteps those problems entirely.
     *
     * @template T The type of value returned by the operation
     * @param operation The async operation to execute with loading state
     * @returns Promise of the operation result
     */
    async _withLoading<T>(operation: () => Promise<T>) {
      this.isLoading = true;
      // Removed unused axiosInstance variable

      try {
        return await operation();
      } catch (error: unknown) {
        this.handleError(error); // Will handle both validation and API errors

        // if (error && typeof error === 'object' && 'isAxiosError' in error) {
        //   const axiosError = error as AxiosError<ApiErrorResponse>;
        //   const message = axiosError.response?.data?.message || axiosError.message;
        //   throw new Error(`API Error: ${message}`);
        // } else if (error instanceof ZodError) {
        //   const issues = error.issues
        //     .map((issue: { message: string }) => issue.message)
        //     .join(', ');
        //   throw new Error(`Validation Error: ${issues}`);
        // }
        // throw error;
      } finally {
        this.isLoading = false;
      }
    },

    init(api: AxiosInstance = createApi()) {
      this._api = api;
    },

    handleError(error: unknown): ApiError {
      const { handleError } = useErrorHandler();
      this.error = handleError(error);
      return this.error;
    },

    async fetchOne(key: string) {
      return await this._withLoading(async () => {
        const response = await this._api!.get(`/api/v2/private/${key}`);
        const validated = responseSchemas.metadata.parse(response.data);
        this.currentRecord = validated.record;
        this.currentDetails = validated.details;
        return validated;
      });
    },

    async fetchList() {
      return await this._withLoading(async () => {
        const response = await this._api!.get('/api/v2/private/recent');
        console.log('API Response:', response.data);

        const validated = responseSchemas.metadataList.parse(response.data);

        this.records = validated.records ?? ([] as MetadataRecords[]);
        this.details = validated.details ?? ({} as MetadataRecordsDetails);
        this.count = validated.count ?? 0;

        console.log('Store State After Update:', {
          records: this.records,
          details: this.details,
          count: this.count,
        });

        return validated;
      });
    },

    async refreshRecords() {
      if (this.initialized) return; // prevent repeated calls when 0 domains
      return await this._withLoading(async () => {
        this.fetchList();
        this.initialized = true;
      });
    },

    async burn(key: string, passphrase?: string) {
      if (!this.canBurn) {
        this.handleError(new Error('Cannot burn this metadata'));
      }

      return await this._withLoading(async () => {
        const response = await this._api!.post(`/api/v2/private/${key}/burn`, {
          passphrase,
          continue: true,
        });
        const validated = responseSchemas.metadata.parse(response.data);
        this.currentRecord = validated.record;
        this.currentDetails = validated.details;
        return validated;
      });
    },
  },

  // hydrate(store: Store) {
  //   store.refreshRecords();
  // },
});
