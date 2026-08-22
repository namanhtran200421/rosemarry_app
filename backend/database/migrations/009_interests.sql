-- migrate:up
create table interests(
    interest_id integer generated always as identity,
    interest_name varchar(100) not null ,
    slug varchar(100) not null,
    is_active BOOLEAN not null ,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
   

    constraint pk_interest primary key(interest_id)
);

-- migrate:down
drop table if exists interests;
