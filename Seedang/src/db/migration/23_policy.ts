import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('policy', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('insurance_id').notNullable();
    table.foreign('insurance_id').references('id').inTable('seedang.insurance')
    table.string('policy_number').notNullable();
    table.string('policy_url').notNullable();
    table.timestamp('created_at', { useTz: false}).defaultTo(db.fn.now());
  });
  await db.schema.raw(
    'CREATE INDEX index_insurance_id_on_policy ON seedang.policy USING hash (insurance_id);'
  );
  console.log(`create table policy success`)

}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('policy');
  await db.schema.dropSchemaIfExists('seedang');
}