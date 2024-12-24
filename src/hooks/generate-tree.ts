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

export const buildTreeByFlatData = (objects: any[], baseLevel = 0) => {
  const tree = {}

  if (!objects?.length) return []
  objects.length > 0 &&
    objects.forEach((item) => {
      // 移除前缀部分，仅保留从目标层开始的路径
      const relativePath = item.url.split('/').slice(baseLevel).join('/')
      const parts = relativePath.split('/')
      const { id, model_id, aliases } = item

      let currentNode: any = tree

      parts.forEach((part: any, index: number) => {
        const currentKey = parts.slice(0, index + 1).join('/')
        const isFile = index === parts.length - 1 // 判断是否是文件
        if (!currentNode[part]) {
          currentNode[part] = isFile
            ? {
                name: part,
                key: id || currentKey,
                path: currentKey,
                id,
                model_id,
                aliases,
                isLeaf: true
              }
            : {
                name: part,
                key: currentKey,
                path: currentKey,
                id: currentKey,
                model_id,
                aliases: '',
                isLeaf: false,
                children: {}
              }
        }
        if (!isFile) {
          currentNode = currentNode[part].children // 进入子节点
        }
      })
    })

  // 转换对象树为数组结构
  function convertToArray(node: any) {
    return Object.values(node).map((item: any) => {
      if (item.children) {
        item.children = convertToArray(item.children)
      }
      return item
    })
  }

  return convertToArray(tree)
}
