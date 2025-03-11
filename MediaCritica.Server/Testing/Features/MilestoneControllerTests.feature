Feature: MilestoneControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |

Scenario: GetUserMilestones of user
	When I call GetUserMilestones with UserId 1
	Then The status code should be 200
	And The MilestoneCategoryModels should be
		| Category             | Milestones |
		| Reviewed Media       | 5          |
		| Backlogged Media     | 2          |
		| Review Engagement    | 3          |
		| Interaction Variety  | 6          |
		| Consecutive Activity | 3          |
		| Social Connectivity  | 2          |

Scenario: GetUserMilestones of user that doesn't exist
	When I call GetUserMilestones with UserId 3
	Then The status code should be 404
	And The response should be "User not found"
