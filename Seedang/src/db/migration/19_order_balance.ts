import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('order_balance', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('order_id').notNullable();
    table.foreign('order_id').references('id').inTable('seedang.order');
    table.decimal('amount').notNullable();
    table.decimal('balance').notNullable();
    table.bigInteger('outdated_by').nullable();
    table.foreign('outdated_by').references('id').inTable('seedang.order_balance');
    table.timestamp('created_at', { useTz: false}).defaultTo(db.fn.now());
    table.bigInteger('transaction_id').notNullable();
    table.foreign('transaction_id').references('id').inTable('seedang.transaction');
  });
  await db.schema.raw(
    'CREATE INDEX index_order_id_on_order_balance ON seedang.order_balance USING hash (order_id); CREATE INDEX index_transaction_id_on_order_balance ON seedang.order_balance USING hash (transaction_id);'
  );
  await db.schema.raw(
    'CREATE UNIQUE INDEX seedang_order_balance_outdated_by_idx ON seedang.order_balance USING btree (order_id, outdated_by); CREATE UNIQUE INDEX seedang_outdated_by_idx_on_order_balance ON seedang.order_balance USING btree (outdated_by) where outdated_by is not null;'
  );
  console.log(`create table order_balance success`);
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('order_balance');
  await db.schema.dropSchemaIfExists('seedang');
}