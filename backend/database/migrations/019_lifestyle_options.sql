-- migrate:up

create table lifestyle_options (
    lifestyle_option_id integer GENERATED ALWAYS AS IDENTITY,
    lifestyle_question_id integer NOT NULL,
    slug varchar(100) NOT NULL,
    label varchar(100) NOT NULL,
    display_order smallint NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT pk_lifestyle_options
        PRIMARY KEY (lifestyle_option_id),

    CONSTRAINT fk_lifestyle_options_question
        FOREIGN KEY (lifestyle_question_id)
        REFERENCES lifestyle_questions (lifestyle_question_id),

    CONSTRAINT uq_lifestyle_options_question_slug
        UNIQUE (lifestyle_question_id, slug),

    CONSTRAINT uq_lifestyle_options_question_display_order
        UNIQUE (lifestyle_question_id, display_order),

    CONSTRAINT uq_lifestyle_options_id_question
        UNIQUE (lifestyle_option_id, lifestyle_question_id),

    CONSTRAINT chk_lifestyle_options_display_order
        CHECK (display_order > 0)
);

--migrate:down
DROP TABLE IF EXISTS lifestyle_options;
