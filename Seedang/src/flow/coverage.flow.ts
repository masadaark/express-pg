import { getDB } from "../db";
import { CoverageTable } from "../models/coverage.model";
import { OrderFlow } from "./order.flow";

export class CoverageFlow {
    static async getByOrderId(orderId: number): Promise<CoverageTable> {
        const order = await OrderFlow.getOneById(orderId)
        return await getDB()
            .select()
            .from("seedang.coverage")
            .where("id", "=", order.coverage_id).first()
    }
}