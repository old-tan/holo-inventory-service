import { app } from '../../app'
import type { HookContext } from '../../declarations'
export const afterGet = async (context: HookContext) => {
  console.log('enter-get------', context)
  const { id } = context

  try {
    // Query service 'model-attributes' using `id` as `model_id`
    const modelAttributesTags = (await app.service('model-attributes').find({
      query: {
        model_id: String(id),
        $select: ['key', 'value']
      },
      paginate: false
    })) as unknown as { id: string; key: string; value: string }[]
    const tags = modelAttributesTags.map((item: any) => {
      const { key, value } = item
      return { key, value }
    })

    // Query service 'model-files' using `id` as `model_id`
    const modelFilesData = (await app.service('model-files').find({
      paginate: false,
      query: {
        model_id: String(id),
        $select: ['file_name', 'url', 'modelFolder', 'size', 'aliases']
      }
    })) as unknown as {
      id: string
      url: string
      file_name: string
      modelFolder: string
      size: number
      aliases: string
    }[]
    const baseUrl = (modelFilesData.length > 0 && modelFilesData[0].modelFolder) || ''
    const models = modelFilesData
      .sort((a, b) => a.size - b.size)
      .filter((item: any) => item.file_name.endsWith('.glb'))
      .map((item) => item.file_name)

    const textureNames = modelFilesData
      .filter((item) => !item.file_name.endsWith('.glb'))
      .map((item) => {
        const { file_name, url, aliases } = item
        const path = url.replace(/^[^/]+\//, '')
        return {
          path,
          alias: aliases ? aliases : file_name.slice(0, -5)
        }
      })

    context.result = {
      baseUrl,
      name: models.length === 1 ? models.join() : models || '',
      textureNames
    }
  } catch (error) {
    // 返回错误信息
    context.status = 400
    context.body = {
      error
    }

    return // 终止请求处理
  }
}
