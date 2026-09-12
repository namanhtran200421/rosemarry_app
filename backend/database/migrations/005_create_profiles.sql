--migrate:up
CREATE TYPE dating_goal_enum AS ENUM (
    'LONG_TERM_RELATIONSHIP',
    'SHORT_TERM_RELATIONSHIP',
    'CASUAL_DATING',
    'NEW_FRIENDS',
    'NOT_SURE_YET'
);

create table profiles(
    user_id integer NOT NULL,
    date_of_birth date,
    gender_id integer,
    bio text,
    dating_goal dating_goal_enum,
    display_name varchar(100) not null,
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    height_cm smallint, 
    onboard_completed_at timestamptz not null, 
    onboarding_stage varchar(50) not null,

    constraint pk_profiles primary key (user_id),
    constraint fk_profiles_user
        foreign key (user_id) references users (user_id)
        on delete cascade,
    constraint fk_profiles_gender
        foreign key (gender_id) references genders (gender_id)
        on delete set null
);

--migrate:down
drop table if exists profiles;
drop type if exists dating_goal_enum;
