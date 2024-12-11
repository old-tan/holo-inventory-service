// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import multer from '@koa/multer'
import path from 'path'

import type { Application } from '../../declarations'
import { UploadFilesService, getOptions } from './upload-files.class'
import { uploadFilesPath, uploadFilesMethods } from './upload-files.shared'

import { extractZipWithCleanup } from '../../hooks/zip-cleanup'

export * from './upload-files.class'
export * from './upload-files.schema'

const folderPath = path.resolve(__dirname + '/../../../uploads/')
const publicFolder = path.join(__dirname, '../../../temFiles/')

const multipartMiddleware = multer({
  storage: multer.diskStorage({
    destination: folderPath,
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${req.body.model_id}`)
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
          const reqBody = (context.request as any).body
          const { model_id } = reqBody
          const file = (context.request as any).file

          const modelFilesService = app.service('model-files')

          // unzip ZIP file with cleabup .DS_Store | __MACOSX & get flat file path
          const extractPath = path.join(publicFolder, file.filename.replace('.zip', ''))
          const curFilePaths = await extractZipWithCleanup(file.path, extractPath)

          // clear all model-files by model_id
          await modelFilesService.remove(null, {
            adapter: {
              multi: true
            },
            query: {
              model_id
            }
          })
          // create/update model-files
          for (const filePath of curFilePaths) {
            const fileName = filePath.split('/').pop()
            await modelFilesService.create({
              model_id,
              file_name: fileName,
              aliases: '',
              thumb: '',
              // zip: `/uploads/${file.filename}`,
              // zipMd5: md5,
              modelFolder: `/temFiles/${file.filename.replace('.zip', '')}`,
              url: filePath
            })
          }

          // find model files by model_id
          const modelFiles = (await modelFilesService.find({
            query: { model_id },
            paginate: false // 禁用分页以获取所有匹配记录
          })) as unknown as {
            id: string
            model_id: string
            file_name: string
            url: string
            created_at: string
            updated_at: string
          }[] // 强制设置 TypeScript 类型

          context.request.body = {
            modelFiles: [...modelFiles]
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

// calc MD5 by crypto [去掉]
// const zipFilePath = path.join(folderPath, file.filename)
// const fileBuffer = await fs.promises.readFile(zipFilePath)
// const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex')
