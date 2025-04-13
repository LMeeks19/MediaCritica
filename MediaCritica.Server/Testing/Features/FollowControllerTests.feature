Feature: FollowControllerTests

Background: 
	Given I have the following users
		| Id | Username  |Forename | Surname | Email           | Password     | Joined     |
		| 1  | Username1 |Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Username2 |Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Username3 |Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
	Given I have the following userFollows
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 1  | 1          | 2          | 2025-01-01 | true                 |
		| 2  | 2          | 1          | 2025-01-02 | false                |
		| 3  | 3          | 1          | 2025-01-03 | false                |

Scenario: Get followers for a user
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username1 | Password123! | false      |
	When I call GetUserFollowers with the offset 0
	Then The status code should be 200
	And The UserFollowSummaryModels returned should be
		| Id | Username  | Name   | FollowedOn |
		| 3  | Username3 | Test 3 | 2025-01-03 |
		| 2  | Username2 | Test 2 | 2025-01-02 |

Scenario: Get followers for a user that doesn't exist
	When I call GetUserFollowers with the offset 0
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Get following for a user
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username1 | Password123! | false      |
	When I call GetUserFollowing with the offset 0
	Then The status code should be 200
	And The UserFollowSummaryModels returned should be
		| Id | Username  | Name   | FollowedOn |
		| 1  | Username2 | Test 2 | 2025-01-01 |

Scenario: Get following for a user that doesn't exist
	When I call GetUserFollowing with the offset 0
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Get a users follow status for another user 
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username1 | Password123! | false      |
	When I call GetUserFollowStatus on username Username2
	Then The status code should be 200
	And The UserFollowModel should be
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 1  | 1          | 2          | 2025-01-01 | true                 |

Scenario: Get a users follow status for another user that doesn't exist
	When I call GetUserFollowStatus on username Username3
	Then The status code should be 404
	And The response should be "Follow relationship not found"

Scenario: Follow a user
	When I call FollowUser with these values
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 4  | 1          | 3          | 2025-01-04 | false                |
	Then The status code should be 200
	And The response should be "User followed"

Scenario: Follow a user that doesn't exist
	When I call FollowUser with these values
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 4  | 1          | 4          | 2025-01-04 | false                |
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Follow a user that is themself
	When I call FollowUser with these values
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 4  | 1          | 1          | 2025-01-04 | false                |
	Then The status code should be 400
	And The response should be "Users cannot follow themselves"

Scenario: Follow a user that is already followed
	When I call FollowUser with these values
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 4  | 1          | 2          | 2025-01-04 | false                |
	Then The status code should be 409
	And The response should be "User is already following"

Scenario: Unfollow a user
	When I call UnfollowUser with the userFollowId 1
	Then The status code should be 200
	And The response should be "User unfollowed"
	And The UserFollow with Id 1 should have been deleted

Scenario: Unfollow user when not already following
	When I call UnfollowUser with the userFollowId 4
	Then The status code should be 404
	And The response should be "Follow relationship not found"

Scenario: Toggle the notification status of a users follow releationship that is false
	When I call ToggleNotificationStatus with userFollowId 2
	Then The status code should be 200
	Then The notification status of UserFollow with Id 1 should be true

Scenario: Toggle the notification status of a users follow releationship that is true
	When I call ToggleNotificationStatus with userFollowId 1
	Then The status code should be 200
	Then The notification status of UserFollow with Id 1 should be false

Scenario: Toggle the notification status of a users follow releationship that doesn't exist
	When I call ToggleNotificationStatus with userFollowId 4
	Then The status code should be 404
	And The response should be "Follow relationship not found"