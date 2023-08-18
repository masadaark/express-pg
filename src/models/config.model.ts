export interface PostgresqlConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

export interface ConnectionConfig {
    postgresql: PostgresqlConfig;
}

export interface AppConfig {
    connection: ConnectionConfig;
}
