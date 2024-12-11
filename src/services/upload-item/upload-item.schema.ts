// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UploadItemService } from './upload-item.class'

// Main data model schema
export const uploadItemSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'UploadItem', additionalProperties: false }
)
export type UploadItem = Static<typeof uploadItemSchema>
export const uploadItemValidator = getValidator(uploadItemSchema, dataValidator)
export const uploadItemResolver = resolve<UploadItem, HookContext<UploadItemService>>({})

export const uploadItemExternalResolver = resolve<UploadItem, HookContext<UploadItemService>>({})

// Schema for creating new entries
export const uploadItemDataSchema = Type.Pick(uploadItemSchema, ['text'], {
  $id: 'UploadItemData'
})
export type UploadItemData = Static<typeof uploadItemDataSchema>
export const uploadItemDataValidator = getValidator(uploadItemDataSchema, dataValidator)
export const uploadItemDataResolver = resolve<UploadItem, HookContext<UploadItemService>>({})

// Schema for updating existing entries
export const uploadItemPatchSchema = Type.Partial(uploadItemSchema, {
  $id: 'UploadItemPatch'
})
export type UploadItemPatch = Static<typeof uploadItemPatchSchema>
export const uploadItemPatchValidator = getValidator(uploadItemPatchSchema, dataValidator)
export const uploadItemPatchResolver = resolve<UploadItem, HookContext<UploadItemService>>({})

// Schema for allowed query properties
export const uploadItemQueryProperties = Type.Pick(uploadItemSchema, ['id', 'text'])
export const uploadItemQuerySchema = Type.Intersect(
  [
    querySyntax(uploadItemQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UploadItemQuery = Static<typeof uploadItemQuerySchema>
export const uploadItemQueryValidator = getValidator(uploadItemQuerySchema, queryValidator)
export const uploadItemQueryResolver = resolve<UploadItemQuery, HookContext<UploadItemService>>({})
