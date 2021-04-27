import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum MetricLevel {
  COMPANY = "COMPANY",
  AGENT = "AGENT"
}

registerEnumType(MetricLevel, {
  name: "MetricLevel"
});

@ObjectType()
@Entity("metric")
export class Metric extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  parent_metric: number;

  @Field(() => String)
  @Column()
  level: String;
}