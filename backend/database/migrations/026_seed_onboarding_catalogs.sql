-- migrate:up
insert into genders (gender_name)
values ('Woman'), ('Man'), ('Non-binary')
on conflict (gender_name) do nothing;

insert into interests (interest_name, slug, is_active)
select item.name, item.slug, true
from (values
    ('Photography', 'photography'),
    ('Shopping', 'shopping'),
    ('Karaoke', 'karaoke'),
    ('Yoga', 'yoga'),
    ('Cooking', 'cooking'),
    ('Tennis', 'tennis'),
    ('Run', 'run'),
    ('Swimming', 'swimming'),
    ('Art', 'art'),
    ('Traveling', 'traveling'),
    ('Extreme', 'extreme'),
    ('Music', 'music'),
    ('Drink', 'drink'),
    ('Video games', 'video-games')
) as item(name, slug)
where not exists (select 1 from interests where interests.slug = item.slug);

insert into lifestyle_questions (slug, question_text, display_order)
values
    ('drinking', 'How often do you drink?', 1),
    ('smoking', 'Do you smoke?', 2),
    ('cannabis', 'Do you use cannabis?', 3),
    ('workout', 'How often do you exercise?', 4)
on conflict (slug) do nothing;

insert into lifestyle_options (lifestyle_question_id, slug, label, display_order)
select question.lifestyle_question_id, answer.slug, answer.label, answer.display_order
from lifestyle_questions as question
cross join (values
    ('often', 'Often', 1),
    ('sometimes', 'Sometimes', 2),
    ('rarely', 'Rarely', 3),
    ('no', 'No', 4)
) as answer(slug, label, display_order)
where question.slug in ('drinking', 'smoking', 'cannabis', 'workout')
on conflict (lifestyle_question_id, slug) do nothing;

insert into prompts (slug, prompt_text)
values
    ('perfect-first-date', 'A perfect first date is…'),
    ('controversial-opinion', 'My most controversial opinion is…'),
    ('excited-about', 'I get way too excited about…'),
    ('win-me-over', 'The way to win me over is…'),
    ('simple-pleasures', 'My simple pleasures are…'),
    ('two-truths-and-a-lie', 'Two truths and a lie…'),
    ('go-crazy-for', 'I go crazy for…'),
    ('should-not-date-me', 'You should not go out with me if…')
on conflict (slug) do nothing;

-- migrate:down
-- Catalog entries can be referenced by saved profiles, so rollback keeps them.
