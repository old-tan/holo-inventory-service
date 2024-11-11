// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('uploads', (table) => {
    table.increments('id')

    table.string('lod0')
    table.string('lod1')
    table.string('lod2')
    table.string('thumb')
    table.string('photo')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('uploads')
}
