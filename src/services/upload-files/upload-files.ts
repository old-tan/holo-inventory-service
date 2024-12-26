// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import multer from '@koa/multer'
import path from 'path'

import type { Application } from '../../declarations'
import { UploadFilesService, getOptions } from './upload-files.class'
import { uploadFilesPath, uploadFilesMethods } from './upload-files.shared'

import { extractZipWithCleanup } from '../../hooks/zip-cleanup'
import { buildTreeByFlatData } from '../../hooks/generate-tree'

export * from './upload-files.class'
export * from './upload-files.schema'

const modelFilePath = path.join(__dirname, '../../../model_files/')
const modelZipPath = path.resolve(__dirname + '/../../../uploads/')
const projectPath = path.join(__dirname, '../../../model_projects/')

const multipartMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const { isProject } = req.body
      // 判断是否是源文件
      if (isProject) {
        cb(null, projectPath)
      } else {
        cb(null, modelZipPath)
      }
    },
    filename: (req: any, file: any, cb: any) => {
      const { isProject } = req.body
      const extension = file.mimetype.split('/')[1]
      // 判断是否是源文件
      if (isProject) {
        cb(null, `${req.body.model_id}.${extension}`)
      } else {
        cb(null, `${req.body.model_id}`)
      }
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
        multipartMiddleware.single('model'),
        async (context, next) => {
          const reqBody = (context.request as any).body
          const { model_id, isProject } = reqBody
          const file = (context.request as any).file
          const modelFilesService = app.service('model-files')
          const modelsService = app.service('models')

          // update models service project_url
          if (isProject) {
            const project_url = `projects/${file.filename}`
            const project_name = file.originalname
            await modelsService.patch(model_id, { project_url, project_name })

            context.request.body = {
              id: model_id,
              name: file.filename,
              project_name: file.originalname,
              project_url,
              size: file.size
            }
          } else {
            // unzip ZIP file with cleabup .DS_Store | __MACOSX & get flat file path
            const extractPath = path.join(modelFilePath, file.filename)
            console.log('extractPath---', extractPath)
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
            for (const fileItem of curFilePaths) {
              const { path: filePath, size } = fileItem
              const fileName = filePath.split('/').pop()
              await modelFilesService.create({
                model_id,
                file_name: fileName,
                aliases: '',
                modelFolder: `files/${model_id}/${file.originalname.replace('.zip', '')}`,
                url: filePath,
                size
              })
            }

            // find model files by model_id
            const modelFiles = (await modelFilesService.find({
              paginate: false,
              query: { model_id }
            })) as unknown as {
              id: string
              model_id: string
              file_name: string
              url: string
              modelFolder: string
              size: number
              aliases: string
              created_at: string
              updated_at: string
            }[] // 强制设置 TypeScript 类型

            const tree = await buildTreeByFlatData(modelFiles)

            context.request.body = {
              tree
            }
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
// const zipFilePath = path.join(modelZipPath, file.filename)
// const fileBuffer = await fs.promises.readFile(zipFilePath)
// const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex')
