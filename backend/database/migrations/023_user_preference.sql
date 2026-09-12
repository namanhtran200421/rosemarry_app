-- migrate:up

CREATE TABLE user_preferences (
    user_id integer NOT NULL,
    min_age integer NOT NULL,
    max_age integer NOT NULL,
    max_distance_km integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT pk_user_preferences
        PRIMARY KEY (user_id),

    CONSTRAINT fk_user_preferences_profile
        FOREIGN KEY (user_id)
        REFERENCES profiles (user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_user_preferences_min_age
        CHECK (min_age >= 18),

    CONSTRAINT chk_user_preferences_age_range
        CHECK (max_age >= min_age),

    CONSTRAINT chk_user_preferences_distance
        CHECK (max_distance_km > 0)
);

-- migrate:down

DROP TABLE IF EXISTS user_preferences;
