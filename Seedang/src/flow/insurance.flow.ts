import { getDB } from '../db/index';
import { InsuranceTable } from '../models/insurance.model';
import { PersonTable } from '../models/person.model';

export class InsuranceFlow {
    static async getInsurancePersonByOrderId(orderId: number): Promise<{ insurance: InsuranceTable[], person: PersonTable[] }> {
        const db = getDB();
        const insurances: InsuranceTable[] = await db
            .select('*')
            .from("seedang.insurance")
            .where('order_id', '=', orderId);
        const ownerSet: number[] = [...new Set(insurances.map(chr => Number(chr.owner_person_id)))];
        const benefitSet: number[] = [...new Set(insurances.map(chr => Number(chr.benefit_person_id)))];
        const personIds: number[] = ownerSet.concat(benefitSet);
        const persons = await db
            .select('*')
            .from("seedang.person")
            .whereIn("id", personIds);
        return { insurance: insurances, person: persons };
    }
}
