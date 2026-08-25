--migrate:up
CREATE TYPE circle_status_enum AS ENUM ('active', 'retired');

CREATE TABLE circles (
    circle_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(100) NOT NULL,
    status circle_status_enum NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT circles_name_not_blank CHECK (length(btrim(name)) > 0)
);

--migrate:down
drop table if exists circles;
drop type if exists circle_status_enum;

