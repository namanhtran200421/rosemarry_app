-- migrate:up

CREATE TABLE prompts (
    prompt_id integer GENERATED ALWAYS AS IDENTITY,
    prompt_text text NOT NULL,
    slug varchar(100) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT pk_prompts
        PRIMARY KEY (prompt_id),

    CONSTRAINT uq_prompts_slug
        UNIQUE (slug)
);

-- migrate:down
DROP TABLE IF EXISTS prompts;
