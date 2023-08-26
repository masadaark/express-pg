import { Coverage, CoverageDetail } from "./coverage.model";
import { PersonInfomation } from "./person.model";

export interface InsuranceTable {
    id?: number,
    order_id: number,
    owner_person_id: number,
    benefit_person_id: number,
    created_at?: Date,
}

export interface CreateInsurance {
    orderId?: number,
    persons?: InsuranceDetail[];
}

export interface InsuranceDetail {
    person: PersonInfomation
    benefitPerson: PersonInfomation
}

export interface InsurancePackage {
    packageName: string;
    packagePrice: CoverageDetail;
    coverages: Coverage[];
}