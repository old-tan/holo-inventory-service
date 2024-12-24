// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  UploadThumb,
  UploadThumbData,
  UploadThumbPatch,
  UploadThumbQuery,
  UploadThumbService
} from './upload-thumb.class'

export type { UploadThumb, UploadThumbData, UploadThumbPatch, UploadThumbQuery }

export type UploadThumbClientService = Pick<
  UploadThumbService<Params<UploadThumbQuery>>,
  (typeof uploadThumbMethods)[number]
>

export const uploadThumbPath = 'upload-thumb'

export const uploadThumbMethods: Array<keyof UploadThumbService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const uploadThumbClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(uploadThumbPath, connection.service(uploadThumbPath), {
    methods: uploadThumbMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [uploadThumbPath]: UploadThumbClientService
  }
}
