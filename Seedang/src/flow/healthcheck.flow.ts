import { HealthcheckTable } from '../models/healthcheck.model';
import { getDB } from '../db';

export class HealthcheckFlow {
    static async findOneById(id: number): Promise<{ status: string }> {
        const row: HealthcheckTable[] = await getDB().select().from('seedang.healthcheck').where('id', id).limit(1);
        return { status: row[0].status };
    }
}