// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  ModelAttributes,
  ModelAttributesData,
  ModelAttributesPatch,
  ModelAttributesQuery
} from './model-attributes.schema'

export type { ModelAttributes, ModelAttributesData, ModelAttributesPatch, ModelAttributesQuery }

export interface ModelAttributesParams extends KnexAdapterParams<ModelAttributesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ModelAttributesService<ServiceParams extends Params = ModelAttributesParams> extends KnexService<
  ModelAttributes,
  ModelAttributesData,
  ModelAttributesParams,
  ModelAttributesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'model-attributes'
  }
}
