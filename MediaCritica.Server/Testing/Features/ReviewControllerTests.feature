Feature: ReviewControllerTests

Background: 
	Given I have the following users
		| Id | Username  | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Username1 | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Username2 | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Username3 | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Username4 | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following movies
		| Id | Actors           | Awards  | Countries | Directors              | Genres        | Languages | Metascore | Plot         | Rated | Released   | Runtime | Title         | Type  | Writers  | Year | ImdbRating | ImdbVotes | BoxOffice    | DVD | Website | Production |
		| 1  | Actor 1, Actor 2 | Award 1 | USA, UK   | Director 1, Director 2 | Action, Drama | English   | 85        | A great plot | PG-13 | 2020-02-03 | 120 min | Media Title 1 | movie | Writer 1 | 2020 | 8.5        | 1500      | $300,000,000 |     |         |            |
	And I have the following reviews
		| Id | MediaId | MediaTitle    | MediaType | UserId | ReviewerUsername | Rating | Title      | Description      | Date       | Status |
		| 1  | 1       | Media Title 1 | movie     | 3      | Username3        | 4      | Test Title | Test Description | 2025-01-01 | Active |
	And I have the following reports
		| Id | ReviewId | ReporterId | Reason | Details      | ReportedAt |
		| 1  | 1        | 2          | Spam   | Spam Comment | 2025-02-20 |

Scenario: Get a review by id
	When I call GetReview with id 1
	Then The status code should be 200
	And The ReviewModel should be
		| Id | Date        | Description      | MediaType | MediaId | MediaTitle    | MediaSeriesId | MediaSeriesTitle | MediaEpisode | Rating | ReviewerId | ReviewerUsername | Title      | Likes | Dislikes |
		| 1  | 1 month ago | Test Description | movie     | 1       | Media Title 1 | <null>        | <null>           | <null>       | 4      | 3          | Username3        | Test Title | 0     | 0        |

Scenario: Get a review by id that doesn't exist
	When I call GetReview with id 10
	Then The status code should be 404
	And The response should be "Review not found"

Scenario: Get a user reviews
	When I call GetUserReviews
	Then The status code should be 200

Scenario: Get a media reviews
	When I call GetMediaReviews with the media id 1
	Then The status code should be 200

Scenario: Post a review
	When I call PostReview with the following data
		| Date       | Description        | MediaType | MediaId | MediaTitle    | MediaSeriesId | MediaSeriesTitle | MediaEpisode | Rating | ReviewerId | ReviewerUsername | Title      |
		| 2025-02-02 | Test Description 2 | movie     | 1       | Media Title 1 | <null>        | <null>           | <null>       | 3      | 1          | Username1        | Test Title |
	Then The status code should be 200
	And The response should be 2

Scenario: Post a review but the user doesn't exist
	When I call PostReview with the following data
		| Date       | Description        | MediaType | MediaId | MediaTitle    | MediaSeriesId | MediaSeriesTitle | MediaEpisode | Rating | ReviewerId | ReviewerUsername | Title      |
		| 2025-02-02 | Test Description 2 | movie     | 1       | Media Title 1 | <null>        | <null>           | <null>       | 5      | 10         | Username10       | Test Title |
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Post a review but the media doesn't exist
	When I call PostReview with the following data
		| Date       | Description        | MediaType | MediaId | MediaTitle    | MediaSeriesId | MediaSeriesTitle | MediaEpisode | Rating | ReviewerId | ReviewerUsername | Title      |
		| 2025-02-02 | Test Description 2 | movie     | 2       | Media Title 2 | <null>        | <null>           | <null>       | 3      | 1          | Username1        | Test Title |
	Then The status code should be 404
	And The response should be "Media not found"

Scenario: Post a review that a user has already reviewed
	When I call PostReview with the following data
		| Date       | Description        | MediaType | MediaId | MediaTitle    | MediaSeriesId | MediaSeriesTitle | MediaEpisode | Rating | ReviewerId | ReviewerUsername | Title      |
		| 2025-02-02 | Test Description 2 | movie     | 1       | Media Title 1 | <null>        | <null>           | <null>       | 4.5    | 3          | Username1        | Test Title |
	Then The status code should be 409
	And The response should be "User has already reviewed this media"

Scenario: Update a review
	When I call UpdateReview with the following data
		| ReviewId | Title         | Description         | Rating | 
		| 1        | Updated Title | Updated Description | 1      |
Then The status code should be 200
	And The ReviewModel should be
		| Id | Date     | Description         | MediaType | MediaId | MediaTitle    | MediaSeriesId | MediaSeriesTitle | MediaEpisode | Rating | ReviewerId | ReviewerUsername | Title         | Likes | Dislikes |
		| 1  | just now | Updated Description | movie     | 1       | Media Title 1 | <null>        | <null>           | <null>       | 1      | 3          | Username3        | Updated Title | 0     | 0        |

Scenario: Update a review that doesn't exist
	When I call UpdateReview with the following data
		| ReviewId | Title         | Description         | Rating |
		| 10       | Updated Title | Updated Description | 1      |
	Then The status code should be 404
	And The response should be "Review not found"

Scenario: Delete a review
	When I call delete review with id 1
	Then The status code should be 200
	And The response should be "Review Deleted"

Scenario: Delete a review that doesn't exist
	When I call delete review with id 10
	Then The status code should be 404
	And The response should be "Review not found"

Scenario: Get a users review status that is true
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username3 | Password789! | false      |
	When I call GetUserReviewStatus with media id 1
	Then The status code should be 200
	And The response should be true

Scenario: Get a users review status that is false
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test2@email.com | Password456! | false      |
	When I call GetUserReviewStatus with media id 1
	Then The status code should be 200
	And The response should be false

Scenario: Report a review
	When I call ReportReview with the following data
		| ReviewId | ReporterId | Reason | Details      |
		| 1        | 1          | Hate   | Hate Comment |
	Then The status code should be 200
	And The response should be "Review Reported"
	And The following report should be in the database
		| Id | ReviewId | ReporterId | Reason | Details      | ReportedAt          |
		| 2  | 1        | 1          | Hate   | Hate Comment | 2025-02-27 16:30:00 |

Scenario: Report a review that a user has already reported
	When I call ReportReview with the following data
		| ReviewId | ReporterId | Reason | Details      |
		| 1        | 2          | Spam   | Spam Comment |
	Then The status code should be 409
	And The response should be "Review Already Reported"

Scenario: Report a review that doesn't exist
	When I call ReportReview with the following data
		| ReviewId | ReporterId | Reason | Details      |
		| 99       | 1          | Hate   | Hate Comment |
	Then The status code should be 404
	And The response should be "Review Not Found"

Scenario: Report a review with an invalid user
	When I call ReportReview with the following data
		| ReviewId | ReporterId | Reason | Details      |
		| 1        | 99         | Hate   | Hate Comment |
	Then The status code should be 404
	And The response should be "User Not Found"