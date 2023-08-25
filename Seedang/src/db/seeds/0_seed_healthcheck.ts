import { Knex } from "knex";

export function seed(db: Knex): Promise<any> {
  return db('seedang.healthcheck').del()
    .then(function () {
      return db('seedang.healthcheck').insert([
        { id: 1, status: "I'm fine, Thank you :)" },
      ]);
    });
}
