// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { nanoid } from 'nanoid'
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('models', (table) => {
    // table.increments('id')
    table.uuid('id').defaultTo(knex.fn.uuid())
    // table
    //   .string('id')
    //   .primary()
    //   .defaultTo(knex.raw(`'${nanoid()}'`)) // Use nanoid to generate primary keys
    table.string('name')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('models')
}
