// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// /* @Module({
//     imports: [
//         TypeOrmModule.forRoot({
//             type: 'postgres',
//             host: 'localhost',
//             port: 5432,
//             username: 'user',
//             password: 'password',
//             database: 'your_database',
//             entities: [__dirname + '/entities/*.entity{.ts,.js}'],
//             synchronize: true,
//         }),
//     ],
//     exports: [TypeOrmModule],
// })
// export class DatabaseModule { } */

// @Module({
//     imports: [
//       TypeOrmModule.forRootAsync({
//         useFactory: async (configService: ConfigService) => ({
//           type: 'postgres',
//           host: configService.get('DATABASE_HOST'),
//           port: configService.get('DATABASE_PORT'),
//           username: configService.get('DATABASE_USER'),
//           password: configService.get('DATABASE_PASSWORD'),
//           database: configService.get('DATABASE_NAME'),
//           entities: [__dirname + '/entities/*.entity{.ts,.js}'],
//           synchronize: true,
//         }),
//         inject: [ConfigService],
//       }),
//     ],
//   })
//   export class DatabaseModule {}

// libs/database/src/database.module.ts

/* import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService], 
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}



 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Users } from './entity/user.entity';
import { Session } from './entity/session.entity';
import { Products } from './entity/product.entity';
console.log(process.env.DATABASE_NAME)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: `${process.env.DATABASE_USER}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      entities: [Users, Session, Products],
    }),
  ],
})
export class DatabaseModule { }
