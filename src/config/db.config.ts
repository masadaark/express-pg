import pgPromise from "pg-promise"
import promise from 'bluebird';
import { PostgresqlConfig } from "../models/config.model";
import { getAppConfig } from "./env.config";

const pgp = pgPromise({
    promiseLib: promise
})

let db

export const getDB = () => {
    return db
}

export const setUpDB = () => {
    const dsn: string = buildConnectionString(getAppConfig().connection.postgresql)
    try {
        const connectionOptions = {
            connectionString: dsn,
            max: 10,
            idleTimeoutMillis: 30000,
        }

        db = pgp(connectionOptions)
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
}

function buildConnectionString(config: PostgresqlConfig): string {
    return `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}