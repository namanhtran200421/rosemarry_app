-- migrate:up
--
-- Restore the users table after it was accidentally dropped with CASCADE.
-- The enum types were not removed by DROP TABLE, so this migration reuses them.
create table users (
    user_id integer generated always as identity,
    auth_provider_user_id varchar(255) not null,
    account_status account_status_enum not null default 'ACTIVE',
    user_role user_role_enum not null default 'USER',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint pk_user primary key (user_id),
    constraint uq_users_auth_provider_user_id unique (auth_provider_user_id)
);

-- DROP TABLE ... CASCADE removed these foreign keys while leaving their tables.
alter table users_location
    add constraint fk_users_location_user
    foreign key (user_id) references users (user_id)
    on delete cascade;

alter table profiles
    add constraint fk_profiles_user
    foreign key (user_id) references users (user_id)
    on delete cascade;

alter table circle_members
    add constraint circle_members_user_id_fkey
    foreign key (user_id) references users (user_id)
    on delete cascade;

alter table messages
    add constraint messages_user_id_fkey
    foreign key (user_id) references users (user_id)
    on delete set null;

alter table conversation_members
    add constraint conversation_members_user_id_fkey
    foreign key (user_id) references users (user_id)
    on delete cascade;

-- Six verification rows belong to users that no longer exist. NOT VALID keeps
-- those historical rows while enforcing the relationship for every new write.
alter table id_verifications
    add constraint fk_id_verifications_user
    foreign key (user_id) references users (user_id)
    on delete cascade
    not valid;

-- migrate:down
-- Dropping users with CASCADE also removes all foreign keys restored above.
drop table if exists users cascade;
