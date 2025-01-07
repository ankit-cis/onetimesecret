// tests/unit/vue/setup.ts
/* global global */
import { autoInitPlugin } from '@/plugins/pinia/autoInitPlugin';
import { createApi } from '@/utils/api';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import { createApp } from 'vue';

// Mock global objects that JSDOM doesn't support
global.fetch = vi.fn();
global.Request = vi.fn();
global.Response = {
  error: vi.fn(),
  json: vi.fn(),
  redirect: vi.fn(),
  prototype: Response.prototype,
} as unknown as typeof Response;

export async function setupTestPinia(options = { stubActions: false }) {
  const api = createApi();
  const app = createApp({});

  const pinia = createTestingPinia({
    ...options,
    plugins: [autoInitPlugin({ api })],
  });

  app.use(pinia);

  // Wait for both microtasks and macrotasks to complete
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));

  return { pinia, api, app };
}
