import { AppConfig } from "../models/config.model";
import * as fs from 'fs';

let buildStage: string = 'local';
let config: AppConfig;

export function setUpConfig() {
    if (process.env.BUILD_STAGE !== undefined && process.env.BUILD_STAGE !== '') {
        buildStage = process.env.BUILD_STAGE;
    }
    const configFilePath = `${__dirname}/env.${buildStage.toLowerCase()}.json`;
    const configData = fs.readFileSync(configFilePath, 'utf-8');
    config = JSON.parse(configData) as AppConfig;
}

export const appConfig = (): AppConfig => {
    return config
}

export const externalService = ()=>{
    return config.connection.externalservice
}