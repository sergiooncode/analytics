import { ApolloServer } from "apollo-server-lambda";
import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { buildSchema } from "type-graphql";
import { createConnection, getConnection, getRepository } from "typeorm";
import { Metric, MetricLevel } from "../../../entity/metric";
import { MetricRecord } from "../../../entity/metric-record";
import { MetricResolver } from "../../resolvers/metric";
import { MetricRecordResolver } from "../../../metric-records/resolvers/metric-record";

beforeEach(() => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "analytics",
    password: "password",
    database: "test_analytics",
    entities: [Metric, MetricRecord],
    logger: "advanced-console",
  });
});

afterEach(() => {
  let conn = getConnection();
  return conn.close();
});

test("query metrics", async () => {
  await getRepository(Metric).insert({
    id: 1,
    name: "untaken_calls",
    level: MetricLevel.COMPANY
  });
  await getRepository(Metric).insert({
    id: 2,
    name: "forwarded_calls",
    parent_metric: 1,
    level: MetricLevel.AGENT
  });

  const schema = await buildSchema({
    resolvers: [MetricResolver, MetricRecordResolver]
  });

  const serverTest = new ApolloServer({ schema });

  const GET_METRICS = gql`
    query {
      metrics {
        id
        name
        parent_metric
        level
      }
    }
  `;

  const { query } = createTestClient(serverTest);
  
  const res = await query({ query: GET_METRICS });
  
  expect(res).toMatchSnapshot();
});