// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Uploads, UploadsData, UploadsPatch, UploadsQuery } from './uploads.schema'

export type { Uploads, UploadsData, UploadsPatch, UploadsQuery }

export interface UploadsParams extends KnexAdapterParams<UploadsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UploadsService<ServiceParams extends Params = UploadsParams> extends KnexService<
  Uploads,
  UploadsData,
  UploadsParams,
  UploadsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'uploads'
  }
}
