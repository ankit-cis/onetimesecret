
import { createModelSchema } from '@/schemas/models/base';
import { transforms } from '@/utils/transforms';
import { optional, z } from 'zod';

/**
 * @fileoverview Metadata schema with unified transformations
 *
 * Key improvements:
 * 1. Unified transformation layer using base transforms
 * 2. Clearer type flow from API to frontend
 * 3. Maintained existing functionality
 *
 * Validation Rules:
 * - Boolean fields come as strings from Ruby/Redis ('true'/'false')
 * - Dates come as UTC strings or timestamps
 * - State field is validated against enum
 * - Optional fields explicitly marked
 */


/**
 * Metadata state enum matching Ruby model
 *
 * Using const object pattern over enum because:
 * 1. Produces simpler runtime code (just a plain object vs IIFE)
 * 2. Better tree-shaking since values can be inlined
 * 3. Works naturally with Zod's z.enum() which expects string literals
 * 4. More flexible for runtime operations (Object.keys(), etc.)
 * 5. Matches idiomatic TypeScript patterns for string-based enums
 */
export const MetadataState = {
  NEW: 'new',
  SHARED: 'shared',
  RECEIVED: 'received',
  BURNED: 'burned',
  VIEWED: 'viewed',
  ORPHANED: 'orphaned',
} as const;

// Common base schema for all metadata records
export const metadataBaseSchema = createModelSchema({
  key: z.string(),
  shortkey: z.string(),
  secret_shortkey: z.string().optional(),
  recipients: z.array(z.string()).or(z.string()).optional(),
  share_domain: z.string().optional(),
  state: z.enum([
    MetadataState.NEW,
    MetadataState.SHARED,
    MetadataState.RECEIVED,
    MetadataState.BURNED,
    MetadataState.VIEWED,
    MetadataState.ORPHANED,
  ]),
  received: optional(transforms.fromString.date),
  burned: optional(transforms.fromString.date),
  // There is no "orphaned" time field. We use updated. To be orphaned is an
  // exceptional case and it's not something we specifically control. Unlike
  // burning or receiving which are linked to user actions, we don't know
  // when the metadata got into an orphaned state; only when we flagged it.
});


// Metadata shape in single record view
export const metadataSchema = metadataBaseSchema.merge(z.object({
  secret_key: z.string().optional(),
  natural_expiration: z.string(),
  expiration: transforms.fromString.date,
  share_path: z.string(),
  burn_path: z.string(),
  metadata_path: z.string(),
  share_url: z.string(),
  metadata_url: z.string(),
  burn_url: z.string(),
  identifier: z.string(),
}));

// The details for each record in single record details
export const metadataDetailsSchema = z.object({
  type: z.literal('record'),
  title: z.string(),
  display_lines: transforms.fromString.number,
  display_feedback: transforms.fromString.boolean,
  no_cache: transforms.fromString.boolean,
  secret_realttl: z.string(), // Preserve ttlToNaturalLanguage behavior
  maxviews: transforms.fromString.number,
  has_maxviews: transforms.fromString.boolean,
  view_count: transforms.fromString.number,
  has_passphrase: transforms.fromString.boolean,
  can_decrypt: transforms.fromString.boolean,
  secret_value: z.string().nullable().optional(),
  show_secret: transforms.fromString.boolean,
  show_secret_link: transforms.fromString.boolean,
  show_metadata_link: transforms.fromString.boolean,
  show_metadata: transforms.fromString.boolean,
  show_recipients: transforms.fromString.boolean,
  is_destroyed: transforms.fromString.boolean,
  is_received: transforms.fromString.boolean,
  is_burned: transforms.fromString.boolean,
  is_orphaned: transforms.fromString.boolean,
});

// Export types
export type Metadata = z.infer<typeof metadataSchema>;
export type MetadataDetails = z.infer<typeof metadataDetailsSchema>;
