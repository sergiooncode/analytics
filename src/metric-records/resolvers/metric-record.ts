import { Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { MetricRecord } from "../../entity/metric-record";

@Resolver()
export class MetricRecordResolver {

  @Query(() => [MetricRecord])
  metricRecords() {
    const metricRecordRepository = getRepository(MetricRecord);
    return metricRecordRepository.find({
      order: {
        created_at: "DESC"
      }
    });
  }
}