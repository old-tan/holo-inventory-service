// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UploadThumbService } from './upload-thumb.class'

// Main data model schema
export const uploadThumbSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'UploadThumb', additionalProperties: false }
)
export type UploadThumb = Static<typeof uploadThumbSchema>
export const uploadThumbValidator = getValidator(uploadThumbSchema, dataValidator)
export const uploadThumbResolver = resolve<UploadThumb, HookContext<UploadThumbService>>({})

export const uploadThumbExternalResolver = resolve<UploadThumb, HookContext<UploadThumbService>>({})

// Schema for creating new entries
export const uploadThumbDataSchema = Type.Pick(uploadThumbSchema, ['text'], {
  $id: 'UploadThumbData'
})
export type UploadThumbData = Static<typeof uploadThumbDataSchema>
export const uploadThumbDataValidator = getValidator(uploadThumbDataSchema, dataValidator)
export const uploadThumbDataResolver = resolve<UploadThumb, HookContext<UploadThumbService>>({})

// Schema for updating existing entries
export const uploadThumbPatchSchema = Type.Partial(uploadThumbSchema, {
  $id: 'UploadThumbPatch'
})
export type UploadThumbPatch = Static<typeof uploadThumbPatchSchema>
export const uploadThumbPatchValidator = getValidator(uploadThumbPatchSchema, dataValidator)
export const uploadThumbPatchResolver = resolve<UploadThumb, HookContext<UploadThumbService>>({})

// Schema for allowed query properties
export const uploadThumbQueryProperties = Type.Pick(uploadThumbSchema, ['id', 'text'])
export const uploadThumbQuerySchema = Type.Intersect(
  [
    querySyntax(uploadThumbQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UploadThumbQuery = Static<typeof uploadThumbQuerySchema>
export const uploadThumbQueryValidator = getValidator(uploadThumbQuerySchema, queryValidator)
export const uploadThumbQueryResolver = resolve<UploadThumbQuery, HookContext<UploadThumbService>>({})
