// src/schemas/models/metadata.ts
import { baseApiRecordSchema } from '@/schemas/base';
import { type DetailsType } from '@/schemas/base';
import { secretInputSchema } from '@/schemas/models/secret';
import { booleanFromString } from '@/utils/transforms';
import { z } from 'zod';

/**
 * @fileoverview Metadata schema for API transformation boundaries
 *
 * Key Design Decisions:
 * 1. Input schemas handle API -> App transformation
 * 2. App uses single shared type between stores/components
 * 3. No explicit output schemas - serialize when needed
 *
 * Validation Rules:
 * - Boolean fields come as strings from Ruby/Redis ('true'/'false')
 * - Dates come as UTC strings
 * - State field is validated against enum
 * - Optional fields explicitly marked
 */

// Metadata state enum matching Ruby model
export const MetadataState = {
  NEW: 'new',
  SHARED: 'shared',
  RECEIVED: 'received',
  BURNED: 'burned',
  VIEWED: 'viewed',
} as const

/**
 * Schema for metadata data from API
 */

const metadataBaseSchema = z.object({
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
  ]),
})

const metadataListBaseSchema = z.object({
  custid: z.string(),
  secret_ttl: z.string().transform(Number),
  show_recipients: booleanFromString,
  is_received: booleanFromString,
  is_burned: booleanFromString,
  is_destroyed: booleanFromString,
  is_truncated: booleanFromString,
})

export const metadataListInputSchema = baseApiRecordSchema
  .merge(metadataBaseSchema)
  .merge(metadataListBaseSchema)
  .strip()

const metadataListDetailsBaseSchema = z.object({
  since: z.number(),
  now: z.number(),
  has_items: booleanFromString,
  received: z.array(metadataListInputSchema),
  notreceived: z.array(metadataListInputSchema)
})

export const metadataListDetailsInputSchema = baseApiRecordSchema
  .merge(metadataListDetailsBaseSchema)
  .strip()

const metadataExtendedBaseSchema = z.object({
  secret_key: z.string().optional(),
  created_date_utc: z.string(),
  expiration_stamp: z.string(),
  share_path: z.string(),
  burn_path: z.string(),
  metadata_path: z.string(),
  share_url: z.string(),
  metadata_url: z.string(),
  burn_url: z.string(),
})

export const metadataInputSchema = baseApiRecordSchema
  .merge(metadataBaseSchema)
  .merge(metadataExtendedBaseSchema)
  .strip()

/**
 * Schema for metadata details view
 * Handles string -> boolean transformations from API
 */
const metadataDetailsBaseSchema = z.object({
  title: z.string(),
  body_class: z.string(),
  display_lines: z.number(),
  display_feedback: booleanFromString,
  no_cache: booleanFromString,
  received_date: z.string(),
  received_date_utc: z.string(),
  burned_date: z.string(),
  burned_date_utc: z.string(),
  maxviews: z.number(),
  has_maxviews: booleanFromString,
  view_count: z.number(),
  has_passphrase: booleanFromString,
  can_decrypt: booleanFromString,
  secret_value: z.string(),
  show_secret: booleanFromString,
  show_secret_link: booleanFromString,
  show_metadata_link: booleanFromString,
  show_metadata: booleanFromString,
  show_recipients: booleanFromString,
})

export const metadataDetailsInputSchema = baseApiRecordSchema
  .merge(metadataDetailsBaseSchema)
  .strip()

export type Metadata = z.infer<typeof metadataInputSchema>
export type MetadataDetails = z.infer<typeof metadataDetailsInputSchema> & DetailsType
export type MetadataList = z.infer<typeof metadataListInputSchema>
export type MetadataListDetails = z.infer<typeof metadataListDetailsInputSchema>

/**
 * Schema for dashboard metadata extensions
 */
const dashboardMetadataBaseSchema = z.object({
  shortkey: z.string(),
  show_recipients: booleanFromString,
  stamp: z.string(),
  uri: z.string(),
  is_received: booleanFromString,
  is_burned: booleanFromString,
  is_destroyed: booleanFromString
})

export const dashboardMetadataInputSchema = baseApiRecordSchema
  .merge(dashboardMetadataBaseSchema)
  .strip()

export type DashboardMetadata = z.infer<typeof dashboardMetadataInputSchema>

/**
 * Schema for combined secret and metadata (conceal data)
 */
const concealDataBaseSchema = z.object({
  metadata: metadataInputSchema,
  secret: secretInputSchema,
  share_domain: z.string()
})

export const concealDataInputSchema = baseApiRecordSchema
  .merge(concealDataBaseSchema)
  .strip()

export type ConcealData = z.infer<typeof concealDataInputSchema>
