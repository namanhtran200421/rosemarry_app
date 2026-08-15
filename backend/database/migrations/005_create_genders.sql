--migrate:up
create table genders (
    gender_id integer generated always as identity,
    gender_name varchar(50) NOT NULL,
    updated_at timestamp not null default now(),

    constraint pk_genders primary key (gender_id),
)

--migrate:down
drop table if EXISTS genders;