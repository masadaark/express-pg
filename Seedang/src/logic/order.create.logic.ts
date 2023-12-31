import { InsuranceTable } from '../models/insurance.model';
import { OrderTable, OrderStatusHistoryTable, OrderBalanceTable, CreateOrderModel } from '../models/order.model';
import { PersonInfomation, PersonTable } from '../models/person.model';
import { TransactionTable } from '../models/transaction.model'
import { OrderFlow } from '../flow/order.flow';
import { createError } from '../middleware/error';


export class OrderCreateLogic {
    static async validUserId(userId: number, orderId: number): Promise<void> {
        let queryOder: number
        try {
            queryOder = (await OrderFlow.getOneById(orderId)).user_id
        } catch {
            throw createError({
                status: 400,
                message: `ไม่พบหมายเลขรายการในระบบ`
            })
        }
        if (userId !== Number(queryOder)) {
            throw createError({
                status: 400,
                message: `คุณไม่มีสิทธิเข้าถึงรายการนี้ หมายเลขรายการ : ${orderId}`
            })
        }
    }
    static maptransaction(userId: number, transactionCode: number): TransactionTable {
        const transaction: TransactionTable = {
            user_id: userId,
            transaction_code_id: transactionCode
        }
        return transaction;
    }
    static mapOrder(requestorder: CreateOrderModel, userId: number, incomeRate: number, coverageId: number, transactionId: number): OrderTable {
        const order: OrderTable = {
            user_id: userId,
            origin_country: requestorder.originCountry,
            destination_country: requestorder.destinationCountry,
            start_date: requestorder.startDate,
            end_date: requestorder.endDate,
            package_name: requestorder.package.packageName,
            package_price: Number(requestorder.package.packagePrice.value),
            income_rate_id: incomeRate,
            coverage_id: coverageId,
            transaction_id: transactionId
        }
        return order;
    }
    static mapOrderBalance(amount: number, balance: number, orderId: number, transactionId: number): OrderBalanceTable {
        const orderBalance: OrderBalanceTable = {
            amount: amount,
            balance: balance,
            order_id: orderId,
            transaction_id: transactionId
        }
        return orderBalance;
    }
    static mapPerson(requestPersons: PersonInfomation[]): PersonTable[] {
        const savePersons: PersonTable[] = [];
        for (const obj of requestPersons) {
            if (!savePersons[obj.idCard] || !savePersons[obj.passport]) {
                const person: PersonTable = {
                    first_name: obj.firstName,
                    last_name: obj.lastName,
                    phone: obj.phone,
                    birth_date: obj.birthDate,
                    address: obj.address,
                    city: obj.city,
                    county: obj.county,
                    portal_code: obj.passport
                }
                if (obj.idCard) person.id_card = obj.idCard;
                if (obj.passport) person.id_card = obj.passport;
                savePersons.push(person);
            }
        }
        return savePersons;
    }
    static mapByPerson(requestPersons: PersonInfomation): PersonTable {
        if (requestPersons.idCard || requestPersons.passport) {
            const person: PersonTable = {
                first_name: requestPersons.firstName,
                last_name: requestPersons.lastName,
                title: requestPersons.title,
                phone: requestPersons.phone,
                birth_date: requestPersons.birthDate,
                address: requestPersons.address,
                city: requestPersons.city,
                county: requestPersons.county,
                portal_code: requestPersons.passport
            }
            if (requestPersons.idCard) person.id_card = requestPersons.idCard;
            if (requestPersons.passport) person.id_card = requestPersons.passport;
            return person
        }
    }
    static mapInsurance(orderId: number, owner: number, benefit: number): InsuranceTable {
        const insurance: InsuranceTable = {
            order_id: orderId,
            owner_person_id: owner,
            benefit_person_id: benefit
        }
        return insurance;
    }
    static maplogOrderStatus(status: number, orderId: number, transaction: number): OrderStatusHistoryTable {
        const logOrder: OrderStatusHistoryTable = {
            status_id: status,
            order_id: orderId,
            transaction_id: transaction
        }
        return logOrder;
    }
}

