import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('transaction_code', (table) => {
    table.integer('id').primary();
    table.string('name').notNullable();
  });
  console.log(`create table transaction_code success`);
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('transaction_code');
  await db.schema.dropSchemaIfExists('seedang');
}