export interface PostgresqlConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

export interface ConnectionConfig {
    postgresql: PostgresqlConfig;
    serverport:number
    externalservice:Record<string,string>
    
}

export interface AppConfig {
    connection: ConnectionConfig;
}
