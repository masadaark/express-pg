import { Knex } from "knex";

export function seed(db: Knex): Promise<any> {
  return db('seedang.order_status').del()
    .then(function () {
      return db('seedang.order_status').insert([
        { id: 1, name: "รอชำระเงิน" },
        { id: 2, name: "ชำระเงินเรียบร้อย" },
        { id: 3, name: "ยกเลิก" },
      ]);
    });
}
