// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  attributesDataValidator,
  attributesPatchValidator,
  attributesQueryValidator,
  attributesResolver,
  attributesExternalResolver,
  attributesDataResolver,
  attributesPatchResolver,
  attributesQueryResolver
} from './attributes.schema'

import type { Application } from '../../declarations'
import { AttributesService, getOptions } from './attributes.class'
import { attributesPath, attributesMethods } from './attributes.shared'

export * from './attributes.class'
export * from './attributes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const attributes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(attributesPath, new AttributesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: attributesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(attributesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(attributesExternalResolver),
        schemaHooks.resolveResult(attributesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(attributesQueryValidator),
        schemaHooks.resolveQuery(attributesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(attributesDataValidator),
        schemaHooks.resolveData(attributesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(attributesPatchValidator),
        schemaHooks.resolveData(attributesPatchResolver)
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
    [attributesPath]: AttributesService
  }
}
