import { User, UserTable } from "../models/user.model";


export function mapUserToUserTable(user: User): UserTable {
    const userTable: UserTable = {
        email: user.email,
        phone: user.phone
    };
    if (!user.firstName) userTable.first_name = user.firstName;
    if (!user.lastName)  userTable.last_name = user.lastName;
    return userTable;
}