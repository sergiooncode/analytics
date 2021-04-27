import { Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Metric } from "../../entity/metric";

@Resolver()
export class MetricResolver {

  @Query(() => [Metric])
  metrics() {
    const metricRepository = getRepository(Metric);
    return Metric.find();
  }
}