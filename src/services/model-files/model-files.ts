// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  modelFilesDataValidator,
  modelFilesPatchValidator,
  modelFilesQueryValidator,
  modelFilesResolver,
  modelFilesExternalResolver,
  modelFilesDataResolver,
  modelFilesPatchResolver,
  modelFilesQueryResolver
} from './model-files.schema'

import type { Application } from '../../declarations'
import { ModelFilesService, getOptions } from './model-files.class'
import { modelFilesPath, modelFilesMethods } from './model-files.shared'

export * from './model-files.class'
export * from './model-files.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const modelFiles = (app: Application) => {
  // Register our service on the Feathers application
  app.use(modelFilesPath, new ModelFilesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: modelFilesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(modelFilesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(modelFilesExternalResolver),
        schemaHooks.resolveResult(modelFilesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(modelFilesQueryValidator),
        schemaHooks.resolveQuery(modelFilesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(modelFilesDataValidator),
        schemaHooks.resolveData(modelFilesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(modelFilesPatchValidator),
        schemaHooks.resolveData(modelFilesPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [modelFilesPath]: ModelFilesService
  }
}
