// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('attributes', (table) => {
    // table.increments('id')
    table.uuid('id').defaultTo(knex.fn.uuid())
    table.string('key')
    table.string('value')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('attributes')
}
