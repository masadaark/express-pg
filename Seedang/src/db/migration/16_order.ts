import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('order', (table) => {
    table.bigIncrements('id').primary();
    table.string('origin_country').notNullable();
    table.string('destination_country').notNullable();
    table.timestamp('start_date').nullable();
    table.timestamp('end_date').nullable();
    table.bigInteger('user_id').notNullable();
    table.string('package_name').notNullable();
    table.decimal('price').notNullable();
    table.integer('income_rate_id').notNullable();
    table.foreign('income_rate_id').references('id').inTable('seedang.income_rate');
    table.integer('coverage_id').notNullable();
    table.foreign('coverage_id').references('id').inTable('seedang.coverage');
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