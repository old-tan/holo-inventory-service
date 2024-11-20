// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  modelsDataValidator,
  modelsPatchValidator,
  modelsQueryValidator,
  modelsResolver,
  modelsExternalResolver,
  modelsDataResolver,
  modelsPatchResolver,
  modelsQueryResolver
} from './models.schema'

import type { Application } from '../../declarations'
import { ModelsService, getOptions } from './models.class'
import { modelsPath, modelsMethods } from './models.shared'

// updatedAt hook
import { updatedAt } from '../../hooks/updated-at'

export * from './models.class'
export * from './models.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const models = (app: Application) => {
  // Register our service on the Feathers application
  app.use(modelsPath, new ModelsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: modelsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(modelsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(modelsExternalResolver), schemaHooks.resolveResult(modelsResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(modelsQueryValidator), schemaHooks.resolveQuery(modelsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(modelsDataValidator), schemaHooks.resolveData(modelsDataResolver)],
      patch: [schemaHooks.validateData(modelsPatchValidator), schemaHooks.resolveData(modelsPatchResolver)],
      update: [updatedAt],
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
    [modelsPath]: ModelsService
  }
}
