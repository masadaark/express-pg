export interface PersonTable {
    id?: number,
    first_name: string,
    last_name: string,
    id_card?: string,
    passport?: string,
    phone: string,
    birth_date: Date,
    address: string,
    city: string,
    county: string,
    portal_code: string,
    updated_by?: number,
    created_at?: Date,
}

export interface PersonInfomation {
    firstName: string,
    lastName: string,
    idCard: string,
    passport: string,
    phone: string,
    birthDate: Date,
    address: string,
    city: string,
    county: string,
    portalCode: string,
}