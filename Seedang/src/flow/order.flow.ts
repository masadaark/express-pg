import { getDB } from "../db";
import { OrderTable } from "../models/order.model";

export class OrderFlow {
    static async getOneById(orderId: number): Promise<OrderTable> {
        const row: OrderTable[] = await getDB().select().from('seedang.order').where('id', orderId).limit(1);
        return row[0];
    }
}