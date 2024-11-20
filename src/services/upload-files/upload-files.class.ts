// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { UploadFiles, UploadFilesData, UploadFilesPatch, UploadFilesQuery } from './upload-files.schema'

export type { UploadFiles, UploadFilesData, UploadFilesPatch, UploadFilesQuery }

export interface UploadFilesServiceOptions {
  app: Application
}

export interface UploadFilesParams extends Params<UploadFilesQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UploadFilesService<ServiceParams extends UploadFilesParams = UploadFilesParams>
  implements ServiceInterface<UploadFiles, UploadFilesData, ServiceParams, UploadFilesPatch>
{
  constructor(public options: UploadFilesServiceOptions) {}

  async find(_params?: ServiceParams): Promise<UploadFiles[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<UploadFiles> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: UploadFilesData, params?: ServiceParams): Promise<UploadFiles>
  async create(data: UploadFilesData[], params?: ServiceParams): Promise<UploadFiles[]>
  async create(
    data: UploadFilesData | UploadFilesData[],
    params?: ServiceParams
  ): Promise<UploadFiles | UploadFiles[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: UploadFilesData, _params?: ServiceParams): Promise<UploadFiles> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: UploadFilesPatch, _params?: ServiceParams): Promise<UploadFiles> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<UploadFiles> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
