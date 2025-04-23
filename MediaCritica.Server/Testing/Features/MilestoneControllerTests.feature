Feature: MilestoneControllerTests

Background: 
	Given I have the following users
		| Id | Username  | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Username1 | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Username2 | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
	And I have the following preferences
		| Id | UserId | Theme  | Palette | Locale | Timezone         |
		| 1  | 1      | System | #000000 | en-US  | America/New_York |
		| 2  | 2      | Light  | #FFFFFF | en-GB  | Europe/London    |

Scenario: GetUserMilestones of user
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username1 | Password123! | false      |
	When I call GetUserMilestones
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
	When I call GetUserMilestones
	Then The status code should be 404
	And The response should be "User not found"
