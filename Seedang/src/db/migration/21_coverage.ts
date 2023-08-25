import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('coverage', (table) => {
    table.integer('id').primary();
    table.string('coverage_detail').notNullable();
    table.timestamp('create_at', { useTz: false}).defaultTo(db.fn.now());

    console.log(`create table coverage success`)
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('coverage');
  await db.schema.dropSchemaIfExists('seedang');
}