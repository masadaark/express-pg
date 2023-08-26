import { Coverage, CoverageDetail } from "./coverage.model";
import { PersonInfomation } from "./person.model";

export interface InsuranceTable {
    id?: number,
    order_id: number,
    origin_country: string,
    destination_country: string,
    start_date: Date,
    end_date: Date,
    owner_person_id: number,
    benefit_persob_id: number,
    package_name: string,
    price: number,
    created_at?: Date,
    rate_income_id: number,
    coverage_id: number
}

export interface InsuranceOrder {
    originCountry?: string,
    destinationCountry?: string,
    startDate?: Date;
    endDate?: Date;
    insuranceDetails?: InsuranceDetail[];
    package?: InsurancePackage
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