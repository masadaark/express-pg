import { getDB } from "../db";
import { OrderBalanceTable } from "../models/order.model";

export class BalanceFlow {
    static async getBalanceByOrderId(orderId: number): Promise<OrderBalanceTable[]> {
        return await getDB()
            .select()
            .from("seedang.order_balance")
            .where("order_id", "=", orderId)
            .andWhere("outdated_by","is", null);
    }
}