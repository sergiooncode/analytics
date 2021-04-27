import "reflect-metadata";
import {
  Context,
  APIGatewayProxyEvent,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchema } from 'type-graphql';
import { MetricRecordResolver } from "./resolvers/metric-record";
import { MetricRecord } from "../entity/metric-record";
import { Connection, createConnection, getConnection, getConnectionManager } from "typeorm";
import { Metric } from "../entity/metric";

async function bootstrap(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) {
    const connectionManager = getConnectionManager();
    let db: Connection;

    if(!connectionManager.has("default")){
        connectionManager.create({
            type: "postgres",
            host: "postgres",
            port: 5432,
            username: "analytics",
            password: "password",
            database: "analytics",
            entities: [MetricRecord, Metric],
            logger: "advanced-console",
        });
    }

    try {
        db = getConnection();
        await db.connect();
    } catch (error) {
        console.log(error);
        return;
    }
    /* await createConnection({
        type: "postgres",
        host: "postgres",
        port: 5432,
        username: "analytics",
        password: "password",
        database: "analytics",
        entities: [MetricRecord, Metric],
        logger: "advanced-console",
    }); */

  const schema = await buildSchema({
    resolvers: [MetricRecordResolver]
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
