import { InsuranceOrder, InsuranceTable } from '../models/insurance.model';
import { OrderTable, OrderStatusHistoryTable, OrderBalanceTable } from '../models/order.model';
import { PersonInfomation, PersonTable } from '../models/person.model';
import { TransactionTable } from '../models/transaction.model'


export class OrderCreateLogic {
    static maptransaction(userId: number, transactionCode: number): TransactionTable {
        const transaction: TransactionTable = {
            user_id: userId,
            transaction_code_id: transactionCode
        }
        return transaction;
    }
    static mapOrder(userId: number): OrderTable {
        const order: OrderTable = {
            user_id: userId
        }
        return order;
    }
    static mapLogOrderStatus(statusId: number): OrderStatusHistoryTable {
        const logOrderStatus: OrderStatusHistoryTable = {
            status_id: statusId,
        }
        return logOrderStatus;
    }
    static mapOrderBalance(amount: number, balance: number): OrderBalanceTable {
        const orderBalance: OrderBalanceTable = {
            amount: amount,
            balance: balance,
        }
        return orderBalance;
    }
    static mapPerson(requestPersons: PersonInfomation[]): PersonTable[] {
        const savePersons : PersonTable[] = [];
        for (const obj of requestPersons) {
            if (!savePersons[obj.idCard] || !savePersons[obj.passport]) {
                const person : PersonTable = {
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
            const person : PersonTable = {
                first_name: requestPersons.firstName,
                last_name: requestPersons.lastName,
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
    static mapInsurance(req: InsuranceOrder, ownerPerson: number, benefitPerson: number, orderId: number, rate_income_id: number, coverage_id:number): InsuranceTable {
        const insuranceSave : InsuranceTable = {
            order_id: orderId,
            origin_country : req.originCountry,
            destination_country : req.destinationCountry,
            start_date : req.startDate,
            end_date : req.endDate,
            package_name : req.package.packageName,
            price: Number(req.package.packagePrice),
            owner_person_id: ownerPerson,
            benefit_persob_id:  benefitPerson,
            rate_income_id: rate_income_id,
            coverage_id: coverage_id
        }
        return insuranceSave;
    }
}

