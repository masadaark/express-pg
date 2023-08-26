import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('log_order_status', (table) => {
    table.bigIncrements('id').primary();
    table.integer('status_id').notNullable();
    table.foreign('status_id').references('id').inTable('seedang.order_status');
    table.bigInteger('order_id').notNullable();
    table.foreign('order_id').references('id').inTable('seedang.order');
    table.bigInteger('outdated_by').nullable();
    table.foreign('outdated_by').references('id').inTable('seedang.log_order_status')
    table.timestamp('create_at', { useTz: false}).defaultTo(db.fn.now());
    table.bigInteger('transaction_id').notNullable();
    table.foreign('transaction_id').references('id').inTable('seedang.transaction')
  });
  await db.schema.raw(
    'CREATE INDEX index_order_id_on_log_order_status ON seedang.log_order_status USING hash (order_id); CREATE INDEX index_transaction_id_on_log_order_status ON seedang.log_order_status USING hash (transaction_id);'
  );
  // await db.schema.raw(
  //   'CREATE UNIQUE INDEX seedang_order_id_outdated_by_idx ON seedang.log_order_status USING btree (order_id, outdated_by); CREATE UNIQUE INDEX seedang_outdated_by_idx ON seedang.log_order_status USING btree (outdated_by) where outdated_by is not null;'
  // );
  console.log(`create table log_order_status success`)
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('log_order_status');
  await db.schema.dropSchemaIfExists('seedang');
}