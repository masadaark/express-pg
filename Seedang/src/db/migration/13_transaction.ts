import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('transaction', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('seedang.user');
    table.integer('transaction_code_id');
    table.foreign('transaction_code_id').references('id').inTable('seedang.transaction_code');
    table.timestamp('created_at', { useTz: false}).defaultTo(db.fn.now());
  });
  await db.schema.raw(
    'CREATE INDEX index_user_id_on_transaction ON seedang.transaction USING hash (user_id);'
  );
  console.log(`create table transaction success`);

}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('transaction');
  await db.schema.dropSchemaIfExists('seedang');
}