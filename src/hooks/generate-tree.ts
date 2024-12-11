import fs from 'fs/promises'
import path from 'path'
const host = process.env.HOST
const port = process.env.PORT
const baseHttp = `http://${host}:${port}`
// 递归生成树结构
export const generateTree: any = async (folderPath: any) => {
  const entries = await fs.readdir(folderPath, { withFileTypes: true })
  const tree = []

  for (const entry of entries) {
    if (entry.name === '.DS_Store') {
      continue // 跳过 .DS_Store 文件
    }
    // console.log('entry---', entry)
    const fullPath = path.join(folderPath, entry.name)
    const stats = await fs.stat(fullPath)
    const relativePath = fullPath.replace('/Users/tanwei/Documents/TinTan/decoration-service', '')
    // console.log('fullPath---', fullPath)
    // console.log('__dirname---', __dirname)
    // console.log('relativePath---', relativePath)

    if (stats.isDirectory()) {
      // 如果是文件夹，递归获取子节点
      tree.push({
        name: entry.name,
        aliasesName: '',
        // key: `${baseHttp}${relativePath}`,
        key: relativePath,
        // isLeaf: false,
        children: await generateTree(fullPath)
      })
    } else {
      // 如果是文件
      tree.push({
        name: entry.name,
        aliasesName: '',
        // key: `${baseHttp}${relativePath}`
        key: relativePath
        // isLeaf: true
      })
    }
  }
  return tree
}

// export const generateDataTree = (data: any) => {
//   // 按照 `modelFolder` 进行分组
//   const folderMap = data.reduce((acc: any, item: any) => {
//     if (!acc[item.modelFolder]) {
//       acc[item.modelFolder] = []
//     }
//     acc[item.modelFolder].push(item)
//     return acc
//   }, {})

//   // 构造树结构
//   const tree = Object.entries(folderMap).map(([modelFolder, files]) => ({
//     key: modelFolder,
//     title: modelFolder,
//     children: files.map((file: any) => ({
//       key: file.id,
//       title: file.url.split('/').pop(), // 文件名作为节点标题
//       ...file // 包含所有文件属性，便于扩展
//     }))
//   }))

//   return tree
// }
