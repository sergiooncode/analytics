import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Metric } from './metric';

@ObjectType()
@Entity("metric_record")
export class MetricRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  value: number;

  @Field()
  @Column({ type: "timestamp" })
  created_at: Date;

  @Field()
  @OneToOne(() => Metric)
  @JoinColumn({name: "metric_id", referencedColumnName: "id"})
  metric: Metric;
}