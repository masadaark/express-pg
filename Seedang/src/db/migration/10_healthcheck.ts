import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('healthcheck', (table) => {
    table.increments('id').primary();
    table.string('status');

    console.log(`create table healthcheck success`);
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('healthcheck');
  await db.schema.dropSchemaIfExists('seedang');
}