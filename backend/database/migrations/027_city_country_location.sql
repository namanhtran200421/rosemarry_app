--migrate:up
alter table users_location
    alter column latitude drop not null,
    alter column longitude drop not null;

-- Existing coordinate-only rows need a city and country supplied by the user.
-- NOT VALID preserves those rows while enforcing the new rule on every write.
alter table users_location
    add constraint users_location_city_country_required
    check (
        city is not null and btrim(city) <> '' and
        country is not null and btrim(country) <> ''
    ) not valid;

--migrate:down
alter table users_location
    drop constraint users_location_city_country_required;
