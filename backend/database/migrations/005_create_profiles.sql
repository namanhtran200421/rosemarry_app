--migrate:up
create type dating_goal_enum as enum ('LONG_TERM_RELATIONSHIP', 'CASUAL_DATING', 'FRIENDSHIP', 'UNSURE');

create table profiles(
    user_id integer NOT NULL,
    date_of_birth date NOT NULL,
    gender_id integer,
    bio text,
    dating_goal dating_goal_enum,
    display_name varchar(100) not null,
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now(),

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
