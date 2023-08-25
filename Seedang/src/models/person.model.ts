export interface PersonTable {
    id?: number,
    first_name: string,
    last_name: string
    phone: string,
    address: string,
    city: string,
    county: string,
    portal_code: string,
    updated_by?:number,
    created_at?: Date,
}

export interface PersonInfomation {
    firstName: string,
    lastName: string
    phone: string,
    address: string,
    city: string,
    county: string,
    portalCode: string,
}