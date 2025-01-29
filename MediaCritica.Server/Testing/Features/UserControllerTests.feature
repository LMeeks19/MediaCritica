Feature: UserControllerTests

Scenario: Get User by email that exists
	Given I enter the email "test1@email.com"
	When I call GetUser
	Then The status code should be 200

Scenario: Get User by email that doesn't exist
	Given I enter the email "test2@email.com"
	When I call GetUser
	Then The status code should be 404
	And The response should be "User not found"