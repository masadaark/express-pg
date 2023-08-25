import { getDB } from "../db";
import { UserTable } from "../models/user.model";

export class UserFlow {
    static async checkUser(email: string): Promise<number> {
        const db = getDB();
        const user = await db.select().from("seedang.user").where("email", "=", email);
        return user.length ? user[0].id : undefined;
    }
    static async Insert(insertRow:UserTable): Promise<number> {
        const db = getDB();
        const [insertedUser] = await db.insert([insertRow]).into('seedang.user').returning('*');
        return insertedUser.id
    }
}