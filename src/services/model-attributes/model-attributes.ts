// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  modelAttributesDataValidator,
  modelAttributesPatchValidator,
  modelAttributesQueryValidator,
  modelAttributesResolver,
  modelAttributesExternalResolver,
  modelAttributesDataResolver,
  modelAttributesPatchResolver,
  modelAttributesQueryResolver
} from './model-attributes.schema'

import type { Application } from '../../declarations'
import { ModelAttributesService, getOptions } from './model-attributes.class'
import { modelAttributesPath, modelAttributesMethods } from './model-attributes.shared'

export * from './model-attributes.class'
export * from './model-attributes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const modelAttributes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(modelAttributesPath, new ModelAttributesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: modelAttributesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(modelAttributesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(modelAttributesExternalResolver),
        schemaHooks.resolveResult(modelAttributesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(modelAttributesQueryValidator),
        schemaHooks.resolveQuery(modelAttributesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(modelAttributesDataValidator),
        schemaHooks.resolveData(modelAttributesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(modelAttributesPatchValidator),
        schemaHooks.resolveData(modelAttributesPatchResolver)
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
    [modelAttributesPath]: ModelAttributesService
  }
}
