--migrate:up
create table users_location (
    user_id integer not null,
    latitude numeric(9,6) not null,
    longitude numeric (9,6) not null,
    postcode text,
    city varchar(100),
    state varchar(100),
    country VARCHAR(100),
    location_updated_at timestamptz not null default now(),

    constraint pk_users_location primary key (user_id),
    constraint fk_users_location_user
        foreign key (user_id) references users (user_id)
        on delete cascade
);
--migrate:down
drop table if exists users_location;