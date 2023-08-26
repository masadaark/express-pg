import { getDB } from "../db";
import { CoverageTable } from "../models/coverage.model";

export class CoverageFlow {
    static async getByOrderId(orderId: number): Promise<CoverageTable> {
        return await getDB()
            .select()
            .from("seedang.coverage")
            .where("order_id", "=", orderId).first()
    }
}