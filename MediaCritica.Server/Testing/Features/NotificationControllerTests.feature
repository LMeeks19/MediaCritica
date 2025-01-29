Feature: NotificationControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
	And I have the following preferences
		| Id | UserId | Theme  | Palette |
		| 1  | 1      | System | #000000 |
		| 2  | 2      | Dark   | #FFFFFF |
	And I have the following notifications
		| Id | RecipientId | AuthorName | Message        | IsRead | IsBookmarked | CreatedAt  |
		| 1  | 1           | Test 2     | Test Message 1 | false  | false        | 2024-04-01 |
		| 2  | 1           | Test 2     | Test Message 2 | true   | true         | 2024-01-01 |
		| 3  | 1           | Test 2     | Test Message 3 | false  | true         | 2024-03-01 |
		| 4  | 1           | Test 2     | Test Message 4 | true   | false        | 2024-02-01 |

Scenario: Get Notifications
	When I call GetUserNotifications with userId 1 
	Then The status code should be 200
	And The NotificationModels should be
		| Id | AuthorName | Message        | IsRead | IsBookmarked | CreatedAt  |
		| 1  | Test 2     | Test Message 1 | false  | false        | 2024-04-01 |
		| 3  | Test 2     | Test Message 3 | false  | true         | 2024-03-01 |
		| 4  | Test 2     | Test Message 4 | true   | false        | 2024-02-01 |
		| 2  | Test 2     | Test Message 2 | true   | true         | 2024-01-01 |

Scenario: Get Notifications but the user has none
	When I call GetUserNotifications with userId 2 
	Then The status code should be 200
	And The NotificationModels should be empty
	
