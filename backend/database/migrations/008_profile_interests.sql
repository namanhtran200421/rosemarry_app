-- migrate:up
create table profile_interests(
    user_id integer generated always as identity, 
    interest_id integer generated always as identity,
    created_at timestampz not null default now(),

    constraint pk_profile_interests primary key(user_id, interest_id)
);

-- migrate:down
drop table if exists profile_interests;
