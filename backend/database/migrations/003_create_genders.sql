
--migrate:up
create table genders (
    gender_id integer generated always as identity,
    gender_name varchar(50) NOT NULL,
    updated_at timestamptz not null default now(),

    constraint pk_genders primary key (gender_id),
    constraint uq_genders_gender_name unique (gender_name)
);

--migrate:down
drop table if EXISTS genders;