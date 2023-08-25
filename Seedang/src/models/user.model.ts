export interface User {
    id?: number,
    username: string,
    password: string,
    level?: number,
    is_enabled:  boolean,
    created_at?: Date,
    updateed_at?: Date,
}