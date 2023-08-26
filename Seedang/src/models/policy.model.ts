import { Coverage } from "./coverage.model";

export interface PolicyTable {
    id?: number
    insurance_id: number,
    policy_number: number,
    policy_url: string,
    created_at?: Date
}

interface PlanDetail {
    value: string | number;
    unit: string;
}

interface PlanPackage {
    packageName: string;
    packagePrice: PlanDetail;
    coverages: Coverage[];
}

export interface PolicyHolderRegistration {
    registrationType: string;
    value: string;
}

interface Phone {
    internationalPrefix: string;
    number: string;
}

interface PolicyHolder {
    title: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    isPolicyBeneficiary: boolean;
    registrations: PolicyHolderRegistration[];
    phone: Phone;
}

interface Address {
    streetAddress: string;
    postalCode: string;
    city: string;
    country: string;
}

interface BeneficiaryRegistration {
    registrationType: string;
    value: string;
}

interface Beneficiary {
    title: string;
    firstName: string;
    lastName: string;
    relationship: string;
    email: string;
    registrations: BeneficiaryRegistration[];
    phone: Phone;
}

interface Quote {
    originCountry: string;
    destinationCountry: string;
    startDate: string;
    endDate: string;
    plan: PlanPackage;
}

export interface InsuranceQuote {
    quote: Quote;
    policyHolder: PolicyHolder;
    address: Address;
    beneficiary: Beneficiary;
}