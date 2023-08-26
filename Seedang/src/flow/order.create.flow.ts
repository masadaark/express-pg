import { OrderCreateLogic } from "../logic/order.create.logic";
import { CreateInsurance } from "../models/insurance.model";
import { getDB, getFromQuery } from '../db/index'
import { CoverageTable } from "../models/coverage.model";
import { CreateOrderModel, OrderTable } from "../models/order.model";
import { createError, s } from "../middleware/error";

export class CraeteOrderFlow {
    async CreateOrder(req: CreateOrderModel, userId: number): Promise<{ orderId: number; }> {
        const transactionSave = OrderCreateLogic.maptransaction(userId, 1);
        const resultTransactionSave = (await getDB().insert([transactionSave]).into("seedang.transaction").returning('*'))[0];
        const rateIncome = (await getFromQuery("select p.* from seedang.income_rate p where p.package_name = '" + req.package.packageName + "'"))[0]
        const coverage = await getDB().from("seedang.coverage").whereRaw(`coverage_detail::jsonb = '${JSON.stringify({ coverage: req.package.coverages })}'`);
        if (!coverage.length) {
            const coverageSave: CoverageTable = {
                coverage_detail: { coverage: req.package.coverages }
            };
            const resultCoverage = (await getDB().insert([coverageSave]).into("seedang.coverage").returning('*'))[0];
            coverage[0] = resultCoverage;
        }
        const orderSave: OrderTable = OrderCreateLogic.mapOrder(req, userId, rateIncome.id, coverage[0].id, resultTransactionSave.id);
        const resulatOrder = await getDB().insert(orderSave).into("seedang.order").returning('*')
        await getDB().insert(OrderCreateLogic.maplogOrderStatus(1, resulatOrder[0].id, resultTransactionSave.id)).into("seedang.log_order_status").returning('*')
        return { orderId: Number(resulatOrder[0].id) }
    }

    async CreateInsurance(req: CreateInsurance, userId: number): Promise<{ orderId: number; }> {
        const transactionSave = OrderCreateLogic.maptransaction(userId, 2);
        const resultTransactionSave = (await getDB().insert([transactionSave]).into("seedang.transaction").returning('*'))[0];
        const order: OrderTable[] = await getFromQuery("select p.* from seedang.order p where p.id = " + req.orderId);
        for (const obj of req.persons) {
            let insurancePerson = (await getFromQuery("select p.* from seedang.person p where p.id_card = '" + obj.person.idCard + "' or p.passport = '" + obj.person.passport + "'"))[0];
            if (!insurancePerson) {
                insurancePerson = (await getDB().insert(OrderCreateLogic.mapByPerson(obj.person)).into("seedang.person").returning('*'))[0];
            }
            let benefitPerson = (await getFromQuery("select p.* from seedang.person p where p.id_card = '" + obj.benefitPerson.idCard + "' or p.passport = '" + obj.benefitPerson.passport + "'"))[0];
            if (!benefitPerson) {
                benefitPerson = ((await getDB().insert(OrderCreateLogic.mapByPerson(obj.benefitPerson)).into("seedang.person").returning('*')))[0];
            }
            await getDB().insert(OrderCreateLogic.mapInsurance(req.orderId, insurancePerson.id, benefitPerson.id)).into("seedang.insurance").returning('*')
        }
        const price = Number(order[0].package_price) * req.persons.length;
        getDB().transaction(async trx => {
            try {
                await trx.insert(OrderCreateLogic.mapOrderBalance(price, price, req.orderId, resultTransactionSave.id)).into("seedang.order_balance").returning('*');
                const newLog = (await getDB().insert(OrderCreateLogic.maplogOrderStatus(2, req.orderId, resultTransactionSave.id)).into("seedang.log_order_status").returning('*'))[0];
                await trx.from('seedang.log_order_status').where('order_id', '=', req.orderId)
                    .andWhere('outdated_by', 'is', null).orderBy('created_at', 'asc').limit(1).update({ outdated_by: newLog.id });
                await trx.commit();
            } catch (err) {
                console.error(err);
                await trx.rollback();
                throw createError({status:s.UNPROCESSABLE})
            }
        })
        return { orderId: req.orderId }
    }
}