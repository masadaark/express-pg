import { OrderCreateLogic } from "../logic/order.create.logic";
import { InsuranceOrder } from "../models/insurance.model";
import { getDB, getFromQuery } from '../db/index'
import { TransactionTable } from "../models/transaction.model";
import { OrderTable, OrderStatusHistoryTable , OrderBalanceTable} from "../models/order.model";
import { PersonTable } from "../models/person.model";
import { CoverageTable } from "../models/coverage.model";

export class CraeteOrderFlow{
    async process(req: InsuranceOrder, userId: number) : Promise<{ paymentAmount: number; }> {
        const transactionSave = OrderCreateLogic.maptransaction(userId, 1);
        const orderSave : OrderTable = OrderCreateLogic.mapOrder(userId);
        let logOrderStatusSave : OrderStatusHistoryTable = OrderCreateLogic.mapLogOrderStatus(1);
        const priceOrder = Number(req.package.packagePrice.value) * req.insuranceDetails.length;
        let orderBalance : OrderBalanceTable = OrderCreateLogic.mapOrderBalance(priceOrder, priceOrder);
        const resultTransactionSave = (await getDB().insert([transactionSave]).into("seedang.transaction").returning('*'))[0];
        orderSave.transaction_id = resultTransactionSave.id;
        const resultOrderSave = (await getDB().insert(orderSave).into("seedang.order").returning('*'))[0];
        logOrderStatusSave.transaction_id = resultTransactionSave.id;
        logOrderStatusSave.order_id = resultOrderSave.id;
        logOrderStatusSave = (await getDB().insert(logOrderStatusSave).into("seedang.log_order_status").returning('*'))[0];
        orderBalance.transaction_id = resultTransactionSave.id;
        orderBalance.order_id = resultOrderSave.id;
        orderBalance = (await getDB().insert(orderBalance).into("seedang.order_balance").returning('*'))[0];
        const rateIncome = (await getFromQuery("select p.* from seedang.income_rate p where p.package_name =" + req.package.packageName))[0]
        const coverageInput = JSON.stringify(req.package.coverages);
        let coverage = (await getFromQuery("select p.* from seedang.coverage p where p.coverage_detail =" +coverageInput))[0];
        if(!coverage){
            const coverageSave = {
                coverage_detail: coverageInput
            };
            const resultCoverage = (await getDB().insert(coverageSave).into("seedang.coverage").returning('*'))[0];
            coverage = resultCoverage;
        }
        for (const obj of req.insuranceDetails){
            let insurancePerson : PersonTable;
            insurancePerson = (await getFromQuery("select p.* from seedang.person p where p.id_card = "+ obj.person.idCard + " or p.passport = "+ obj.person.passport))[0];
            if(!insurancePerson){
                insurancePerson = (await getDB().insert(OrderCreateLogic.mapByPerson(obj.person)).into("seedang.person").returning('*'))[0];
            }
            let benefitPerson : PersonTable;
            benefitPerson = (await getFromQuery("select p.* from seedang.person p where p.id_card = "+ obj.benefitPerson.idCard + " or p.passport = "+ obj.benefitPerson.passport))[0];
            if(!benefitPerson){
                benefitPerson = (await getDB().insert(OrderCreateLogic.mapByPerson(obj.benefitPerson)).into("seedang.person").returning('*'))[0];
            }
            const insuranceSave = OrderCreateLogic.mapInsurance(req, insurancePerson.id, benefitPerson.id, resultOrderSave.id, rateIncome.id, coverage.id)
            await getDB().insert(insuranceSave).into('seedang.insurance')
        }

        return {paymentAmount: priceOrder};

    }
}