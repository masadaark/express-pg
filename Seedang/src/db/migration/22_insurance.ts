import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('insurance', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('order_id').notNullable();
    table.foreign('order_id').references('id').inTable('seedang.order');
    table.string('origin_country').notNullable();
    table.string('destination_country').notNullable();
    table.timestamp('start_date').nullable();
    table.timestamp('end_date').nullable();
    table.bigInteger('owner_person_id').nullable();
    table.foreign('owner_person_id').references('id').inTable('seedang.person');
    table.bigInteger('benefit_person_id').nullable();
    table.foreign('benefit_person_id').references('id').inTable('seedang.person');
    table.string('package_name').notNullable();
    table.decimal('price').notNullable();
    table.timestamp('create_at', { useTz: false}).defaultTo(db.fn.now());
    table.integer('income_rate_id').notNullable();
    table.foreign('income_rate_id').references('id').inTable('seedang.income_rate');
    table.integer('coverage_id').notNullable();
    table.foreign('coverage_id').references('id').inTable('seedang.coverage');
  });
  await db.schema.raw(
    'CREATE INDEX index_order_id_on_insurance ON seedang.insurance USING hash (order_id);'
  );
  console.log(`create table insurance success`);
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('order_balance');
  await db.schema.dropSchemaIfExists('seedang');
}