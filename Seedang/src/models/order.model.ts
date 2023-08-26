export interface OrderTable {
    id?: number
    user_id: number
    transaction_id?: number
    created_at?: Date
}

export interface OrderStatusHistoryTable {
    id?: number
    status_id: number
    order_id?: number
    outdated_by?: number
    transaction_id?: number
    created_at?: Date
}

export interface OrderBalanceTable {
    id?: number
    order_id?: number
    amount: number
    balance: number
    outdated_by?: number
    transaction_id?: number
    created_at?: Date
}

export interface OrderStatusTable {
    id?:number,
    name:string
}