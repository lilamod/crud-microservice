## Node version
 18.20.0

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


# Note
When you first time run this product first change the node version to 18.20

Install node_module using npm i command

Before start the product first create a migration for entity as I have used sync: false to
auto create entity in postgres for safety purpose of data lose

To create migration use below command

    1.npm run migration:create --name=your_migration_name
    2. In migration the table is create so add the query to create a entity of user, session and produt
    After creation of migration run below command

    npm run migration:run

# To start project 

Please check the rabbitMQ server is start or not if not start then start rabbitMQ server

commnd to build the project
npm run build

run the below command to start servies
npm run start:dev 
