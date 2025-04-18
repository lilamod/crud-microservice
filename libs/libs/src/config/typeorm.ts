import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import * as path from "path";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });
const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USER}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: [path.join(process.cwd(), '', '/dist/libs/libs/src/**/*.entity{.ts,.js}')],
    migrations: [path.join(process.cwd(), '', '/dist/libs/libs/src/migrations/*{.ts,.js}')],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);
