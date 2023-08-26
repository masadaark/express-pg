import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('income_rate', (table) => {
    table.integer('id').primary();
    table.string('package_name').notNullable();
    table.decimal('rate').notNullable();
    table.timestamp('start_date').notNullable();
    table.timestamp('expire_date').notNullable();
    table.timestamp('created_at', { useTz: false}).defaultTo(db.fn.now());
    table.timestamp('updated_at').nullable();

    console.log(`create table income_rate success`)
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('income_rate');
  await db.schema.dropSchemaIfExists('seedang');
}