Feature: UserControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
	And I have the following preferences
		| Id | UserId | Theme  | Palette |
		| 1  | 1      | System | #000000 |

Scenario: Get a user by email that exists
	When I call GetUser with the Email "test1@email.com"
	Then The status code should be 200
	And The UserModel response should be
		| Id | Forename | Surname | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | Test     | 1       | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Get a user by email that doesn't exist
	When I call GetUser with the Email "test2@email.com"
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Post a user with an email that already exists
	When I call PostUser with the User
		| Forename | Surname | Email           | Password     |
		| Test     | 2       | test1@email.com | Password456! |
	Then The status code should be 409
	And The response should be "Email already in use"

Scenario: Post a user with an email that doesn't already exists
	When I call PostUser with the User
		| Forename | Surname | Email           | Password     |
		| Test     | 2       | test2@email.com | Password456! |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Forename | Surname | Email           | Password     | PreferenceId | Theme  | Palette |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2            | System | #971212 |

Scenario: Delete a user that exists
	When I call DeleteUser with the Id 1
	Then The status code should be 200
	And The response should be "User deleted"
	When I call GetUser with the Email "test1@email.com"
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Delete a user that doesn't exist
	When I call DeleteUser with the Id 2
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Update a user that doesn't exist
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value              | Type |
		| 2      | NewEmail@email.com | 2    |
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Update a user with an invalid type
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value              | Type |
		| 1      | NewEmail@email.com | 4    |
	Then The status code should be 400
	And The response should be "Invalid update type"

Scenario: Update a users forename
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value       | Type |
		| 1      | NewForename | 0    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Forename        | Surname | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | NewForename     | 1       | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users surname
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value      | Type |
		| 1      | NewSurname | 1    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Forename | Surname    | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | Test     | NewSurname | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users email
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value              | Type |
		| 1      | NewEmail@email.com | 2    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Forename | Surname | Email              | Password     | PreferenceId | Theme  | Palette |
		| 1  | Test     | 1       | NewEmail@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users password
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value           | Type |
		| 1      | NewPassword123! | 3    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Forename | Surname | Email           | Password        | PreferenceId | Theme  | Palette |
		| 1  | Test     | 1       | test1@email.com | NewPassword123! | 1            | System | #000000 |

Scenario: Update a user preference that doesn't exist
	When I call UpdateUserPreference with the PreferenceModel
		| Id | Theme | Palette |
		| 2  | Light | #FFFFFF |
	Then The status code should be 404
	And The response should be "Preference not found"

Scenario: Update a user preference that exists
	When I call UpdateUserPreference with the PreferenceModel
		| Id | Theme | Palette |
		| 1  | Light | #FFFFFF |
	Then The status code should be 200
	And The PreferenceModel response should be
		| Id | Theme | Palette |
		| 1  | Light | #FFFFFF |

Scenario: Get a user summary that doesn't exist
	When I call GetViewUserSummary with the Id 2
	Then The status code should be 404
	And The response should be "User not found"

Scenario: get a user summary that exists
	When I call GetViewUserSummary with the Id 1
	Then The status code should be 200
	And The UserSummaryModel response should be
		| Id | Name   | Joined     |
		| 1  | Test 1 | 2025-01-01 |





