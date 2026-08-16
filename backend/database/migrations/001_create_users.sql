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
    auth_provider_user_id varchar(255) NOT NULL,
    account_status account_status_enum not null default 'ACTIVE',
    user_role user_role_enum NOT NULL default 'USER',
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now(),

    constraint pk_user primary key (user_id),
    constraint uq_users_auth_provider_user_id unique (auth_provider_user_id)

    
    )

-- migrate:down
drop table if exist users;
drop type if exist account_status_enum;