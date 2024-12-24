import type { HookContext } from '../../declarations'
import fs from 'fs/promises'
import path from 'path'
export const removeFolder = async (context: HookContext) => {
  const id = String(context.id)

  const folderPath = path.join(__dirname, `../../../model_files/${id}`)
  // delete current file
  try {
    // check file/folder exists
    await fs.access(folderPath)
    console.log(`Path exists: ${folderPath}`)

    // delete folder
    await fs.rm(folderPath, { recursive: true, force: true })
    console.log(`Folder deleted successfully: ${folderPath}`)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.error(`Path does not exist: ${folderPath}`)
    } else {
      console.error(`Error deleting folder: ${err.message}`)
    }
  }

  return context
}
