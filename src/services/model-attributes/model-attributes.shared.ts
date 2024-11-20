// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ModelAttributes,
  ModelAttributesData,
  ModelAttributesPatch,
  ModelAttributesQuery,
  ModelAttributesService
} from './model-attributes.class'

export type { ModelAttributes, ModelAttributesData, ModelAttributesPatch, ModelAttributesQuery }

export type ModelAttributesClientService = Pick<
  ModelAttributesService<Params<ModelAttributesQuery>>,
  (typeof modelAttributesMethods)[number]
>

export const modelAttributesPath = 'model-attributes'

export const modelAttributesMethods: Array<keyof ModelAttributesService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const modelAttributesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(modelAttributesPath, connection.service(modelAttributesPath), {
    methods: modelAttributesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [modelAttributesPath]: ModelAttributesClientService
  }
}
