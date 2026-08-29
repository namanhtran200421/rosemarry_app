-- migrate:up
alter table id_verifications
    alter column verification_type drop not null;

alter type verification_status_enum
    add value if not exists 'IN_REVIEW';
 
alter table id_verifications
    add constraint uq_id_verifications_provider_ref
        unique (provider, provider_reference);

create index if not exists idx_id_verifications_user_created
    on id_verifications (user_id, created_at desc);
 
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;
 
drop trigger if exists trg_id_verifications_updated_at on id_verifications;
 
create trigger trg_id_verifications_updated_at
    before update on id_verifications
    for each row
    execute function set_updated_at();
 
create table verification_events (
    event_id        varchar(255) not null,
    processed_at    timestamptz not null default now(),
 
    constraint pk_verification_events primary key (event_id)
);
 
-- migrate:down
drop table if exists verification_events;
 
drop trigger if exists trg_id_verifications_updated_at on id_verifications;
 
drop function if exists set_updated_at();
 
drop index if exists idx_id_verifications_user_created;
 
alter table id_verifications
    drop constraint if exists uq_id_verifications_provider_ref;
 
update id_verifications
set status = 'PENDING'
where status = 'IN_REVIEW';
 
alter table id_verifications
    alter column status drop default;
 
alter type verification_status_enum rename to verification_status_enum_old;
 
create type verification_status_enum as enum (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'EXPIRED'
);
 
alter table id_verifications
    alter column status type verification_status_enum
    using status::text::verification_status_enum;
 
alter table id_verifications
    alter column status set default 'PENDING';
 
drop type verification_status_enum_old;
 
delete from id_verifications
where provider = 'didit'
  and verification_type is null;

alter table id_verifications
    alter column verification_type set not null;