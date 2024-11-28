// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Models, ModelsData, ModelsPatch, ModelsQuery } from './models.schema'
import { Knex } from 'knex'

export type { Models, ModelsData, ModelsPatch, ModelsQuery }

export interface ModelsParams extends KnexAdapterParams<ModelsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ModelsService<ServiceParams extends Params = ModelsParams> extends KnexService<
  Models,
  ModelsData,
  ModelsParams,
  ModelsPatch
> {
  // createQuery(params?: ModelsParams | undefined): Knex.QueryBuilder<any, any> {
  //   const query = super.createQuery(params)
  //   query.leftJoin()
  // }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'models'
  }
}
