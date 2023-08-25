import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('order', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('seedang.user');
    table.timestamp('create_at', { useTz: false}).defaultTo(db.fn.now());
    table.bigInteger('transaction_id').notNullable();
    table.foreign('transaction_id').references('id').inTable('seedang.transaction');
  });
  await db.schema.raw(
    'CREATE INDEX index_user_id_on_order ON seedang.order USING hash (user_id); CREATE INDEX index_transaction_id_on_order ON seedang.order USING hash (transaction_id);'
  );
  console.log(`create table order success`)
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('order');
  await db.schema.dropSchemaIfExists('seedang');
}