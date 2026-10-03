# Onboarding API

All routes use `/api/v1/onboarding` and require an Auth0 bearer token for an existing active application user. A successful stage write returns `{ "stage": "...", "completedAt": null }`.

Complete the stages in this order. Repeating an earlier stage updates its data without moving progress backwards.

| Stage         | Method and path    | Request body                                                                                                                                     |
| ------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Basic profile | `PUT /profile`     | `{ "displayName": "Alex", "dateOfBirth": "2000-03-02", "genderId": null, "bio": null, "datingGoal": "LONG_TERM_RELATIONSHIP", "heightCm": 173 }` |
| Preferences   | `PUT /preferences` | `{ "minAge": 24, "maxAge": 35, "maxDistanceKm": 50, "preferredGenderIds": [] }`                                                                  |
| Interests     | `PUT /interests`   | `{ "interestIds": [1, 2] }` (up to 5)                                                                                                            |
| Lifestyle     | `PUT /lifestyle`   | `{ "answers": [{ "questionId": 1, "optionId": 2 }] }`                                                                                            |
| Prompts       | `PUT /prompts`     | `{ "prompts": [{ "promptId": 1, "answer": "A thoughtful answer", "displayOrder": 1 }] }` (up to 3)                                               |
| Photos        | `PUT /photos`      | `{ "photos": [{ "mediaId": 1, "photoOrder": 1, "isPrimary": true }, { "mediaId": 2, "photoOrder": 2, "isPrimary": false }] }` (2 to 6)           |
| Location      | `PUT /location`    | `{ "city": "Melbourne", "country": "Australia", "state": "Victoria", "postcode": "3000" }` (city and country required; state and postcode optional) |
| Finish        | `POST /complete`   | No body. Requires an approved ID verification.                                                                                                   |

Read progress with `GET /state` and previously saved answers with `GET /snapshot`. The selection catalogs are `GET /genders`, `GET /interests`, `GET /lifestyle`, and `GET /prompts`. `GET /media` lists the current user's existing media IDs and URLs. Upload a photo with `POST /media` using multipart form data with a `photo` field; it returns the new `{ "mediaId", "mediaUrl" }`. JPEG, PNG, WebP, and HEIC files up to 8 MB are accepted. An empty `preferredGenderIds` array means everyone. Photos must reference media records already owned by the authenticated user.
