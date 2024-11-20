import { uploadFiles } from './upload-files/upload-files'
import { user } from './users/users'
import { attributes } from './attributes/attributes'
import { modelAttributes } from './model-attributes/model-attributes'
import { modelFiles } from './model-files/model-files'
import { models } from './models/models'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(uploadFiles)
  app.configure(user)
  app.configure(attributes)
  app.configure(modelAttributes)
  app.configure(modelFiles)
  app.configure(models)
  // All services will be registered here
}
