--migrate:up
create table profile_photos (
    user_id integer,
    media_id integer,
    photo_order int not null, 
    is_primary boolean not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

constraint pk_profile_photo primary key(user_id, media_id),

constraint fk_profile_id foreign key (user_id) references profiles(user_id)
on delete cascade,

constraint fk_media_id foreign key (media_id) references medias(media_id)
on delete cascade, 

constraint uq_profile_photo_media 
unique (media_id),

constraint uq_profile_photo_order unique (user_id, photo_order),

constraint chk_profile_photo_order check (photo_order >0)

);


--migrate:down
drop table if EXISTS profile_photos;