const AdmZip = require('adm-zip')
import fs from 'fs'
import { getAllFilesFlat } from '../hooks/generate-filesFlat'
export const extractZipWithCleanup = async (filePath: any, outputDir: any) => {
  const zip = new AdmZip(filePath)
  const tempZip = new AdmZip()

  zip.getEntries().forEach((entry: any) => {
    const entryName = entry.entryName

    // 过滤掉 Mac 和 Windows 系统生成的隐藏文件
    if (entryName.startsWith('__MACOSX') || entryName.endsWith('.DS_Store')) {
      console.log(`Skipping: ${entryName}`)
      return
    }

    // 添加剩余条目到新 ZIP 对象
    tempZip.addFile(entryName, entry.getData(), entry.comment)
  })

  // 提取到目标目录
  fs.rmSync(outputDir, { recursive: true, force: true }) // 先清空
  tempZip.extractAllTo(outputDir, true)
  console.log('Extraction completed without hidden files!')

  // get flat file path
  return await getAllFilesFlat(outputDir)
}
