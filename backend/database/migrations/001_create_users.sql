-- migrate:up

-- Enums Types Goes Here
create type accoout_status_enum as enum (
    'ACTIVE',
    'SUSPENDED',
    'DELETED'
)
-- Tables Goes Here
create table users (
    user_id INTEGER generated always as identity,
    account_status accoout_status_enum not null default 'ACTIVE',

    constraint pk_user
    primary key (user_id)
    
    )

-- migrate:down
drop table if exist users;
drop type if exist account_status_enums;