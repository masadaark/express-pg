import { AppConfig } from "../models/config.model";

let buildStage: string = 'local'

let config: AppConfig


export function setUpConfig() {
    if (process.env.BUILD_STAGE !== undefined && process.env.BUILD_STAGE !== '') {
        buildStage = process.env.BUILD_STAGE;
    }
    config = require(`../env/env.${buildStage}.json`)
}

export function getAppConfig(): AppConfig {
    return config;
}