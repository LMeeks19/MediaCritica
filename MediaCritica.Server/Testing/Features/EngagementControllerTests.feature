Feature: EngagementControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following reviews
		| Id | MediaId | MediaPoster       | MediaTitle       | MediaType | UserId | ReviewerName | Rating | Title      | Description      | Date       |
		| 1  | 1       | Test Media Poster | Test Media Title | movie     | 3      | Test 3       | 4      | Test Title | Test Description | 2025-01-01 |
	And I have the following engagements
		| Id | UserId | ReviewId | Type |
		| 1  | 1      | 1        | 0    |
		| 2  | 2      | 1        | 1    |

Scenario: Get a users engagement for a review that is a like
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test1@email.com | Password123! | false      |
	When I call GetUserEngagement with review id 1
	Then The status code should be 200
	And The response should be a like

Scenario: Get a users engagement for a review that is a dislike
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test2@email.com | Password456! | false      |
	When I call GetUserEngagement with review id 1
	Then The status code should be 200
	And The response should be a dislike

Scenario: Get a users engagement that doesn't exist
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test3@email.com | Password789! | false      |
	When I call GetUserEngagement with review id 1
	Then The status code should be 200
	And The response should be a none

Scenario: Get a users engagement but the user doesn't exist
	When I call GetUserEngagement with review id 1
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Get a users engagement but the review doesn't exist
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test1@email.com | Password123! | false      |
	When I call GetUserEngagement with review id 2
	Then The status code should be 404
	And The response should be "Review not found"

Scenario: Toggle an engagement on a review that didn't previously exist
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test4@email.com | Password012! | false      |
	When I call ToggleEngagement with review id 1 and engagement type 0
	Then The status code should be 200
	And The response should be a like
	And The engagement should have been created
		| Id | UserId | ReviewId | Type |
		| 3  | 4      | 1        | 0    |

Scenario: Toggle an engagement on a review for a user to like
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test2@email.com | Password456! | false      |
	When I call ToggleEngagement with review id 1 and engagement type 0
	Then The status code should be 200
	And The response should be a like
	And The engagement should have been updated
		| Id | UserId | ReviewId | Type |
		| 2  | 2      | 1        | 0    |

Scenario: Toggle an engagement on a review for a user to dislike
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test1@email.com | Password123! | false      |
	When I call ToggleEngagement with review id 1 and engagement type 1
	Then The status code should be 200
	And The response should be a dislike
	And The engagement should have been updated
		| Id | UserId | ReviewId | Type |
		| 1  | 1      | 1        | 1    |

Scenario: Toggle an engagement on a review for a user to none
	Given I am the following user
		| Email           | Password     | RememberMe |
		| test1@email.com | Password123! | false      |
	When I call ToggleEngagement with review id 1 and engagement type -1
	Then The status code should be 200
	And The response should be a none
	And The engagement should have been deleted
		| Id | UserId | ReviewId | Type |

Scenario: Toggle an engagement for a user that doesn't exist
	When I call ToggleEngagement with review id 1 and engagement type 0
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Toggle an engagement for a user on a review that doesn't exist
	When I call ToggleEngagement with review id 2 and engagement type 0
	Then The status code should be 404
	And The response should be "Review not found"