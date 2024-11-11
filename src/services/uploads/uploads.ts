// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  uploadsDataValidator,
  uploadsPatchValidator,
  uploadsQueryValidator,
  uploadsResolver,
  uploadsExternalResolver,
  uploadsDataResolver,
  uploadsPatchResolver,
  uploadsQueryResolver
} from './uploads.schema'

import type { Application } from '../../declarations'
import { UploadsService, getOptions } from './uploads.class'
import { uploadsPath, uploadsMethods } from './uploads.shared'

export * from './uploads.class'
export * from './uploads.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const uploads = (app: Application) => {
  // Register our service on the Feathers application
  app.use(uploadsPath, new UploadsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uploadsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(uploadsPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(uploadsExternalResolver),
        schemaHooks.resolveResult(uploadsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(uploadsQueryValidator), schemaHooks.resolveQuery(uploadsQueryResolver)],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(uploadsDataValidator),
        schemaHooks.resolveData(uploadsDataResolver),
        async (context) => {
          console.log('context---', context)
        }
      ],
      patch: [schemaHooks.validateData(uploadsPatchValidator), schemaHooks.resolveData(uploadsPatchResolver)],
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
    [uploadsPath]: UploadsService
  }
}
