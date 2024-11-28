// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ModelFilesService } from './model-files.class'

// Main data model schema
export const modelFilesSchema = Type.Object(
  {
    id: Type.String(),
    model_id: Type.String(),
    file_name: Type.String(),
    url: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String()
  },
  { $id: 'ModelFiles', additionalProperties: false }
)
export type ModelFiles = Static<typeof modelFilesSchema>
export const modelFilesValidator = getValidator(modelFilesSchema, dataValidator)
export const modelFilesResolver = resolve<ModelFiles, HookContext<ModelFilesService>>({})

export const modelFilesExternalResolver = resolve<ModelFiles, HookContext<ModelFilesService>>({})

// Schema for creating new entries
export const modelFilesDataSchema = Type.Pick(modelFilesSchema, ['model_id', 'file_name', 'url'], {
  $id: 'ModelFilesData'
})
export type ModelFilesData = Static<typeof modelFilesDataSchema>
export const modelFilesDataValidator = getValidator(modelFilesDataSchema, dataValidator)
export const modelFilesDataResolver = resolve<ModelFiles, HookContext<ModelFilesService>>({})

// Schema for updating existing entries
export const modelFilesPatchSchema = Type.Partial(modelFilesSchema, {
  $id: 'ModelFilesPatch'
})
export type ModelFilesPatch = Static<typeof modelFilesPatchSchema>
export const modelFilesPatchValidator = getValidator(modelFilesPatchSchema, dataValidator)
export const modelFilesPatchResolver = resolve<ModelFiles, HookContext<ModelFilesService>>({})

// Schema for allowed query properties
export const modelFilesQueryProperties = Type.Pick(modelFilesSchema, [
  // 'id',
  'model_id',
  'file_name',
  'url'
])
export const modelFilesQuerySchema = Type.Intersect(
  [
    querySyntax(modelFilesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ModelFilesQuery = Static<typeof modelFilesQuerySchema>
export const modelFilesQueryValidator = getValidator(modelFilesQuerySchema, queryValidator)
export const modelFilesQueryResolver = resolve<ModelFilesQuery, HookContext<ModelFilesService>>({})
