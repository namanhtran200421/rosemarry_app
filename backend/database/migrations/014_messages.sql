--migrate:up
CREATE TYPE message_type_enum AS ENUM ('text', 'media', 'system');

CREATE TABLE messages (
    message_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id int NOT NULL REFERENCES CONVERSATIONS (conversation_id) ON DELETE CASCADE,
    user_id int REFERENCES users (user_id) ON DELETE SET NULL,
    message_type message_type_enum NOT NULL DEFAULT 'text',
    body text,
    created_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,

    CONSTRAINT message_system_has_no_sender CHECK (message_type <> 'system' OR user_id IS NULL),

    CONSTRAINT messages_conversation_message_unique
    UNIQUE (conversation_id, message_id),

    CONSTRAINT message_text_has_body CHECK (message_type <> 'text' OR (body IS NOT NULL AND length(btrim(body)) > 0))
);

--migrate:down
drop table if exists messages;
drop type if exists message_type_enum;
