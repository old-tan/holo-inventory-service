// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { UploadItem, UploadItemData, UploadItemPatch, UploadItemQuery } from './upload-item.schema'

export type { UploadItem, UploadItemData, UploadItemPatch, UploadItemQuery }

export interface UploadItemServiceOptions {
  app: Application
}

export interface UploadItemParams extends Params<UploadItemQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UploadItemService<ServiceParams extends UploadItemParams = UploadItemParams>
  implements ServiceInterface<UploadItem, UploadItemData, ServiceParams, UploadItemPatch>
{
  constructor(public options: UploadItemServiceOptions) {}

  async find(_params?: ServiceParams): Promise<UploadItem[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<UploadItem> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: UploadItemData, params?: ServiceParams): Promise<UploadItem>
  async create(data: UploadItemData[], params?: ServiceParams): Promise<UploadItem[]>
  async create(
    data: UploadItemData | UploadItemData[],
    params?: ServiceParams
  ): Promise<UploadItem | UploadItem[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: UploadItemData, _params?: ServiceParams): Promise<UploadItem> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: UploadItemPatch, _params?: ServiceParams): Promise<UploadItem> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<UploadItem> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
