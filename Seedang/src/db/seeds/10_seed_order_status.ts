import { Knex } from "knex";

export function seed(db: Knex): Promise<any> {
  return db('seedang.order_status').insert([
    { id: 1, name: "รอข้อมูลลูกค้า" },
    { id: 2, name: "รอชำระเงิน" },
    { id: 3, name: "ชำระเงินเรียบร้อย" },
    { id: 4, name: "ยกเลิก" },
  ]).onConflict('id')
    .merge();
}
