import fs from 'fs/promises'
import path from 'path'
/**
 * 获取指定目录下的所有文件路径（扁平化）
 * @param {string} dirPath - 目标文件夹路径
 * @returns {Promise<string[]>} - 扁平化的文件路径数组
 */
export const getAllFilesFlat: any = async (dirPath: any) => {
  let filePaths: any = []

  // 读取目录内容
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  // 遍历每个条目
  for (const entry of entries) {
    const fullPath = path.resolve(dirPath, entry.name)
    const relativePath = fullPath.replace(path.join(__dirname, '../../'), '')

    if (entry.isDirectory()) {
      // 递归处理子目录
      const nestedFiles = await getAllFilesFlat(fullPath)
      filePaths = filePaths.concat(nestedFiles)
    } else {
      // 添加文件路径
      filePaths.push(relativePath)
    }
  }

  return filePaths
}