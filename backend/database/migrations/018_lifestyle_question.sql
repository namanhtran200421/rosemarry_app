-- migrate:up

create table lifestyle_questions (
    lifestyle_question_id integer GENERATED ALWAYS AS IDENTITY,
    slug varchar(100) NOT NULL,
    question_text text NOT NULL,
    display_order smallint NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    constraint pk_lifestyle_questions
        primary key(lifestyle_question_id),

    constraint uq_lifestyle_questions_slug
        unique(slug),

    constraint uq_lifestyle_questions_display_order
        unique(display_order),

    constraint check_lifestyle_questions_display_order
        check(display_order > 0)
);

--migrate:down
DROP TABLE IF EXISTS lifestyle_questions;
