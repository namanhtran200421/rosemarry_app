-- migrate:up
create table interests(
    interest_id integer generated always as identity,
    interest_name not null varchar(100),
    slug not null varchar(100),
    is_active not null BOOLEAN,
    created_at not null timestamptz  default now(),
    updated_at not null timestamptz 
   

    constraint pk_interest primary key(interest_id)
);

-- migrate:down
drop table if exists interests;
