Feature: CommentControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following movies
		| Id | Actors           | Awards  | Countries | Directors              | Genres            | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type    | Writers  | Year | ImdbRating | ImdbVotes | BoxOffice    | DVD | Website | Production |
		| 1  | Actor 1, Actor 2 | Award 1 | USA, UK   | Director 1, Director 2 | Action, Drama     | English   | 85        | A great plot | Media Poster 1 | PG-13 | 2020-02-03 | 120 min | Media Title 1 | movie   | Writer 1 | 2020 | 8.5        | 1500      | $300,000,000 |     |         |            |
	And I have the following reviews
		| Id | MediaId | MediaPoster    | MediaTitle    | MediaType | UserId | ReviewerName | Rating | Title      | Description      | Date       |
		| 1  | 1       | Media Poster 1 | Media Title 1 | movie     | 3      | Test 3       | 4      | Test Title | Test Description | 2025-01-01 |
	And I have the following comments
		| Id | ReviewId | ParentId | Content   | CommenterId | CommenterName | CommentedAt | IsDeleted |
		| 1  | 1        | <null>   | Comment 1 | 1           | Test 1        | 2025-01-27  | false     |
		| 2  | 1        | 1        | Comment 2 | 2           | Test 2        | 2025-01-28  | false     |
		| 3  | 1        | <null>   | Comment 3 | 1           | Test 1        | 2025-01-29  | false     |
		| 4  | 1        | 3        | Comment 4 | 4           | Test 4        | 2025-01-29  | false     |
		| 5  | 1        | 3        | Comment 5 | 1           | Test 1        | 2025-01-30  | false     |
		| 6  | 1        | 3        | Comment 6 | 1           | Test 1        | 2025-01-30  | false     |
		| 7  | 1        | 5        | Comment 7 | 2           | Test 2        | 2025-01-31  | true      |

Scenario: Get review comments
	When I call GetReviewComments with the review id 1
	Then The status code should be 200
	And # TODO:

Scenario: Get review comments for a review that doesn't exist
	When I call GetReviewComments with the review id 99
	Then The status code should be 404
	And The response should be "Review Not Found"

Scenario: Get comments remaining children
	When I call GetCommentsRemainingChildren with the comment id 3 and offset 2
	Then The status code should be 200
	And The CommentModels should be
		| Id | ReviewId | ParentId | Content   | CommenterId | CommenterName | CommentedAt | IsDeleted | TotalChildren |
		| 4  | 1        | 3        | Comment 4 | 4           | Test 4        | 2025-01-29  | false     | 0             |
	And The children should be empty

Scenario: Delete a comment
	When I call DeleteComment with the comment id 1
	Then The status code should be 200
	And The response should be "Comment Deleted"

Scenario: Delete a comment that doesn't exits
	When I call DeleteComment with the comment id 99
	Then The status code should be 404
	And The response should be "Comment Not Found"

Scenario: Post a comment
	When I call PostComment with the following data
		| ReviewId | ParentId | Content     | CommenterId | CommenterName |
		| 1        | 1        | New Comment | 1           | Test 1        |
	Then The status code should be 200
	And The CommentModel should be
		| Id | ReviewId | ParentId | Content     | CommenterId | CommenterName | CommentedAt | IsDeleted | TotalChildren |
		| 8  | 1        | 1        | New Comment | 1           | Test 1        | 2025-02-27  | false     | 0             |
	And The children should be empty

Scenario: Post a comment but the parent doesn't exist
	When I call PostComment with the following data
		| ReviewId | ParentId | Content     | CommenterId | CommenterName |
		| 1        | 99       | New Comment | 1           | Test 1        |
	Then The status code should be 404
	And The response should be "Parent Comment Not Found"

Scenario: Post a comment but the parent is deleted
	When I call PostComment with the following data
		| ReviewId | ParentId | Content     | CommenterId | CommenterName |
		| 1        | 7        | New Comment | 1           | Test 1        |
	Then The status code should be 409
	And The response should be "Cannot reply to a deleted comment"

Scenario: Update a comment
	When I call UpdateComment with the following data
		| Id | Content         |
		| 1  | Updated Comment |
	Then The status code should be 200
	And The response should be "Comment Updated"

Scenario: Update a comment tah doesn't exist
	When I call UpdateComment with the following data
		| Id | Content         |
		| 99 | Updated Comment |
	Then The status code should be 404
	And The response should be "Comment Not Found"