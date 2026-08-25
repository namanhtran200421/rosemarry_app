--migrate:up

CREATE TYPE conversation_type_enum AS ENUM ('direct', 'circle');

CREATE TABLE conversations(
    conversation_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type conversation_type_enum NOT NULL,
    cycle_id int REFERENCES circle_cycles (cycle_id) ON DELETE CASCADE,
    dm_key varchar(64),
    last_message_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    -- Circles have cycles and cycle IDs, private messages have DM keys
    CONSTRAINT conversations_shape CHECK (
        (type = 'circle' AND cycle_id IS NOT NULL AND dm_key IS NULL)
        OR (type = 'direct' AND cycle_id IS NULL AND dm_key IS NOT NULL)
    ),

    CONSTRAINT conversations_dm_key_unique UNIQUE (dm_key)
);

--migrate:down
drop table if exists conversations;
drop type if exists conversation_type_enum;
