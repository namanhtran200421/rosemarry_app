--migrate:up
CREATE TYPE cycle_status_enum AS ENUM ('forming', 'active', 'closed');

CREATE TABLE circle_cycles (
    cycle_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    circle_id int NOT NULL REFERENCES circles (circle_id) ON DELETE CASCADE,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    status cycle_status_enum NOT NULL DEFAULT 'forming',
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT circle_cycles_window_valid CHECK (ends_at > starts_at),

    CONSTRAINT circle_cycles_one_per_start UNIQUE (circle_id, starts_at)
);

--migrate:down
drop table if exists circle_cycles;
drop type if exists cycle_status_enum;
