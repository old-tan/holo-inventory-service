// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import multer from '@koa/multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'
// import fs from 'fs/promises'

import type { Application } from '../../declarations'
import { UploadItemService, getOptions } from './upload-item.class'
import { uploadItemPath, uploadItemMethods } from './upload-item.shared'

export * from './upload-item.class'
export * from './upload-item.schema'

const folderPath = path.resolve(__dirname + '/../../../uploads/')
const publicFolder = path.join(__dirname, '../../../temFiles/')

const multipartMiddleware = multer({
  storage: multer.diskStorage({
    destination: folderPath,
    filename: (req: any, file: any, cb: any) => {
      console.log('req---', req.body)
      // console.log('file---', file)
      // console.log('filename---', `${req.body.model_id}.${file.originalname}`)
      // crypto.randomBytes(16, function (err, raw) {
      //   cb(err, err ? undefined : `${raw.toString('hex')}.${file.originalname}`)
      // })
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
          const modelFolder = path.join('tempFiles', model_id)
          const url = path.join('temFiles', model_id, subPath, file.originalname)
          const modelFilesService = app.service('model-files')
          try {
            // 读取文件内容
            const data = fs.readFileSync(file.path)
            // 写入文件
            fs.writeFileSync(writePath, data, { flag: 'wx' })
            // console.log('File written successfully to', writePath)

            const curItem = await modelFilesService.create({
              model_id,
              file_name: file.originalname,
              aliases: '',
              thumb: '',
              modelFolder,
              url
            })

            // 返回文件信息
            context.request.body = {
              ...curItem
            }
          } catch (error) {
            // 返回错误信息
            context.status = 400
            context.body = {
              error
            }

            return // 终止请求处理
          }

          await next()
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
