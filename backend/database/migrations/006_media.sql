--migrate:up
create table medias (
    media_id int generated always as identity,
    media_url text not null, 
    user_id integer not null,
    mime_type varchar(100) not null, 
    file_size_bytes bigint not null, 
    created_at timestamptz not null default now(),  

    constraint pk_media primary key (media_id),
    constraint fk_media_user foreign key (user_id) references users(user_id) on delete cascade,
    constraint chk_media_file_size check (file_size_bytes > 0)  
);

create index idx_medias_user_id
    on medias(user_id);

--migrate:down
drop table if EXISTS medias;
