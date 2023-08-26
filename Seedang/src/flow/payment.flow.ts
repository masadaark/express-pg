import { OrderCreateLogic } from "../logic/order.create.logic";
import { createError, s } from "../middleware/error";
import { PaymentRequest } from "../models/payment.model";
import { BalanceFlow } from "./balance.flow";
import t from '../enum/transaction.enum'
import { getDB } from "../db";
import { OrderBalanceTable } from "../models/order.model";
export class PaymentFlow {
    static async payment(paymentReq: PaymentRequest, userId: number) {
        const lastBalance = await BalanceFlow.getBalanceByOrderId(paymentReq.orderId);
        
        if (!lastBalance.length) {
            throw createError({
                status: s.BAD_REQUEST,
                message: "ไม่พบ order ค้างชำระในระบบ"
            });
        }

        const transaction = OrderCreateLogic.maptransaction(userId, t.Payment.id);

        if (paymentReq.full_paid) {
            try {
                const balance: number = lastBalance[0].balance;
                
                await getDB().transaction(async trx => {
                    const [transactionUpdated] = await trx.insert([transaction]).into("seedang.transaction").returning('*');

                    const balanceInsert: OrderBalanceTable = {
                        order_id: paymentReq.orderId,
                        amount: -balance,
                        balance: balance,
                        outdated_by: null,
                        transaction_id: transactionUpdated.id,
                    };
                    
                    const [balanceUpdated] = await trx.insert([balanceInsert]).from("seedang.order_balance").returning('*');
                    await trx.from("seedang.order_balance").where({ id: lastBalance[0].id }).update({ outdated_by: balanceUpdated.id });
                });

                return;
            } catch (error) {
                throw createError({
                    status: s.BAD_REQUEST,
                    message: "ระบบรองรับเฉพาะชำระเต็มจำนวน"
                });
            }
        } else {
            throw createError({
                status: s.BAD_REQUEST,
                message: "ระบบรองรับเฉพาะชำระเต็มจำนวน"
            });
        }
    }
}