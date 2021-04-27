import "reflect-metadata";
import {
  Context,
  APIGatewayProxyEvent,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";
import { ApolloServer } from "apollo-server-lambda";
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';

import { MetricResolver } from "./metrics/resolvers/metric";
import { Metric } from "./entity/metric"
import { MetricRecordResolver } from "./metric-records/resolvers/metric-record";
import { MetricRecord } from "./entity/metric-record";

async function bootstrap(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
  const connection = await createConnection({
    type: "postgres",
    host: "postgres",
    port: 5432,
    username: "analytics",
    password: "password",
    database: "analytics",
    entities: [Metric, MetricRecord],
    logger: "advanced-console",
  });

  const schema = await buildSchema({
    resolvers: [MetricResolver, MetricRecordResolver],
    dateScalarMode: "isoDate"
  });

  const server = new ApolloServer({ schema });
  server.createHandler()(event, context, callback);
}

export function graphql(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
  bootstrap(event, context, callback);
}
