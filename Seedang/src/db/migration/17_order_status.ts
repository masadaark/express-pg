import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('order_status', (table) => {
    table.integer('id').primary();
    table.string('name').notNullable();
  });
  console.log(`create table order_status success`)
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('order_status');
  await db.schema.dropSchemaIfExists('seedang');
}