// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import multer from '@koa/multer'
import path from 'path'
import fs from 'fs'
// import fs from 'fs/promises'

import type { Application } from '../../declarations'
import { UploadItemService, getOptions } from './upload-item.class'
import { uploadItemPath, uploadItemMethods } from './upload-item.shared'

export * from './upload-item.class'
export * from './upload-item.schema'

const folderPath = path.resolve(__dirname + '/../../../uploads/')
const publicFolder = path.join(__dirname, '../../../model_files/')

const multipartMiddleware = multer({
  storage: multer.diskStorage({
    destination: folderPath,
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${req.body.model_id}.${file.originalname}`)
    }
  })
})

// A configure function that registers the service and its hooks via `app.configure`
export const uploadItem = (app: Application) => {
  // Register our service on the Feathers application
  app.use(uploadItemPath, new UploadItemService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uploadItemMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      before: [
        multipartMiddleware.single('file'),
        async (context, next) => {
          const reqBody = (context.request as any).body
          const { model_id, subPath } = reqBody
          const file = (context.request as any).file

          const writePath = path.join(publicFolder, model_id, subPath, file.originalname)
          const modelFolder = path.join('files', model_id, subPath)
          const url = path.join(subPath, file.originalname)
          const modelFilesService = app.service('model-files')
          // 读取文件内容
          const data = fs.readFileSync(file.path)
          // 写入文件
          fs.writeFileSync(writePath, data, { flag: 'wx' })
          // console.log('File written successfully to', writePath)
          // 文件 size
          const stats = await fs.promises.stat(writePath)

          const curItem = await modelFilesService.create({
            model_id,
            file_name: file.originalname,
            aliases: '',
            modelFolder,
            url,
            size: stats.size
          })

          // 返回文件信息
          context.request.body = {
            ...curItem
          }

          next()
        }
      ]
    }
  })
  // Initialize hooks
  app.service(uploadItemPath).hooks({
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
    [uploadItemPath]: UploadItemService
  }
}
