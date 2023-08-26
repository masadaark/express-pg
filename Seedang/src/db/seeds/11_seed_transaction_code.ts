import { Knex } from "knex";

export function seed(db: Knex): Promise<any> {
  return db('seedang.transaction_code').insert([
    { id: 1, name: "create order" },
    { id: 2, name: "create insurance" },
    { id: 3, name: "payment" },
    { id: 4, name: "cancel" },
  ])
  .onConflict('id')
  .merge();
}
