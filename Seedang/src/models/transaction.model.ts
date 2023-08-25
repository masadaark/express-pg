export interface TransactionTable {
    id?: number,
    user_id: number,
    transaction_code_id: number,
    created_at?: string,
}

export interface TransactionCodeTable {
    id?:number,
    name:string
}