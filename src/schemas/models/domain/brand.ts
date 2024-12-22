// src/schemas/models/domain/brand.ts

import { transforms } from '@/utils/transforms';
import { z } from 'zod';

/**
 * @fileoverview Brand settings schema for API transformation boundaries
 *
 * Model Organization:
 * While Brand is a nested model of Domain, it exists as a separate file because:
 * 1. It has distinct validation rules and complex type definitions
 * 2. It maintains separation of concerns and code organization
 * 3. It allows direct imports of Brand-specific logic where needed
 * 4. It keeps Domain model focused on core domain logic
 *
 */

// 1. Base enums
enum FontFamily {
  SANS = 'sans',
  SERIF = 'serif',
  MONO = 'mono'
}

enum CornerStyle {
  ROUNDED = 'rounded',
  PILL = 'pill',
  SQUARE = 'square'
}

// 2. Options arrays
const fontOptions = Object.values(FontFamily) as [string, ...string[]];
const cornerStyleOptions = Object.values(CornerStyle) as [string, ...string[]];

// 3. Display maps
const fontDisplayMap: Record<FontFamily, string> = {
  [FontFamily.SANS]: 'Sans Serif',
  [FontFamily.SERIF]: 'Serif',
  [FontFamily.MONO]: 'Monospace'
};

const cornerStyleDisplayMap: Record<CornerStyle, string> = {
  [CornerStyle.ROUNDED]: 'Rounded',
  [CornerStyle.PILL]: 'Pill Shape',
  [CornerStyle.SQUARE]: 'Square'
};

// 4. Icon maps
const fontIconMap: Record<FontFamily, string> = {
  [FontFamily.SANS]: 'ph:text-aa-bold',
  [FontFamily.SERIF]: 'ph:text-t-bold',
  [FontFamily.MONO]: 'ph:code'
};

const cornerStyleIconMap: Record<CornerStyle, string> = {
  [CornerStyle.ROUNDED]: 'tabler:border-corner-rounded',
  [CornerStyle.PILL]: 'tabler:border-corner-pill',
  [CornerStyle.SQUARE]: 'tabler:border-corner-square'
};


export const brandSettingschema = z.object({
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  colour: z.string().optional(),
  instructions_pre_reveal: z.string().optional(),
  instructions_reveal: z.string().optional(),
  instructions_post_reveal: z.string().optional(),
  description: z.string().optional(),
  button_text_light: transforms.fromString.boolean.default(false),
  allow_public_homepage: transforms.fromString.boolean.default(false),
  allow_public_api: transforms.fromString.boolean.default(false),
  font_family: z.enum(fontOptions).optional(),
  corner_style: z.enum(cornerStyleOptions).optional(),
});

export const imagePropsSchema = z.object({
  encoded: z.string().optional(),
  content_type: z.string().optional(),
  filename: z.string().optional(),
  bytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  ratio: z.number().optional(),
}).strip();

export type BrandSettings = z.infer<typeof brandSettingschema>;
export type ImageProps = z.infer<typeof imagePropsSchema>;

export {
  CornerStyle,
  cornerStyleDisplayMap,
  cornerStyleIconMap,
  cornerStyleOptions,
  fontDisplayMap,
  FontFamily,
  fontIconMap,
  fontOptions,
};
