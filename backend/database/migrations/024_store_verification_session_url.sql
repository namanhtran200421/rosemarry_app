--migrate:up
alter table id_verifications
    add column session_url text;

--migrate:down
alter table id_verifications
    drop column if exists session_url;