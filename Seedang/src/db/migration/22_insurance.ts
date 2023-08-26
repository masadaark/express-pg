import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('insurance', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('order_id').notNullable();
    table.foreign('order_id').references('id').inTable('seedang.order');
    table.bigInteger('owner_person_id').nullable();
    table.foreign('owner_person_id').references('id').inTable('seedang.person');
    table.bigInteger('benefit_person_id').nullable();
    table.foreign('benefit_person_id').references('id').inTable('seedang.person');
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