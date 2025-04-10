Feature: UserControllerTests

Background: 
	Given I have the following users
		| Id | Username  | Forename | Surname | Email           | Password     | Joined     |
		| 1  | B_Banner  | Bruce    | Banner  | test1@email.com | Password123! | 2025-01-01 |
		| 2  | T_Stark   | Tony     | Stark   | test2@email.com | Password123! | 2025-01-02 |
		| 3  | T_Odinson | Thor     | Odinson | test3@email.com | Password123! | 2025-01-01 |
		| 4  | C_Barton  | Clint    | Barton  | tes42@email.com | Password123! | 2025-01-02 |
	And I have the following preferences
		| Id | UserId | Theme  | Palette |
		| 1  | 1      | System | #000000 |
		| 2  | 2      | Light  | #FFFFFF |
		| 3  | 3      | System | #000000 |
		| 4  | 4      | Dark   | #FFFFFF |
	And I have the following auth tokens
		| Id | UserId | Token | Expiration |
		| 1  | 3      | 1     | 2025-03-15 |
		| 2  | 4      | 2     | 2025-01-01 |

Scenario: Login a user 
	When I call Login with the following details
		| Username  | Password     | RememberMe |
		| B_Banner  | Password123! | false      |
	Then The status code should be 200
	And The UserAuthModel response should be 
		| AuthTokenId | AuthUserId | Expiration | UserId | Forename | Surname | Email           | Password     |
		|             |            |            | 1      | Bruce    | Banner  | test1@email.com | Password123! |

Scenario: Login a user and remember them
	When I call Login with the following details
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | true       |
	Then The status code should be 200
	And The UserAuthModel response should be 
		| AuthTokenId | AuthUserId | Expiration | UserId | Forename | Surname | Email           | Password     |
		| 3           | 1          | 2025-03-29 | 1      | Bruce    | Banner  | test1@email.com | Password123! |

Scenario: Login a user that doesn't exist 
	When I call Login with the following details
		| Username  | Password     | RememberMe |
		| S_Rogers  | Password123! | false      |
	Then The status code should be 401
	And The response should be "Invalid Credentials"

Scenario: Login a user with an invalid password 
	When I call Login with the following details
		| Username  | Password     | RememberMe |
		| B_Banner  | Password456! | false      |
	Then The status code should be 401
	And The response should be "Invalid Credentials"

Scenario: Auto login a user
	When I call AutoLogin with the token "1"
	Then The status code should be 200
	And The UserAuthModel response should be
		| AuthTokenId | AuthUserId | Token | Expiration | UserId | Forename | Surname | Email           | Password     |
		| 1           | 3          | 1     | 2025-03-29 | 3      | Thor     | Odinson | test3@email.com | Password123! |

Scenario: Logout a user
	When I call Logout with token "1"
	Then The status code should be 200
	And The response should be "User Logged Out"

Scenario: Auto login a user with an invalid token
	When I call AutoLogin with the token "9"
	Then The status code should be 401
	And The response should be "Auto Login Failed"

Scenario: Auto login a user but the token has expired
	When I call AutoLogin with the token "2"
	Then The status code should be 401
	And The response should be "Authentication Expired"

Scenario: Get users by search
	When I call GetUsersBySearch with search term "T_Stark"
	Then The status code should be 200
	And The UserSearchModels should be
		| Id | Username | FullName   | Joined                    |
		| 2  | T_Stark  | Tony Stark | Thursday, January 2, 2025 |

Scenario: Get a user by username that exists
	When I call GetUser with the username "B_Banner"
	Then The status code should be 200
	And The UserModel response should be
		| Id | Username | Forename | Surname | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | B_Banner | Bruce    | Banner  | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Get a user by username that doesn't exist
	When I call GetUser with the username "S_Rogers"
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Post a user with a username that already exists
	When I call PostUser with the User
		| Username | Forename | Surname | Email           | Password     |
		| B_Banner | Test     | 9       | test9@email.com | Password456! |
	Then The status code should be 409
	And The response should be "Username already in use"

Scenario: Post a user with a username that doesn't already exists
	When I call PostUser with the User
		| Username | Forename | Surname | Email           | Password     |
		| S_Rogers | Steve    | Rogers  | test5@email.com | Password456! |
	Then The status code should be 200
	And The response should be "Account Created"

Scenario: Post a user with an email that already exists
	When I call PostUser with the User
		| Username | Forename | Surname | Email           | Password     |
		| S_Rogers | Test     | 9       | test2@email.com | Password456! |
	Then The status code should be 409
	And The response should be "Email already in use"

Scenario: Post a user with an email that doesn't already exists
	When I call PostUser with the User
		| Username | Forename | Surname | Email           | Password     |
		| S_Rogers | Steve    | Rogers  | test5@email.com | Password456! |
	Then The status code should be 200
	And The response should be "Account Created"

Scenario: Delete a user
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call DeleteUser
	Then The status code should be 200
	And The response should be "User deleted"
	When I call GetUser with the username "B_Banner"
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Delete a user that doesn't exist
	When I call DeleteUser
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Update a user that doesn't exist
	When I call UpdateUser with the UpdateUserModel
		| UserId | Value              | Type |
		| 9      | NewEmail@email.com | 2    |
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Update a user with an invalid type
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value              | Type |
		| NewEmail@email.com | 5    |
	Then The status code should be 400
	And The response should be "Invalid update type"

Scenario: Update a users username
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value        | Type |
		| New_B_Banner | 0    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Username     | Forename | Surname | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | New_B_Banner | Bruce    | Banner  | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users username that already exists
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value   | Type |
		| T_Stark | 0    |
	Then The status code should be 409
	And The response should be "Username already in use"

Scenario: Update a users forename
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value       | Type |
		| NewForename | 1    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Username | Forename    | Surname | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | B_Banner | NewForename | Banner  | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users surname
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value      | Type |
		| NewSurname | 2    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Username | Forename | Surname    | Email           | Password     | PreferenceId | Theme  | Palette |
		| 1  | B_Banner | Bruce    | NewSurname | test1@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users email
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value              | Type |
		| NewEmail@email.com | 3    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Username | Forename | Surname | Email              | Password     | PreferenceId | Theme  | Palette |
		| 1  | B_Banner | Bruce    | Banner  | NewEmail@email.com | Password123! | 1            | System | #000000 |

Scenario: Update a users email that already exists
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value           | Type |
		| test2@email.com | 3    |
	Then The status code should be 409
	And The response should be "Email already in use"

Scenario: Update a users password
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value           | Type |
		| NewPassword123! | 4    |
	Then The status code should be 200
	And The UserModel response should be
		| Id | Username | Forename | Surname | Email           | Password        | PreferenceId | Theme  | Palette |
		| 1  | B_Banner | Bruce    | Banner  | test1@email.com | NewPassword123! | 1            | System | #000000 |

Scenario: Update a users password that matches old password
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value        | Type |
		| Password123! | 4    |
	Then The status code should be 400
	And The response should be "Password must be the same as the existing password"

Scenario: Update a users password that is less than 8 charcaters long
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value  | Type |
		| Pa123! | 4    |
	Then The status code should be 400
	And The response should be "Password must be at least 8 characters long"

Scenario: Update a users password that does not start with a letter
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value            | Type |
		| 7NewPassword123! | 4    |
	Then The status code should be 400
	And The response should be "Password must start with a letter"

Scenario: Update a users password that does not contain at least one digit
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value        | Type |
		| NewPassword! | 4    |
	Then The status code should be 400
	And The response should be "Password must contain at least one digit"

Scenario: Update a users password that does not contain at least one uppercase letter
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value           | Type |
		| newpassword123! | 4    |
	Then The status code should be 400
	And The response should be "Password must contain at least one uppercase letter"

Scenario: Update a users password that does not contain at least one lowercase letter
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value           | Type |
		| NEWPASSWORD123! | 4    |
	Then The status code should be 400
	And The response should be "Password must contain at least one lowercase letter"

Scenario: Update a users password that does not contain at least one symbol
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value          | Type |
		| NewPassword123 | 4    |
	Then The status code should be 400
	And The response should be "Password must contain at least one symbol"

Scenario: Update a users password that does contains spaces 
	Given I am the following user
		| Username | Password     | RememberMe |
		| B_Banner | Password123! | false      |
	When I call UpdateUser with the UpdateUserModel
		| Value            | Type |
		| NewPass word123! | 4    |
	Then The status code should be 400
	And The response should be "Password must not contain spaces"

Scenario: Update a user preference that doesn't exist
	When I call UpdateUserPreference with the PreferenceModel
		| Id | Theme | Palette |
		| 9  | Light | #FFFFFF |
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
	When I call GetViewUserSummary with the username S_Rogers
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Get a user summary
	When I call GetViewUserSummary with the username B_Banner
	Then The status code should be 200
	And The UserSummaryModel response should be
		| Id | Username | Name         | Joined     |
		| 1  | B_Banner | Bruce Banner | 2025-01-01 |





