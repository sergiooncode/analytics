import { ApolloServer } from "apollo-server-lambda";
import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { buildSchema } from "type-graphql";
import { Connection, createConnection, getConnection, getRepository } from "typeorm";
import { Metric, MetricLevel } from "../../../entity/metric";
import { MetricRecord } from "../../../entity/metric-record";
import { MetricResolver } from "../../../metrics/resolvers/metric";
import { MetricRecordResolver } from "../../resolvers/metric-record";

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

test("query metric records", async () => {
  const metric1 = new Metric();
  metric1.id = 1
  metric1.name = "untaken_calls"
  metric1.level = MetricLevel.COMPANY
  await getConnection().manager.save(metric1);

  const metric2 = new Metric();
  metric2.id = 2
  metric2.name = "forwarded_calls"
  metric2.level = MetricLevel.AGENT
  await getConnection().manager.save(metric2);

  const metricRecord = new MetricRecord();
  metricRecord.id = 1
  metricRecord.value = 100
  metricRecord.metric = metric2
  await getConnection().manager.save(metricRecord);

  const schema = await buildSchema({
    resolvers: [MetricResolver, MetricRecordResolver]
  });

  const serverTest = new ApolloServer({ schema });

  const GET_METRIC_RECORDS = gql`
    query {
      metricRecords {
        value
        created_at
      }
    }
  `;

  const { query } = createTestClient(serverTest);
  
  const res = await query({ query: GET_METRIC_RECORDS });
  
  expect(res).toMatchSnapshot();
});