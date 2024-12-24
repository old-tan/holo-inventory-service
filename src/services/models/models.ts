// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import dayjs from 'dayjs'

import type { HookContext } from '../../declarations'

import type { Application } from '../../declarations'
import { ModelsService, getOptions } from './models.class'
import { modelsPath, modelsMethods } from './models.shared'

export * from './models.class'
export * from './models.schema'

import { removeFolder } from '../../hooks/models/remove-folder'
import { afterGet } from '../../hooks/models/after-get'
import { buildTreeByFlatData } from '../../hooks/generate-tree'

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
          const { data } = context
          if (data?.id === '' || data?.id === null || data?.id === undefined) {
            delete data.id
          }
          if (context.data.tags) {
            const tags = context.data.tags
            // add tags to custom attr ant insert them into other table
            context.cusData = tags
            // extract tags and delete it avoid insert into models table
            delete context.data.tags
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

          const modelFilesService = app.service('model-files')
          await modelFilesService.remove(null, {
            adapter: {
              multi: true
            },
            query: {
              model_id: id
            }
          })

          return context
        },
        removeFolder
      ],
      update: [
        async (context: HookContext) => {
          const { id, name, created_at, tags } = context.data

          // update models
          const nowTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          context.data = {
            ...context.data,
            id,
            name,
            created_at,
            updated_at: nowTime
          }

          // update model-attributes
          const modelAttributesService = app.service('model-attributes')
          await modelAttributesService.remove(null, {
            adapter: {
              multi: true
            },
            query: {
              model_id: id
            }
          })
          for (const { key, value } of tags) {
            await modelAttributesService.create({
              model_id: id,
              key,
              value
            })
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
          for (const { key, value } of tags) {
            await modelAttributesService.create({
              model_id: context.result.id,
              key,
              value
            })
          }

          // insert tags into attributes service
          const attributesService = app.service('attributes')

          for (const { key, value } of tags) {
            // 检查是否已经存在相同的 key
            const existingAttribute = (await attributesService.find({
              query: { key, value }
            })) as unknown as { id: string; key: string; value: string }[] // 强制设置 TypeScript 类型
            if (existingAttribute.length === 0) {
              // 如果不存在，则创建
              await attributesService.create({
                key,
                value
              })
            }
          }

          // delete custom attr: cusData
          delete context.cusData

          return context
        }
      ],
      get: [afterGet],
      find: [
        async (context: HookContext) => {
          const { id } = context.params.query
          let mdoelsData = [...context.result.data]
          const newModelsData = await Promise.all(
            mdoelsData.map(async (item: any) => {
              // Query service 'model-attributes' using `id` as `model_id`
              const modelAttributesTags = await app.service('model-attributes').find({
                query: {
                  model_id: item.id
                }
              })

              return {
                ...item,
                tags: [...modelAttributesTags.data]
              }
            })
          )
          // Query service 'model-files' using `id` as `model_id`
          const modelMeta =
            id &&
            ((await app.service('model-files').find({
              paginate: false,
              query: {
                model_id: String(id)
              }
            })) as unknown as {
              id: string
              model_id: string
              file_name: string
              url: string
              modelFolder: string
              size: number
              aliases: string
            }[])

          // generate tree by flat modelMeta
          const tree = await buildTreeByFlatData(modelMeta)

          // Attach the related data to the result
          context.result = !id
            ? {
                ...context.result,
                data: newModelsData
              }
            : {
                ...((newModelsData.length && newModelsData[0]) || {}),
                files: modelMeta,
                tree
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
