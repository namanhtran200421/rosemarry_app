-- migrate:up

CREATE TABLE profile_gender_preferences (
    user_id integer NOT NULL,
    gender_id integer NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT pk_profile_gender_preferences
        PRIMARY KEY (user_id, gender_id),

    CONSTRAINT fk_profile_gender_preferences_profile
        FOREIGN KEY (user_id)
        REFERENCES profiles (user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profile_gender_preferences_gender
        FOREIGN KEY (gender_id)
        REFERENCES genders (gender_id)
        ON DELETE CASCADE
);

-- migrate:down

DROP TABLE IF EXISTS profile_gender_preferences;
