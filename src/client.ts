// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { uploadThumbClient } from './services/upload-thumb/upload-thumb.shared'
export type {
  UploadThumb,
  UploadThumbData,
  UploadThumbQuery,
  UploadThumbPatch
} from './services/upload-thumb/upload-thumb.shared'

import { uploadItemClient } from './services/upload-item/upload-item.shared'
export type {
  UploadItem,
  UploadItemData,
  UploadItemQuery,
  UploadItemPatch
} from './services/upload-item/upload-item.shared'

import { uploadFilesClient } from './services/upload-files/upload-files.shared'
export type {
  UploadFiles,
  UploadFilesData,
  UploadFilesQuery,
  UploadFilesPatch
} from './services/upload-files/upload-files.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

import { attributesClient } from './services/attributes/attributes.shared'
export type {
  Attributes,
  AttributesData,
  AttributesQuery,
  AttributesPatch
} from './services/attributes/attributes.shared'

import { modelAttributesClient } from './services/model-attributes/model-attributes.shared'
export type {
  ModelAttributes,
  ModelAttributesData,
  ModelAttributesQuery,
  ModelAttributesPatch
} from './services/model-attributes/model-attributes.shared'

import { modelFilesClient } from './services/model-files/model-files.shared'
export type {
  ModelFiles,
  ModelFilesData,
  ModelFilesQuery,
  ModelFilesPatch
} from './services/model-files/model-files.shared'

import { modelsClient } from './services/models/models.shared'
export type { Models, ModelsData, ModelsQuery, ModelsPatch } from './services/models/models.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the decoration-file-service app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(modelsClient)
  client.configure(modelFilesClient)
  client.configure(modelAttributesClient)
  client.configure(attributesClient)
  client.configure(userClient)
  client.configure(uploadFilesClient)
  client.configure(uploadItemClient)
  client.configure(uploadThumbClient)
  return client
}
