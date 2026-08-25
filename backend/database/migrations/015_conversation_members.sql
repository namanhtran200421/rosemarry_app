--migrate:up

CREATE TABLE conversation_members (
    conversation_id int NOT NULL REFERENCES conversations (conversation_id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    last_read_message_id bigint,
    joined_at timestamptz NOT NULL DEFAULT now(),
    left_at timestamptz,

    PRIMARY KEY (conversation_id, user_id),

    CONSTRAINT conversation_members_left_after_joined CHECK (left_at IS NULL OR left_at >= joined_at),
    
    CONSTRAINT conversation_members_last_read_message_fk
        FOREIGN KEY (conversation_id, last_read_message_id)
        REFERENCES messages (conversation_id, message_id)
        ON DELETE SET NULL (last_read_message_id)
);

);

--migrate:down
drop table if exists conversation_members;
