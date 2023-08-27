import dayjs from "dayjs";
import { CoverageTable } from "../models/coverage.model";
import { InsuranceTable } from "../models/insurance.model";
import { OrderTable } from "../models/order.model";
import { PersonTable } from "../models/person.model";
import { InsuranceQuote, PolicyTable } from "../models/policy.model";
import { CoverageFlow } from "./coverage.flow";
import { InsuranceFlow } from "./insurance.flow";
import { OrderFlow } from "./order.flow";
import { UserFlow } from './user.flow';
import { PolicyLogic } from "../logic/policy.logic";
import axios from "axios";
import { externalService } from "../config/env.config";
import { getDB } from "../db";
import { createError } from "../middleware/error";

export class PolicyFlow {
    static async apply(orderId: number, userId: number) {
        const email: string = (await UserFlow.getUserById(userId))[0].email
        const order: OrderTable = await OrderFlow.getOneById(orderId)
        const coverage: CoverageTable = await CoverageFlow.getByOrderId(orderId)
        const insurancePerson = await InsuranceFlow.getInsurancePersonByOrderId(orderId)
        const insurances: InsuranceTable[] = insurancePerson.insurance
        const persons: PersonTable[] = insurancePerson.person
        const policySave: PolicyTable[] = []
        const benefitPersonSet = new Set(insurances.map(insurance => insurance.benefit_person_id))
        for (const insurance of insurances) {
            const benefitPerson = persons.find(person => person.id === insurance.benefit_person_id)
            const ownerPerson = persons.find(person => person.id === insurance.owner_person_id)
            const policyAppy: InsuranceQuote = {
                quote: {
                    originCountry: order.origin_country,
                    destinationCountry: order.destination_country,
                    startDate: dayjs(order.start_date).toISOString(),
                    endDate: dayjs(order.end_date).toISOString(),
                    plan: {
                        packageName: order.package_name,
                        packagePrice: {
                            value: order.package_price,
                            unit: "Baht"
                        },
                        coverages: coverage.coverage_detail.coverage
                    }
                },
                policyHolder: {
                    title: ownerPerson.title,
                    firstName: ownerPerson.first_name,
                    lastName: ownerPerson.last_name,
                    birthDate: dayjs(ownerPerson.birth_date).toISOString(),
                    email: email,
                    isPolicyBeneficiary: benefitPersonSet.has(ownerPerson.id),
                    registrations: PolicyLogic.registrationPerson(ownerPerson),
                    phone: {
                        internationalPrefix: "+66",
                        number: ownerPerson.phone
                    }
                },
                address: {
                    streetAddress: ownerPerson.address,
                    postalCode: ownerPerson.portal_code,
                    city: ownerPerson.city,
                    country: ownerPerson.county
                },
                beneficiary: {
                    title: benefitPerson.title,
                    firstName: benefitPerson.first_name,
                    lastName: benefitPerson.last_name,
                    email: email,
                    registrations: PolicyLogic.registrationPerson(benefitPerson),
                    phone: {
                        internationalPrefix: "+66",
                        number: ownerPerson.phone
                    },
                    relationship: ""
                }
            }
            const responsePolicy = (await axios.post(externalService().insurancepolicy, policyAppy, {
                headers: {
                    'Content-Type': 'application/json',
                    apiKey: "TURBOHACK2023"
                }
            })).data
            const policyInsert: PolicyTable = {
                insurance_id: insurance.id,
                policy_number: responsePolicy.policyId,
                policy_url: responsePolicy.policyDocumentFileUrl,
            }
            policySave.push(policyInsert)
            try {
                await getDB().insert([policyInsert]).into("seedang.policy").returning('*');
            } catch (err) {
                console.error(err)
                throw createError({
                    status: 400,
                    message: `ไม่สามารถบันทึก policy insuranceId ${insurance.id} ได้`
                })
            }
        }
        return policySave
    }
    static async getByUserId(userId: number) {
        const db = getDB()
        const orders: OrderTable[] = await db.select().from("seedang.order").where("user_id", "=", userId)
        if (!orders.length) return [];
        const orderIds: number[] = [...new Set(orders.map(order => order.id))]
        const insurances: InsuranceTable[] = await db.select('*')
            .from("seedang.insurance")
            .whereIn('order_id', orderIds);
        if (!insurances.length) return [];
        const policys: PolicyTable[] = await db.select('*')
            .from("seedang.policy")
            .whereIn('insurance_id', [...new Set(insurances.map(insurance => insurance.id))]);
        if (!policys.length) return [];
        return orderIds.map(orderId => {
            const insuranceIdOrder: number[] = insurances
                .filter(insurance => Number(insurance.order_id) === Number(orderId))
                .map(insurance => insurance.id)
            return {
                orderId: orderId,
                policys: policys.filter(policy => insuranceIdOrder.includes(policy.insurance_id))
            }
        })
    }
}