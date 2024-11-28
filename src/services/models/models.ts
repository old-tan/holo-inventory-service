// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

// import { hooks as schemaHooks } from '@feathersjs/schema'

// import {
//   modelsDataValidator,
//   modelsPatchValidator,
//   modelsQueryValidator,
//   modelsResolver,
//   modelsExternalResolver,
//   modelsDataResolver,
//   modelsPatchResolver,
//   modelsQueryResolver
// } from './models.schema'
import dayjs from 'dayjs'
import type { HookContext } from '../../declarations'

import type { Application } from '../../declarations'
import { ModelsService, getOptions } from './models.class'
import { modelsPath, modelsMethods } from './models.shared'

// updatedAt hook
import { updatedAt } from '../../hooks/updated-at'

export * from './models.class'
export * from './models.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const models = (app: Application) => {
  // Register our service on the Feathers application
  app.use(modelsPath, new ModelsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: modelsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(modelsPath).hooks({
    before: {
      create: [
        async (context: HookContext) => {
          if (context.data.tags) {
            const tags = context.data.tags
            // add tags to custom attr ant insert them into other table
            context.cusData = tags
            // extract tags and delete it avoid insert into models table
            delete context.data.tags
          }

          if (context.data.uploads) {
            const uploads = context.data.uploads
            // add uploads to custom attr ant insert them into other table
            context.cusUploads = uploads
            // extract uploads and delete it avoid insert into models table
            delete context.data.uploads
          }
        }
      ],
      remove: [
        async (context: HookContext) => {
          const id = String(context.id)
          const modelAttributesService = app.service('model-attributes')
          await modelAttributesService.remove(null, {
            adapter: {
              multi: true
            },
            query: {
              model_id: id
            }
          })
          return context
        }
      ],
      update: [
        async (context: HookContext) => {
          console.log('update-hook------')
          const id = context.data.id
          const tags = context.data.tags

          const nowTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          context.data.updated_at = nowTime
          const modelAttributesService = app.service('model-attributes')
          await modelAttributesService.remove(null, {
            adapter: {
              multi: true
            },
            query: {
              model_id: id
            }
          })
          for (const tag of tags) {
            await modelAttributesService.create({
              model_id: id,
              key: tag,
              value: tag
            })
          }

          // model-files update
          const uploads = context.data.uploads
          const modelFilesService = app.service('model-files')
          // 查找现有记录
          const modelFiles = (await modelFilesService.find({
            query: { model_id: id },
            paginate: false // 禁用分页以获取所有匹配记录
          })) as unknown as {
            id: string
            model_id: string
            file_name: string
            url: string
            created_at: string
            updated_at: string
          }[] // 强制设置 TypeScript 类型

          if (modelFiles.length === 0) {
            // 批量更新记录
            if (uploads.length) {
              await modelFilesService.create({
                model_id: id,
                ...uploads[0]
              })
            }
            // throw new Error(`No records found for model_id: ${id}`)
          } else {
            // 批量更新记录
            if (uploads.length) {
              await Promise.all(
                modelFiles.map((file) =>
                  modelFilesService.patch(file.id, { ...uploads[0], updated_at: nowTime })
                )
              )
            } else {
              await Promise.all(modelFiles.map((file) => modelFilesService.remove(file.id)))
            }
          }

          return context
        }
      ]
    },
    after: {
      create: [
        async (context: HookContext) => {
          const tags = context.cusData
          // insert tags into model-attributes service and bind model_id
          const modelAttributesService = app.service('model-attributes')
          for (const tag of tags) {
            await modelAttributesService.create({
              model_id: context.result.id,
              key: tag,
              value: tag
            })
          }

          // insert uploads into model-files service
          const uploads = context.cusUploads
          const modelFilesService = app.service('model-files')
          if (uploads && uploads.length) {
            for (const file of uploads) {
              const { file_name, url } = file
              await modelFilesService.create({
                model_id: context.result.id,
                file_name,
                url
              })
            }
          }

          // insert tags into attributes service
          const attributesService = app.service('attributes')

          for (const tag of tags) {
            // 检查是否已经存在相同的 key
            const existingAttribute = (await attributesService.find({
              query: { key: tag }
            })) as unknown as { id: string; key: string; value: string }[] // 强制设置 TypeScript 类型

            if (existingAttribute.length === 0) {
              // 如果不存在，则创建
              await attributesService.create({
                key: tag,
                value: tag
              })
            }
          }

          // delete custom cusData & cusUploads
          delete context.cusData
          delete context.cusUploads

          return context
        }
      ],
      find: [
        async (context: HookContext) => {
          let mdoelsData = [...context.result.data]
          const newModelsData = await Promise.all(
            mdoelsData.map(async (item: any) => {
              // Query service 'model-attributes' using `id` as `model_id`
              const modelAttributesTags = await app.service('model-attributes').find({
                query: {
                  model_id: item.id
                }
              })

              // query service 'model-files' usering 'id' as 'model-id'
              const modelFiles = await app.service('model-files').find({
                query: {
                  model_id: item.id
                }
              })

              return {
                ...item,
                tags: [...modelAttributesTags.data],
                files: [...modelFiles.data]
              }
            })
          )
          // Attach the related data to the result
          context.result = {
            ...context.result,
            data: newModelsData
          }

          return context
        }
      ]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [modelsPath]: ModelsService
  }
}
