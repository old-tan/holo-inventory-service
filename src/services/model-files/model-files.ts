// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import dayjs from 'dayjs'
import type { Application, HookContext } from '../../declarations'
import { ModelFilesService, getOptions } from './model-files.class'
import { modelFilesPath, modelFilesMethods } from './model-files.shared'

export * from './model-files.class'
export * from './model-files.schema'

import { removeFile } from '../../hooks/model-files/remove-file'
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
      all: []
    },
    before: {
      all: [],
      get: [],
      create: [],
      update: [],
      remove: [
        async (context: HookContext) => {
          const id = String(context.id)
          if (id !== 'null') {
            removeFile(context)
          }
        }
      ]
    },
    after: {
      all: [],
      find: []
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
