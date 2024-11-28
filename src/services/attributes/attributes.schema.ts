// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { AttributesService } from './attributes.class'

// Main data model schema
export const attributesSchema = Type.Object(
  {
    id: Type.Number(),
    key: Type.String(),
    value: Type.String()
  },
  { $id: 'Attributes', additionalProperties: false }
)
export type Attributes = Static<typeof attributesSchema>
export const attributesValidator = getValidator(attributesSchema, dataValidator)
export const attributesResolver = resolve<Attributes, HookContext<AttributesService>>({})

export const attributesExternalResolver = resolve<Attributes, HookContext<AttributesService>>({})

// Schema for creating new entries
export const attributesDataSchema = Type.Pick(attributesSchema, ['key', 'value'], {
  $id: 'AttributesData'
})
export type AttributesData = Static<typeof attributesDataSchema>
export const attributesDataValidator = getValidator(attributesDataSchema, dataValidator)
export const attributesDataResolver = resolve<Attributes, HookContext<AttributesService>>({})

// Schema for updating existing entries
export const attributesPatchSchema = Type.Partial(attributesSchema, {
  $id: 'AttributesPatch'
})
export type AttributesPatch = Static<typeof attributesPatchSchema>
export const attributesPatchValidator = getValidator(attributesPatchSchema, dataValidator)
export const attributesPatchResolver = resolve<Attributes, HookContext<AttributesService>>({})

// Schema for allowed query properties
export const attributesQueryProperties = Type.Pick(attributesSchema, ['id', 'key', 'value'])
export const attributesQuerySchema = Type.Intersect(
  [
    querySyntax(attributesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type AttributesQuery = Static<typeof attributesQuerySchema>
export const attributesQueryValidator = getValidator(attributesQuerySchema, queryValidator)
export const attributesQueryResolver = resolve<AttributesQuery, HookContext<AttributesService>>({})
