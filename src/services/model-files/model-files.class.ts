// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { ModelFiles, ModelFilesData, ModelFilesPatch, ModelFilesQuery } from './model-files.schema'

export type { ModelFiles, ModelFilesData, ModelFilesPatch, ModelFilesQuery }

export interface ModelFilesParams extends KnexAdapterParams<ModelFilesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ModelFilesService<ServiceParams extends Params = ModelFilesParams> extends KnexService<
  ModelFiles,
  ModelFilesData,
  ModelFilesParams,
  ModelFilesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'model-files'
  }
}
