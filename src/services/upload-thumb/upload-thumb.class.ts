// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { UploadThumb, UploadThumbData, UploadThumbPatch, UploadThumbQuery } from './upload-thumb.schema'

export type { UploadThumb, UploadThumbData, UploadThumbPatch, UploadThumbQuery }

export interface UploadThumbServiceOptions {
  app: Application
}

export interface UploadThumbParams extends Params<UploadThumbQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UploadThumbService<ServiceParams extends UploadThumbParams = UploadThumbParams>
  implements ServiceInterface<UploadThumb, UploadThumbData, ServiceParams, UploadThumbPatch>
{
  constructor(public options: UploadThumbServiceOptions) {}

  async find(_params?: ServiceParams): Promise<UploadThumb[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<UploadThumb> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: UploadThumbData, params?: ServiceParams): Promise<UploadThumb>
  async create(data: UploadThumbData[], params?: ServiceParams): Promise<UploadThumb[]>
  async create(
    data: UploadThumbData | UploadThumbData[],
    params?: ServiceParams
  ): Promise<UploadThumb | UploadThumb[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: UploadThumbData, _params?: ServiceParams): Promise<UploadThumb> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: UploadThumbPatch, _params?: ServiceParams): Promise<UploadThumb> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<UploadThumb> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
