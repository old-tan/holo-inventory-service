// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('model-files', (table) => {
    // table.increments('id')
    table.uuid('id').defaultTo(knex.fn.uuid())

    table.string('model_id')
    table.string('file_name')
    table.string('thumb')
    // table.string('zip')
    // table.string('zipMd5')
    table.string('modelFolder')
    table.string('aliases')
    table.string('url')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('model-files')
}
