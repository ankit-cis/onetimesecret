// src/schemas/api/payloads/conceal.ts

// NOTE: We may want to import some details from the metadata and secret schemas
// since they are obviously highly correleated with the conceal payload. For now,
// we will keep this simple and just define the payload schema here and keep it
// compacetic via diligence and testing.
//import { metadataSchema, secretSchema } from '@/schemas/models';

import { z } from 'zod';
export const concealPayloadSchema = z.object({
  kind: z.enum(['generate', 'conceal', 'share']), // share for temporary legacy use with existing secrets
  secret: z.string().min(1),
  share_domain: z.string(),
  recipient: z.string().email().optional(),
  passphrase: z.string().optional(),
  ttl: z.number().optional(),
});

export type ConcealPayload = z.infer<typeof concealPayloadSchema>;
