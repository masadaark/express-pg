import { getDB } from "../db";

export class PaymentFlow {
    static async getBalanceByOrderId(orderId: number) {
        return await getDB()
            .select()
            .from("seedange.balance")
            .where("order_id", "=", orderId)
            .andWhere("outdated_by", '=', null);
    }
}