import { getDB } from "../db";
import { UserTable } from "../models/user.model";

export class UserFlow {
    static async checkUser(email: string): Promise<boolean> {
        const db = getDB();
        const user = await db.select("seedang.user").where("email", "=", email);
        return user.length ? user[0].id : undefined;
    }
    static async Insert(insertRow:UserTable): Promise<boolean> {
        const db = getDB();
        const [insertedUser] = await db.insert([insertRow]).into('jaggy.user').returning('*');
        return insertedUser.id
    }
}