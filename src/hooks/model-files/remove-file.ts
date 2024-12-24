import { app } from '../../app'
import type { HookContext } from '../../declarations'
import fs from 'fs'
import path from 'path'
export const removeFile = async (context: HookContext) => {
  const id = String(context.id)
  // get current file record
  const modelFile = await app.service('model-files').get(id)
  if (!modelFile || !modelFile.url) {
    throw new Error('No model-file found or path is missing')
  }
  const { model_id, url } = modelFile
  const filePath = path.join(__dirname, `../../../model_files/${model_id}/${url}`)
  // delete current file
  try {
    await fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File does not exist: ${filePath}`)
        return
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`)
        } else {
          console.log(`File deleted successfully: ${filePath}`)
        }
      })
    })
  } catch (error) {
    console.error('Error deleting file:', error)
  }

  return context
}
