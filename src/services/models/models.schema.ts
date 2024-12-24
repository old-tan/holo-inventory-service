// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ModelsService } from './models.class'

// Main data model schema
export const modelsSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    thumb: Type.String(),
    project_url: Type.String(),
    project_name: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String()
  },
  { $id: 'Models', additionalProperties: false }
)
export type Models = Static<typeof modelsSchema>
export const modelsValidator = getValidator(modelsSchema, dataValidator)
export const modelsResolver = resolve<Models, HookContext<ModelsService>>({})

export const modelsExternalResolver = resolve<Models, HookContext<ModelsService>>({})

// Schema for creating new entries
export const modelsDataSchema = Type.Pick(modelsSchema, ['name', 'thumb', 'project_url', 'project_name'], {
  $id: 'ModelsData'
})
// Type.Object({
//   name: Type.String(),
//   tags: Type.Array(Type.String())
// })

export type ModelsData = Static<typeof modelsDataSchema>
export const modelsDataValidator = getValidator(modelsDataSchema, dataValidator)
export const modelsDataResolver = resolve<Models, HookContext<ModelsService>>({})

// Schema for updating existing entries
export const modelsPatchSchema = Type.Partial(modelsSchema, {
  $id: 'ModelsPatch'
})
export type ModelsPatch = Static<typeof modelsPatchSchema>
export const modelsPatchValidator = getValidator(modelsPatchSchema, dataValidator)
export const modelsPatchResolver = resolve<Models, HookContext<ModelsService>>({})

// Schema for allowed query properties
export const modelsQueryProperties = Type.Pick(modelsSchema, [
  'id',
  'name',
  'thumb',
  'project_url',
  'project_name'
])
export const modelsQuerySchema = Type.Intersect(
  [
    querySyntax(modelsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ModelsQuery = Static<typeof modelsQuerySchema>
export const modelsQueryValidator = getValidator(modelsQuerySchema, queryValidator)
export const modelsQueryResolver = resolve<ModelsQuery, HookContext<ModelsService>>({})
