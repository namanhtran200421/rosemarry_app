--migrate:up

CREATE TABLE circle_members (
    cycle_id int NOT NULL REFERENCES circle_cycles(cycle_id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    joined_at timestamptz not null default now(),
    left_at timestamptz,

    PRIMARY KEY (cycle_id, user_id),

    CONSTRAINT circle_members_left_after_joined CHECK (left_at IS NULL or left_at >= joined_at)
);

--migrate:down
drop table if exists circle_members;