// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ModelFiles,
  ModelFilesData,
  ModelFilesPatch,
  ModelFilesQuery,
  ModelFilesService
} from './model-files.class'

export type { ModelFiles, ModelFilesData, ModelFilesPatch, ModelFilesQuery }

export type ModelFilesClientService = Pick<
  ModelFilesService<Params<ModelFilesQuery>>,
  (typeof modelFilesMethods)[number]
>

export const modelFilesPath = 'model-files'

export const modelFilesMethods: Array<keyof ModelFilesService> = ['find', 'get', 'create', 'patch', 'remove']

export const modelFilesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(modelFilesPath, connection.service(modelFilesPath), {
    methods: modelFilesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [modelFilesPath]: ModelFilesClientService
  }
}
