-- migrate:up

CREATE TABLE profile_lifestyle_answers (
    user_id integer NOT NULL,
    lifestyle_question_id integer NOT NULL,
    lifestyle_option_id integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT pk_profile_lifestyle_answers
        PRIMARY KEY (user_id, lifestyle_question_id),

    CONSTRAINT fk_profile_lifestyle_answers_profile
        FOREIGN KEY (user_id)
        REFERENCES profiles (user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profile_lifestyle_answers_question
        FOREIGN KEY (lifestyle_question_id)
        REFERENCES lifestyle_questions (lifestyle_question_id),

    CONSTRAINT fk_profile_lifestyle_answers_option
        FOREIGN KEY (lifestyle_option_id, lifestyle_question_id)
        REFERENCES lifestyle_options (lifestyle_option_id, lifestyle_question_id)
);
--migrate:down
DROP TABLE IF EXISTS profile_lifestyle_answers;
