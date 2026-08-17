--migrate:up
create type verification_type_enum as enum (
    'PASSPORT',
    'DRIVERS_LICENSE',
    'NATIONAL_ID',
    'PROOF_OF_AGE_CARD',
    'RESIDENCE_PERMIT'
);

create type verification_status_enum as enum ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

create table id_verifications (
    verification_id     integer generated always as identity,
    user_id               integer not null,
    verification_type    verification_type_enum not null,
    provider               varchar(100) not null, -- diagram had 'bool'; this is a vendor name (e.g. Onfido, Jumio), not a flag
    provider_reference    varchar(255), -- diagram left length unset (varchar(?)); size to match your provider's id format
    status                  verification_status_enum not null default 'PENDING',
    updated_at             timestamptz not null default now(),
    verified_at            timestamptz,
    expires_at             timestamptz,
    created_at             timestamptz not null default now(),
 
    constraint pk_id_verifications primary key (verification_id),
    constraint fk_id_verifications_user
        foreign key (user_id) references users (user_id)
        on delete cascade
);

--migrate:down
drop table if exists id_verifications;
drop type if exists verification_type_enum;
