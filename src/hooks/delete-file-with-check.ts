import fs from 'fs'
import path from 'path'

export const deleteFileWithCheck = (folderPath: any, fileName: any) => {
  const filePath = path.join(folderPath, fileName)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File does not exist: ${filePath}`)
      return
    }
    console.log(`File exists: ${filePath}`)

    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error(`Error deleting file: ${err.message}`)
    //   } else {
    //     console.log(`File deleted successfully: ${filePath}`)
    //   }
    // })
  })
}
