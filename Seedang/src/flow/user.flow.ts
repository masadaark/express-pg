import { Knex } from "knex";
import { getDB } from "../db";
import { UserTable } from "../models/user.model";

export class UserFlow {
    static async checkUser(email: string): Promise<number> {
        const db = getDB();
        const user = await db.select().from("seedang.user").where("email", "=", email);
        return user.length ? user[0].id : undefined;
    }
    static async getUserById(id: number): Promise<UserTable[]> {
        const db = getDB();
        const user = await db.select().from("seedang.user").where("id", "=", id);
        return user;
    }
    static async Insert(insertRow: UserTable[]): Promise<number> {
        const trx: Knex.Transaction = await getDB().transaction();
        try {
            const [insertedUser] = await trx.insert(insertRow).into('seedang.user').returning('*');
            await trx.commit();
            return insertedUser.id;
        } catch (error) {
            await trx.rollback();
            console.error(error);
        }
    }
}