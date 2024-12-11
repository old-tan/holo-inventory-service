export const removeDuplicatesByName = (arr: any) => {
  const map = new Map()
  return arr.filter((item: { name: any }) => !map.has(item.name) && map.set(item.name, true))
}
