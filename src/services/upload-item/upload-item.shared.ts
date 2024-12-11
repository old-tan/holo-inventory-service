// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  UploadItem,
  UploadItemData,
  UploadItemPatch,
  UploadItemQuery,
  UploadItemService
} from './upload-item.class'

export type { UploadItem, UploadItemData, UploadItemPatch, UploadItemQuery }

export type UploadItemClientService = Pick<
  UploadItemService<Params<UploadItemQuery>>,
  (typeof uploadItemMethods)[number]
>

export const uploadItemPath = 'upload-item'

export const uploadItemMethods: Array<keyof UploadItemService> = ['find', 'get', 'create', 'patch', 'remove']

export const uploadItemClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(uploadItemPath, connection.service(uploadItemPath), {
    methods: uploadItemMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [uploadItemPath]: UploadItemClientService
  }
}
