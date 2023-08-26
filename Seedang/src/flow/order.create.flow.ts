import { OrderCreateLogic } from "../logic/order.create.logic";
import { CreateInsurance } from "../models/insurance.model";
import { getDB, getFromQuery } from '../db/index'
import { CoverageTable } from "../models/coverage.model";
import { CreateOrderModel, OrderStateDetail, OrderTable } from "../models/order.model";
import { createError, s } from "../middleware/error";
import orderstatusEnum from "../enum/orderstatus.enum";

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

    async CreateInsurance(req: CreateInsurance, userId: number): Promise<{ orderId: number , paymentAmount: number; }> {
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
                const cuurentLog = (await getFromQuery("select p.* from seedang.log_order_status p where p.order_id = "+ req.orderId))[0];
                const newLog = (await getDB().insert(OrderCreateLogic.maplogOrderStatus(2, req.orderId, resultTransactionSave.id)).into("seedang.log_order_status").returning('*'))[0];
                await trx.from('seedang.log_order_status').where('order_id', '=', req.orderId)
                    .andWhere('id', '=', cuurentLog.id).update({ outdated_by: newLog.id });
                await trx.commit();
            } catch (err) {
                console.error(err);
                await trx.rollback();
                throw createError({status:s.UNPROCESSABLE})
            }
        })
        return { orderId: req.orderId, paymentAmount: price}
    }

    async GetOrderState(userId: number) {
        const stateArray = [orderstatusEnum.WaitForCustomer.id, orderstatusEnum.WaitForPayment.id];
        return await getDB().from('seedang.order as o')
        .select('o.id as orderId', 'o.origin_country as originCountry', 'o.destination_country as destinationCountry', 'o.start_date as startDate', 'o.end_date as endDate', 'o.package_name as packageName')
        .join(
            getDB()
            .select('los.order_id', 'los.status_id as ostatus', 'os.name as oname')
            .from('seedang.log_order_status as los')
            .leftJoin('seedang.order_status as os', 'os.id', 'los.status_id')
            .whereIn('los.status_id', stateArray).andWhere('los.outdated_by', 'is', null)
            .as('logorder'),
            'logorder.order_id',
            'o.id'
        )
        .where('o.user_id', userId)
        .catch(error => {
            console.error(error);
            throw createError({status:s.UNPROCESSABLE});
            })
    }
}