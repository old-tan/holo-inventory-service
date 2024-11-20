// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { nanoid } from 'nanoid'
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    // table.increments('id')
    table.uuid('id').defaultTo(knex.fn.uuid())
    // table
    //   .string('id')
    //   .primary()
    //   .defaultTo(knex.raw(`'${nanoid()}'`)) // Use nanoid to generate primary keys

    table.string('email').unique()
    table.string('password')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
