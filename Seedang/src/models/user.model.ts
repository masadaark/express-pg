export interface UserTable {
    id?: number,
    email: string,
    phone: string,
    first_name?: string,
    last_name?: string
    created_at?: Date,
}

export interface User {
    email: string,
    phone: string,
    firstName?: string,
    lastName?: string
}