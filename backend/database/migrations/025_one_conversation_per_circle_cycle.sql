--This is to guarantee that one circle can only have one group chat per cycle

-- migrate:up
create unique index uq_conversations_circle_cycle
    on conversations (cycle_id)
    where type = 'circle';

-- migrate:down
drop index if exists uq_conversations_circle_cycle;
