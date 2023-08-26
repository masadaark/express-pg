import { OrderCreateLogic } from "../logic/order.create.logic";
import { createError, s } from "../middleware/error";
import { PaymentRequest } from "../models/payment.model";
import { BalanceFlow } from "./balance.flow";
import t from '../enum/transaction.enum'
import ors from '../enum/orderstatus.enum'
import { getDB } from "../db";
import { OrderBalanceTable } from "../models/order.model";
export class PaymentFlow {
    static async payment(paymentReq: PaymentRequest, userId: number) {
        const lastBalance = await BalanceFlow.getBalanceByOrderId(paymentReq.orderId);
        if (!lastBalance.length ) throw createError({
            status: s.BAD_REQUEST,
            message: "ไม่พบ order ค้างชำระในระบบ"
        });
        if(lastBalance[0].balance === 0) throw createError({
            status: s.BAD_REQUEST,
            message: "ไม่พบ order ค้างชำระในระบบ"
        });
        const transaction = OrderCreateLogic.maptransaction(userId, t.Payment.id);
        if (paymentReq.full_paid) {
            await getDB().transaction(async trx => {
                try {
                    const [transactionUpdated] = await trx.insert([transaction]).into("seedang.transaction").returning('*');
                    const balanceInsert: OrderBalanceTable = {
                        order_id: paymentReq.orderId,
                        amount: -lastBalance[0].balance,
                        balance: 0,
                        outdated_by: null,
                        transaction_id: transactionUpdated.id,
                    };
                    const [balanceUpdated] = await trx.insert([balanceInsert]).from("seedang.order_balance").returning('*');
                    await trx.from("seedang.order_balance").where({ id: lastBalance[0].id }).update({ outdated_by: balanceUpdated.id });
                    const [newLog] = await trx.insert([{
                        status_id: ors.PaymentSuccess.id,
                        order_id: paymentReq.orderId,
                        transaction_id: transactionUpdated.id
                    }]).into("seedang.log_order_status").returning('*')
                    await trx.from('seedang.log_order_status').where('order_id', '=', paymentReq.orderId)
                        .andWhere('outdated_by', 'is', null).orderBy('created_at', 'asc').limit(1).update({ outdated_by: newLog.id });
                    await trx.commit()
                } catch {
                   await trx.rollback()
                }
            });
        } else {
            throw createError({
                status: s.BAD_REQUEST,
                message: "ระบบรองรับเฉพาะชำระเต็มจำนวน"
            });
        }
    }
}