// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Models, ModelsData, ModelsPatch, ModelsQuery, ModelsService } from './models.class'

export type { Models, ModelsData, ModelsPatch, ModelsQuery }

export type ModelsClientService = Pick<ModelsService<Params<ModelsQuery>>, (typeof modelsMethods)[number]>

export const modelsPath = 'models'

export const modelsMethods: Array<keyof ModelsService> = [
  'find',
  'get',
  'create',
  'patch',
  'update',
  'remove'
]

export const modelsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(modelsPath, connection.service(modelsPath), {
    methods: modelsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [modelsPath]: ModelsClientService
  }
}
