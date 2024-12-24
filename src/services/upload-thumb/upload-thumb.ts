// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import multer from '@koa/multer'
import path from 'path'
import fs from 'fs'
import dayjs from 'dayjs'

import type { Application } from '../../declarations'
import { UploadThumbService, getOptions } from './upload-thumb.class'
import { uploadThumbPath, uploadThumbMethods } from './upload-thumb.shared'

export * from './upload-thumb.class'
export * from './upload-thumb.schema'

import sharp from 'sharp'

const thumbPath = path.join(__dirname, '../../../model_thumbs/')
const tempPath = path.resolve(__dirname, '../../../uploads')
const multipartMiddleware = multer({
  storage: multer.diskStorage({
    destination: tempPath,
    filename: (req: any, file: any, cb: any) => {
      const extension = file.mimetype.split('/')[1]
      cb(null, `${req.body.model_id}.${extension}`)
    }
  })
})
// A configure function that registers the service and its hooks via `app.configure`
export const uploadThumb = (app: Application) => {
  // Register our service on the Feathers application
  app.use(uploadThumbPath, new UploadThumbService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uploadThumbMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      before: [
        multipartMiddleware.single('file'),
        async (context, next) => {
          const reqBody = (context.request as any).body
          const { model_id } = reqBody
          const file = (context.request as any).file
          const inputFilePath = path.resolve(tempPath, file.filename) // 上传文件路径
          const outputFilePath = path.resolve(thumbPath, `${model_id}.webp`) // 目标存储路径
          try {
            // 使用 sharp 裁剪并保存文件
            const res = await sharp(inputFilePath).resize(640, 480).toFormat('webp').toFile(outputFilePath)
            // 删除临时文件（可选）
            fs.unlinkSync(inputFilePath)

            // 更新model thumb
            const modelsService = app.service('models')
            const currentModel = await modelsService.patch(model_id, {
              thumb: `/thumbs/${model_id}.webp?${dayjs().valueOf()}`
            })
            context.request.body = {
              ...currentModel
            }
          } catch (error) {
            console.error('Error processing image:', error)
          }
          next()
        }
      ]
    }
  })
  // Initialize hooks
  app.service(uploadThumbPath).hooks({
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
    [uploadThumbPath]: UploadThumbService
  }
}
