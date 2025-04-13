Feature: NotificationControllerTests

Background: 
	Given I have the following users
		| Id | Username  | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Username1 | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Username2 | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Username3 | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
	And I have the following notifications
		| Id | RecipientId | AuthorId | Message        | IsRead | IsBookmarked | CreatedAt  |
		| 1  | 1           | 2        | Test Message 1 | false  | false        | 2024-04-01 |
		| 2  | 1           | 2        | Test Message 2 | true   | true         | 2024-01-01 |
		| 3  | 1           | 2        | Test Message 3 | false  | true         | 2024-03-01 |
		| 4  | 1           | 2        | Test Message 4 | true   | false        | 2024-02-01 |
		| 5  | 2           | 3        | Test Message 5 | true   | false        | 2024-05-01 |

Scenario: Get Notifications
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username1 | Password123! | false      |
	When I call GetUserNotifications 
	Then The status code should be 200
	And The NotificationModels should be
		| Id | AuthorUsername | Message        | IsRead | IsBookmarked | CreatedAt  |
		| 1  | Username2      | Test Message 1 | false  | false        | 2024-04-01 |
		| 3  | Username2      | Test Message 3 | false  | true         | 2024-03-01 |
		| 4  | Username2      | Test Message 4 | true   | false        | 2024-02-01 |
		| 2  | Username2      | Test Message 2 | true   | true         | 2024-01-01 |

Scenario: Get Notifications but the user has none
	When I call GetUserNotifications 
	Then The status code should be 200
	And The NotificationModels should be empty

Scenario: Mark Notification as read that doesn't exist
	When I call MarkAsRead with Id 6
	Then The status code should be 404
	And The response should be "Notification not found"

Scenario: Mark Notification as read
	When I call MarkAsRead with Id 1
	Then The status code should be 200
	And The response should be "Notification 1 marked as read"
	And The Notification with Id 1 should be read

Scenario: Mark all notifications as read but all already read
	When I call MarkAllAsRead
	Then The status code should be 404
	And The response should be "No unread notifications"

Scenario: Mark all notifications as read
	Given I am the following user
		| Username  | Password     | RememberMe |
		| Username1 | Password123! | false      |
	When I call MarkAllAsRead
	Then The status code should be 200
	And The response should be "All notifications marked as read"
	And The Notifications for UserId 1 should all be read

Scenario: Update bookmarked status of notification that doesn't exist
	When I call UpdateBookmarkStatus with Id 6
	Then The status code should be 404
	And The response should be "Notification not found"

Scenario: Update bookmarked status of notification to false
	When I call UpdateBookmarkStatus with Id 2
	Then The status code should be 200
	And The response should be "Notification 2 bookmark status updated"
	And The bookmark status of Notification 1 should be false

Scenario: Update bookmarked status of notification to true
	When I call UpdateBookmarkStatus with Id 1
	Then The status code should be 200
	And The response should be "Notification 1 bookmark status updated"
	And The bookmark status of Notification 1 should be true

Scenario: Delete notificaiton that doesn't exist
	When I call Delete with Id 6
	Then The status code should be 404
	And The response should be "Notification not found"

Scenario: Delete notificaiton
	When I call Delete with Id 1
	Then The status code should be 200
	And The response should be "Notification 1 deleted"
	And Notifications should no longer contain notification with Id 1

Scenario: Post notifications with no followers
	Given I have the following userFollows
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 1  | 1          | 2          | 2025-01-01 | true                 |
		| 2  | 2          | 1          | 2025-01-02 | false                |
	When I call PostNotifications with the NewNotificationModel
		| AuthorId | AuthorUsername | Message                   |
		| 1        | Test 1     | Test Notification Message |
	Then The status code should be 404
	And The response should be "No followers to send notifications to"

Scenario: Post notifications
	Given I have the following userFollows
		| Id | FollowerId | FollowedId | FollowedOn | EnabledNotifications |
		| 1  | 2          | 1          | 2025-01-01 | true                 |
		| 2  | 2          | 1          | 2025-01-02 | true                 |
	When I call PostNotifications with the NewNotificationModel
		| AuthorId | Message                   |
		| 1        | Test Notification Message |
	Then The status code should be 200
	And The following notifications should have been created
		| Id | RecipientId | AuthorId | Message                   | IsRead | IsBookmarked |
		| 6  | 2           | 1        | Test Notification Message | false  | false        |
	
