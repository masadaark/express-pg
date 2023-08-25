import { Knex } from "knex";

export function seed(db: Knex): Promise<any> {
  return db('seedang.income_rate').del()
    .then(function () {
      return db('seedang.income_rate').insert([
        { id: 1, package_name: "ECONOMY" , rate: 0.15, start_date: db.fn.now(), expire_date: '9999-12-01'},
        { id: 2, package_name: "SILVER" , rate: 0.12, start_date: db.fn.now(), expire_date: '9999-12-01'},
        { id: 3, package_name: "GOLD" , rate: 0.12, start_date: db.fn.now(), expire_date: '9999-12-01'},
        { id: 4, package_name: "PLATINUM" , rate: 0.10, start_date: db.fn.now(), expire_date: '9999-12-01'},
        { id: 5, package_name: "EMERALD" , rate: 0.10, start_date: db.fn.now(), expire_date: '9999-12-01'},
      ]);
    });
}
