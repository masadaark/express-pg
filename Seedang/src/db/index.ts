import knex, { Knex } from "knex";
import path from "path";
import { appConfig } from "../config/env.config";

let db: Knex;

export async function setUpDB() {
    const pgConnection = appConfig().connection.postgresql;
    db = knex({
        client: 'pg',
        connection: pgConnection,
        migrations: {
            directory: path.join(__dirname, '/migration'),
        },
        seeds: {
            directory: path.join(__dirname, '/seeds'),
        },
        pool: {
            max: 10
        },
    });
    await db.schema.createSchema("seedang").catch(err=> console.error(err))
    await db.migrate.latest();
    console.log('Migrated success!!');
    await db.seed.run();
    console.log('Seeded success!!');
}

export const getDB = (): Knex => {
    return db
}

export async function getFromQuery(query: string) {
    try {
        const queryResponse = await db.select('modelquery.*')
            .fromRaw('(' + query + ') as modelquery');
        return queryResponse;
    } catch (error) {
        console.error("Error executing query:", error);
        return [];
    }
}