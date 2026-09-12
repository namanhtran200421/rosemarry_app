-- migrate:up
CREATE TABLE profile_prompts (
    user_id integer NOT NULL,
    prompt_id integer NOT NULL,
    answer text NOT NULL,
    display_order smallint NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT pk_profile_prompts
        PRIMARY KEY (user_id, prompt_id),

    CONSTRAINT fk_profile_prompts_profile
        FOREIGN KEY (user_id)
        REFERENCES profiles (user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profile_prompts_prompt
        FOREIGN KEY (prompt_id)
        REFERENCES prompts (prompt_id),

    CONSTRAINT uq_profile_prompts_display_order
        UNIQUE (user_id, display_order),

    CONSTRAINT chk_profile_prompts_display_order
        CHECK (display_order BETWEEN 1 AND 3),

    CONSTRAINT chk_profile_prompts_answer_not_blank
        CHECK (length(trim(answer)) > 0)
);


-- migrate:down
DROP TABLE IF EXISTS profile_prompts;
