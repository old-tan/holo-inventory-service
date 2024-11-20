// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Attributes,
  AttributesData,
  AttributesPatch,
  AttributesQuery,
  AttributesService
} from './attributes.class'

export type { Attributes, AttributesData, AttributesPatch, AttributesQuery }

export type AttributesClientService = Pick<
  AttributesService<Params<AttributesQuery>>,
  (typeof attributesMethods)[number]
>

export const attributesPath = 'attributes'

export const attributesMethods: Array<keyof AttributesService> = ['find', 'get', 'create', 'patch', 'remove']

export const attributesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(attributesPath, connection.service(attributesPath), {
    methods: attributesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [attributesPath]: AttributesClientService
  }
}
