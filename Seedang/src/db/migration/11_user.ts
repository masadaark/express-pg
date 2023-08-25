import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').createTable('user', (table) => {
    table.bigIncrements('id').primary();
    table.string('email').unique().notNullable();
    table.string('phone').notNullable();
    table.string('first_name').nullable();
    table.string('last_name').nullable();
    table.timestamp('create_at', { useTz: false}).defaultTo(db.fn.now());
  });
  await db.schema.raw(
    'CREATE INDEX index_eamil_on_user ON seedang.user USING hash (email);'
  );
  console.log(`create table user success`)
}

export async function down(db: Knex): Promise<void> {
  await db.schema.withSchema('seedang').dropTable('user');
  await db.schema.dropSchemaIfExists('seedang');
}