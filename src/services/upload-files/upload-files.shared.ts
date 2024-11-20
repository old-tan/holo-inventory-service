// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  UploadFiles,
  UploadFilesData,
  UploadFilesPatch,
  UploadFilesQuery,
  UploadFilesService
} from './upload-files.class'

export type { UploadFiles, UploadFilesData, UploadFilesPatch, UploadFilesQuery }

export type UploadFilesClientService = Pick<
  UploadFilesService<Params<UploadFilesQuery>>,
  (typeof uploadFilesMethods)[number]
>

export const uploadFilesPath = 'upload-files'

export const uploadFilesMethods: Array<keyof UploadFilesService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const uploadFilesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(uploadFilesPath, connection.service(uploadFilesPath), {
    methods: uploadFilesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [uploadFilesPath]: UploadFilesClientService
  }
}
