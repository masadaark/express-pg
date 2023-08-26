import { getDB } from "../db";

export class BalanceFlow {
    static async getBalanceByOrderId(orderId: number) {
        return await getDB()
            .select()
            .from("seedang.balance")
            .where("order_id", "=", orderId)
            .andWhere("outdated_by", '=', null);
    }
}