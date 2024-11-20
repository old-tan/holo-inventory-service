// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UploadFilesService } from './upload-files.class'

// Main data model schema
export const uploadFilesSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'UploadFiles', additionalProperties: false }
)
export type UploadFiles = Static<typeof uploadFilesSchema>
export const uploadFilesValidator = getValidator(uploadFilesSchema, dataValidator)
export const uploadFilesResolver = resolve<UploadFiles, HookContext<UploadFilesService>>({})

export const uploadFilesExternalResolver = resolve<UploadFiles, HookContext<UploadFilesService>>({})

// Schema for creating new entries
export const uploadFilesDataSchema = Type.Pick(uploadFilesSchema, ['text'], {
  $id: 'UploadFilesData'
})
export type UploadFilesData = Static<typeof uploadFilesDataSchema>
export const uploadFilesDataValidator = getValidator(uploadFilesDataSchema, dataValidator)
export const uploadFilesDataResolver = resolve<UploadFiles, HookContext<UploadFilesService>>({})

// Schema for updating existing entries
export const uploadFilesPatchSchema = Type.Partial(uploadFilesSchema, {
  $id: 'UploadFilesPatch'
})
export type UploadFilesPatch = Static<typeof uploadFilesPatchSchema>
export const uploadFilesPatchValidator = getValidator(uploadFilesPatchSchema, dataValidator)
export const uploadFilesPatchResolver = resolve<UploadFiles, HookContext<UploadFilesService>>({})

// Schema for allowed query properties
export const uploadFilesQueryProperties = Type.Pick(uploadFilesSchema, ['id', 'text'])
export const uploadFilesQuerySchema = Type.Intersect(
  [
    querySyntax(uploadFilesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UploadFilesQuery = Static<typeof uploadFilesQuerySchema>
export const uploadFilesQueryValidator = getValidator(uploadFilesQuerySchema, queryValidator)
export const uploadFilesQueryResolver = resolve<UploadFilesQuery, HookContext<UploadFilesService>>({})
