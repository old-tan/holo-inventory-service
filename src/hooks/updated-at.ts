// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const updatedAt = async (context: HookContext) => {
  console.log(`Running hook updated-at on ${context.path}.${context.method}`)
}
