// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ModelAttributesService } from './model-attributes.class'

// Main data model schema
export const modelAttributesSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'ModelAttributes', additionalProperties: false }
)
export type ModelAttributes = Static<typeof modelAttributesSchema>
export const modelAttributesValidator = getValidator(modelAttributesSchema, dataValidator)
export const modelAttributesResolver = resolve<ModelAttributes, HookContext<ModelAttributesService>>({})

export const modelAttributesExternalResolver = resolve<ModelAttributes, HookContext<ModelAttributesService>>(
  {}
)

// Schema for creating new entries
export const modelAttributesDataSchema = Type.Pick(modelAttributesSchema, ['text'], {
  $id: 'ModelAttributesData'
})
export type ModelAttributesData = Static<typeof modelAttributesDataSchema>
export const modelAttributesDataValidator = getValidator(modelAttributesDataSchema, dataValidator)
export const modelAttributesDataResolver = resolve<ModelAttributes, HookContext<ModelAttributesService>>({})

// Schema for updating existing entries
export const modelAttributesPatchSchema = Type.Partial(modelAttributesSchema, {
  $id: 'ModelAttributesPatch'
})
export type ModelAttributesPatch = Static<typeof modelAttributesPatchSchema>
export const modelAttributesPatchValidator = getValidator(modelAttributesPatchSchema, dataValidator)
export const modelAttributesPatchResolver = resolve<ModelAttributes, HookContext<ModelAttributesService>>({})

// Schema for allowed query properties
export const modelAttributesQueryProperties = Type.Pick(modelAttributesSchema, ['id', 'text'])
export const modelAttributesQuerySchema = Type.Intersect(
  [
    querySyntax(modelAttributesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ModelAttributesQuery = Static<typeof modelAttributesQuerySchema>
export const modelAttributesQueryValidator = getValidator(modelAttributesQuerySchema, queryValidator)
export const modelAttributesQueryResolver = resolve<
  ModelAttributesQuery,
  HookContext<ModelAttributesService>
>({})
