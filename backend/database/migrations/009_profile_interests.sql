-- migrate:up
create table profile_interests(
    user_id integer,
    interest_id integer,
    created_at timestamptz not null default now(),

    constraint pk_profile_interests primary key(user_id, interest_id),
    constraint fk_user_id foreign key (user_id) references profiles(user_id)
    on delete cascade,

    constraint fk_interest_id foreign key (interest_id) references interests(interest_id)
    on delete cascade
);

-- migrate:down
drop table if exists profile_interests;
