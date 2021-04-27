# analytics

## Assumptions

## Important details

- Dockerization is only used for local development, not for production

- ORM (TypeORM) is used because queries using ORM are more readable but the ORM allows to issue raw SQL queries

- Jest https://github.com/kulshekhar/ts-jest/issues/1913

- I use webpack

- The main differences between GraphQL and REST are:

GraphQL eliminates the well-known REST problem: underfetching and overfetching
GraphQL allows for rapid product iteration on the frontend
GraphQL uses SDL (Schema Definition Language) which serves the contract on the line client-server to define the client's data access.
