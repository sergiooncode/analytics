# analytics

## How to run the API

- Build/run the docker stack for dev purposes:

`docker-compose up -d --build`

- Load seed data (not ideal way to do it, using TypeORM data seeing remained as pending work):

`docker cp ./pg_init.sql postgres:.`
`docker exec -t postgres psql -U postgres -f /pg_init.sql`

- Navigate to http://0.0.0.0:3000/dev/metrics and issue the query


```
{
  metrics {
    name
    parent_metric
    level
  }
}
```

- Navigate to http://0.0.0.0:3000/dev/metric-records and issue the query

```
{
  metricRecords {
    value
    created_at
  }
}
```

Note: unfortunately at moment once we issue a query in one endpoint even accessing the other one through GraphQL UI throws the error:

`CannotConnectAlreadyConnectedError: Cannot create a "default" connection because connection to the database already established.`

## Assumptions and important details

- Dockerization is only used for local development, not for production

- ORM (TypeORM) is used because queries using ORM are more readable but that the good about TypeORM is that it allows to use it in Active Record or Object Mapper modes, in Builder pattern mode or just writing plain raw SQL queries.

- I use Jest for testing but I only got to write a couple of snapshot tests.

- I use webpack because having all the dependencies bundled up is a good thing when deploying to a Lambda environment.
