import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('person', (table) => {
    table.bigIncrements('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('title').notNullable();
    table.string('phone').notNullable();
    table.string('id_card').nullable();
    table.string('passport').nullable();
    table.date('birth_date').notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('county').notNullable();
    table.string('portal_code').notNullable();
    table.timestamp('created_at', { useTz: false}).defaultTo(db.fn.now());
    table.bigInteger('updated_by').nullable();
  });
  console.log(`create table person success`)
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('person');
  await db.schema.dropSchemaIfExists('seedang');
}