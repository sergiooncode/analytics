CREATE USER analytics WITH PASSWORD 'password';

CREATE DATABASE "analytics" WITH OWNER "analytics" ENCODING 'UTF8';

\c analytics
set role analytics;

CREATE TYPE metric_level AS ENUM (
  'AGENT', 'COMPANY'
);


CREATE TABLE metric (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(30) NOT NULL,
  parent_metric INT,
  level metric_level
);


INSERT INTO metric VALUES
  (1, 'untaken_calls', null, 'COMPANY'), (2, 'forwarded_calls', 1, 'AGENT'), (3, 'drop_calls', null, 'COMPANY');

CREATE TABLE metric_record (
  id    SERIAL PRIMARY KEY,
  value INT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
  metric_id INT,
  CONSTRAINT fk_metric
    FOREIGN KEY(metric_id)
       REFERENCES metric(id)
);

INSERT INTO metric_record(id, value, metric_id) VALUES
  (1, 100, 2);
