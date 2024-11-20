// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import multer from '@koa/multer'
import path from 'path'
import crypto from 'crypto'

import type { Application } from '../../declarations'
import { UploadFilesService, getOptions } from './upload-files.class'
import { uploadFilesPath, uploadFilesMethods } from './upload-files.shared'

export * from './upload-files.class'
export * from './upload-files.schema'

const folderPath = path.resolve(__dirname + '/../../../uploads/')
const multipartMiddleware = multer({
  storage: multer.diskStorage({
    destination: folderPath,
    filename: (_: any, file: any, cb: any) => {
      crypto.randomBytes(16, function (err, raw) {
        cb(err, err ? undefined : `${raw.toString('hex')}.${file.originalname}`)
      })
    }
  })
})

// A configure function that registers the service and its hooks via `app.configure`
export const uploadFiles = (app: Application) => {
  // Register our service on the Feathers application
  app.use(uploadFilesPath, new UploadFilesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uploadFilesMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      before: [
        multipartMiddleware.single('uri'),
        async (context, next) => {
          const file = (context.request as any).file
          console.log('file', file)
          context.request.body = {
            uri: `/uploads/${file.filename}`,
            filename: file.originalname,
            id: file.filename
          }
          next()
        }
      ]
    }
  })
  // Initialize hooks
  app.service(uploadFilesPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
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
    [uploadFilesPath]: UploadFilesService
  }
}
