import { InsurancePackage } from "./insurance.model"

export interface OrderTable {
    id?: number
    user_id: number
    destination_country: string
    origin_country: string
    start_date: Date
    end_date: Date
    package_name: string
    package_price: number
    income_rate_id: number
    coverage_id: number
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
export interface CreateOrderModel {
    originCountry?: string,
    destinationCountry?: string,
    startDate?: Date;
    endDate?: Date;
    package?: InsurancePackage
}

export interface OrderStateDetail{
    orderId: number,
    state: number,
    stateName: string,
    destination_country: string
    origin_country: string
    start_date: Date
    end_date: Date
    package_name: string
}
