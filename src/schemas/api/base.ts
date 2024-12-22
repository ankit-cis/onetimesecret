import { transforms } from '@/utils/transforms';
import { z } from 'zod';

type SchemaOptions<TRecord, TDetails> = {
  recordSchema: TRecord;
  detailsSchema?: TDetails;
}

const resolveDetailsSchema = <T extends z.ZodTypeAny | undefined>(schema?: T) =>
  schema ?? z.record(z.string(), z.unknown());


// Base schema that all API responses extend from
const apiResponseBaseSchema = z.object({
  success: transforms.fromString.boolean,
  custid: z.string().optional(),
  shrimp: z.string().optional().default(''),
});

// Base response schema with more flexible type inference
// was: createApiResponseSchema
export const createApiResponseSchema = <
  TRecord extends z.ZodTypeAny,
  TDetails extends z.ZodTypeAny | undefined = undefined
>({ recordSchema, detailsSchema }: SchemaOptions<TRecord, TDetails>) => {
  return apiResponseBaseSchema.extend({
    record: recordSchema,
    details: resolveDetailsSchema(detailsSchema).optional(),
  });
};

// was: createRecordsResponseSchema
export const createApiListResponseSchema = <
  TRecord extends z.ZodTypeAny,
  TDetails extends z.ZodTypeAny | undefined = undefined
>({ recordSchema, detailsSchema }: SchemaOptions<TRecord, TDetails>) => {
  return apiResponseBaseSchema.extend({
    records: z.array(recordSchema),
    details: resolveDetailsSchema(detailsSchema).optional(),
    count: transforms.fromString.number.optional(),
  });
};

// Common error response schema
export const apiErrorResponseSchema = apiResponseBaseSchema.extend({
  message: z.string(),
  code: transforms.fromString.number,
  record: z.unknown().nullable(),
  details: z.record(z.string(), z.unknown()).optional(),
});

// Type exports for API responses
export type ApiBaseResponse = z.infer<typeof apiResponseBaseSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type ApiRecordResponse<T> = z.infer<ReturnType<typeof createApiResponseSchema<z.ZodType<T>>>>;
export type ApiRecordsResponse<T> = z.infer<ReturnType<typeof createApiListResponseSchema<z.ZodType<T>>>>;
