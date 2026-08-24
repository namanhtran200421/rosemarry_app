--migrate:up

CREATE TABLE conversation_members (
    conversation_id int NOT NULL REFERENCES conversations (conversation_id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    last_read_message_id bigint REFERENCES messages (message_id) ON DELETE SET NULL,
    joined_at timestamptz NOT NULL DEFAULT now(),
    left_at timestamptz,

    PRIMARY KEY (conversation_id, user_id),

    CONSTRAINT conversation_members_left_after_joined CHECK (left_at IS NULL OR left_at >= joined_at)

);

--migrate:down
drop table if exists conversation_members;