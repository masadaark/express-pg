import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('receipt', (table) => {
    table.bigIncrements('id').primary();
    table.string('url').notNullable();
    table.timestamp('created_at', { useTz: false}).defaultTo(db.fn.now());
    table.bigInteger('transaction_id').notNullable();
    table.foreign('transaction_id').references('id').inTable('seedang.transaction');
  });
  await db.schema.raw(
    'CREATE INDEX index_transaction_id_on_receipt ON seedang.receipt USING hash (transaction_id);'
  );
  console.log(`create table receipt success`);
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('receipt');
  await db.schema.dropSchemaIfExists('seedang');
}