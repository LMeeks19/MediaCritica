Feature: LeaderboardControllerTests

TODO

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following reviews
		| Id | MediaId | MediaPoster       | MediaTitle       | MediaType | UserId | ReviewerName | Rating | Title      | Description      | Date       |
		| 1  | 1       | Test Media Poster | Test Media Title | Movie     | 1      | Test 1       | 4      | Test Title | Test Description | 2025-02-03 |
		| 2  | 2       | Test Media Poster | Test Media Title | Series    | 1      | Test 1       | 2      | Test Title | Test Description | 2025-02-27 |
		| 3  | 3       | Test Media Poster | Test Media Title | Game      | 1      | Test 1       | 1      | Test Title | Test Description | 2025-01-01 |
		| 4  | 4       | Test Media Poster | Test Media Title | Episode   | 1      | Test 1       | 4.5    | Test Title | Test Description | 2025-01-04 |
		| 5  | 5       | Test Media Poster | Test Media Title | Series    | 2      | Test 2       | 1.5    | Test Title | Test Description | 2025-01-04 |
		| 6  | 6       | Test Media Poster | Test Media Title | Movie     | 2      | Test 2       | 2      | Test Title | Test Description | 2024-01-04 |
		| 7  | 7       | Test Media Poster | Test Media Title | Game      | 3      | Test 3       | 2.5    | Test Title | Test Description | 2025-01-05 |

Scenario: Get user rankings for week
	When I call GetUserRankings for week 
	Then The status code should be 200
	And The UserRankingModels reposne should be
		| Rank | Name   | Reviews | Timeframe |
		| 1    | Test 1 | 1       | week      |

Scenario: Get user rankings for month
	When I call GetUserRankings for month
	Then The status code should be 200
	And The UserRankingModels reposne should be
		| Rank | Name   | Reviews | Timeframe |
		| 1    | Test 1 | 2       | month     |

Scenario: Get user rankings for year
	When I call GetUserRankings for year
	Then The status code should be 200
	And The UserRankingModels reposne should be
		| Rank | Name   | Reviews | Timeframe |
		| 1    | Test 1 | 4       | year      |
		| 2    | Test 2 | 1       | year      |
		| 3    | Test 3 | 1       | year      |

Scenario: Get user rankings for all time
	When I call GetUserRankings for all-time
	Then The status code should be 200
	And The UserRankingModels reposne should be
		| Rank | Name   | Reviews | Timeframe |
		| 1    | Test 1 | 4       | all-time  |
		| 2    | Test 2 | 2       | all-time  |
		| 3    | Test 3 | 1       | all-time  |

#Scenario: Get media trends for week
#
#Scenario: Get media trends for month
#
#Scenario: Get media trends for year
#
#Scenario: Get media trends for all-time