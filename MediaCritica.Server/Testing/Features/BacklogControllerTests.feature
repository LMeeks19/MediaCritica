Feature: BacklogControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following media
		| Id | Actors           | Awards  | Countries | Directors              | Genres            | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type    | Writers  | Year | ImdbRating | ImdbVotes |
		| 1  | Actor 1, Actor 2 | Award 1 | USA, UK   | Director 1, Director 2 | Action, Drama     | English   | 85        | A great plot | Media Poster 1 | PG-13 | 2020-02-03 | 120 min | Media Title 1 | Movie   | Writer 1 | 2020 | 8.5        | 1500      |
		| 2  | Actor 1, Actor 4 | Award 1 | USA, UK   | Director 5, Director 1 | Action, Adventure | English   | 85        | A great plot | Media Poster 2 | PG-13 | 2020-02-03 | 120 min | Media Title 2 | Series  | Writer 1 | 2020 | 8.5        | 1500      |
		| 3  | Actor 1, Actor 5 | Award 1 | USA, UK   | Director 2, Director 7 | Comedy, Drama     | English   | 85        | A great plot | Media Poster 3 | PG-13 | 2020-02-03 | 120 min | Media Title 3 | Game    | Writer 1 | 2020 | 8.5        | 1500      |
		| 4  | Actor 1, Actor 6 | Award 1 | USA, UK   | Director 6, Director 2 | Thriller, Action  | English   | 85        | A great plot | Media Poster 4 | PG-13 | 2020-02-03 | 120 min | Media Title 4 | Episode | Writer 1 | 2020 | 8.5        | 1500      |
		| 5  | Actor 1, Actor 8 | Award 1 | USA, UK   | Director 8, Director 4 | Drama, Romance    | English   | 85        | A great plot | Media Poster 5 | PG-13 | 2020-02-03 | 120 min | Media Title 5 | Series  | Writer 1 | 2020 | 8.5        | 1500      |
		| 6  | Actor 1, Actor 9 | Award 1 | USA, UK   | Director 1, Director 7 | Fantasy, Action   | English   | 85        | A great plot | Media Poster 6 | PG-13 | 2020-02-03 | 120 min | Media Title 6 | Movie   | Writer 1 | 2020 | 8.5        | 1500      |
		| 7  | Actor 1, Actor 3 | Award 1 | USA, UK   | Director 4, Director 8 | Horror, Thriller  | English   | 85        | A great plot | Media Poster 7 | PG-13 | 2020-02-03 | 120 min | Media Title 7 | Game    | Writer 1 | 2020 | 8.5        | 1500      |
	And I have the following backlogs
		| Id | UserId | MediaId | MediaType | Category | MediaPoster    | MediaTitle    | AddedDate  |
		| 1  | 1      | 1       | Movie     | 0        | Media Poster 1 | Media Title 1 | 2025-02-01 |
		| 2  | 2      | 2       | Series    | 1        | Media Poster 2 | Media Title 2 | 2025-02-02 |
		| 3  | 3      | 3       | Game      | 2        | Media Poster 3 | Media Title 3 | 2025-02-03 |
		| 4  | 4      | 4       | Episode   | 0        | Media Poster 4 | Media Title 4 | 2022-02-03 |
		| 5  | 1      | 5       | Series    | 1        | Media Poster 5 | Media Title 5 | 2025-02-04 |
		| 6  | 2      | 6       | Movie     | 0        | Media Poster 6 | Media Title 6 | 2025-02-05 |
		| 7  | 3      | 7       | Game      | 1        | Media Poster 7 | Media Title 7 | 2023-02-06 |
		| 8  | 4      | 1       | Movie     | 2        | Media Poster 1 | Media Title 1 | 2025-02-07 |
		| 9  | 1      | 2       | Series    | 0        | Media Poster 2 | Media Title 2 | 2025-02-08 |
		| 10 | 2      | 3       | Game      | 1        | Media Poster 3 | Media Title 3 | 2024-02-09 |
		| 11 | 3      | 4       | Episode   | 2        | Media Poster 4 | Media Title 4 | 2025-02-10 |
		| 12 | 4      | 5       | Series    | 0        | Media Poster 5 | Media Title 5 | 2025-02-11 |
		| 13 | 1      | 6       | Movie     | 2        | Media Poster 6 | Media Title 6 | 2024-02-12 |
		| 14 | 2      | 7       | Game      | 0        | Media Poster 7 | Media Title 7 | 2025-02-13 |
		| 15 | 3      | 1       | Movie     | 1        | Media Poster 1 | Media Title 1 | 2025-02-14 |

Scenario: Get a users backlog
	When I call GetBacklog with user id 1
	Then The status code should be 200
	And The BacklokObjectModel should be 
		| Backlog | TotalBacklogCount | InProgress | TotalInProgressCount | Finished | TotalFinishedCount |
		| 2       | 2                 | 1          | 1                    | 1        | 1                  |
	And The Backlogged backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 9  | 1      | 2       | Series    | Media Poster 2 | Media Title 2 | 0        | 2025-02-08 |
		| 1  | 1      | 1       | Movie     | Media Poster 1 | Media Title 1 | 0        | 2025-02-01 |
	And The InProgress backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 5  | 1      | 5       | Series    | Media Poster 5 | Media Title 5 | 1        | 2025-02-04 |
	And The Finished backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 13 | 1      | 6       | Movie     | Media Poster 6 | Media Title 6 | 2        | 2024-02-12 |

Scenario: Get a users backlog that doesn't exist
	When I call GetBacklog with user id 5
	Then The status code should be 200
	And The BacklokObjectModel should be 
		| Backlog | TotalBacklogCount | InProgress | TotalInProgressCount | Finished | TotalFinishedCount |
		| 0       | 0                 | 0          | 0                    | 0        | 0                  |
	And The Backlogged backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
	And The InProgress backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
	And The Finished backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |

Scenario: Get a users backlog by Backlogged type
	When I call GetBackloggedBacklog with user id 1
	Then The status code should be 200
	And The Backlogged backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 9  | 1      | 2       | Series    | Media Poster 2 | Media Title 2 | 0        | 2025-02-08 |
		| 1  | 1      | 1       | Movie     | Media Poster 1 | Media Title 1 | 0        | 2025-02-01 |

Scenario: Get a users backlog by InProgress type
	When I call GetInProgressBacklog with user id 1
	Then The status code should be 200
	And The InProgress backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 5  | 1      | 5       | Series    | Media Poster 5 | Media Title 5 | 1        | 2025-02-04 |

Scenario: Get a users backlog by Finished type
	When I call GetFinishedBacklog with user id 1
	Then The status code should be 200
	And The Finished backlogs should be
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 13 | 1      | 6       | Movie     | Media Poster 6 | Media Title 6 | 2        | 2024-02-12 |

Scenario: Post a backlog
	When I call PostBacklog with the backlog model
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 16 | 1      | 7       | Game      | Media Poster 7 | Media Title 7 | 0        | 2025-02-13 |
	Then The status code should be 200
	And The response should be "Media Title 7 added to backlog"

Scenario: Post a backlog but the user doesn't exist
	When I call PostBacklog with the backlog model
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 16 | 5      | 7       | Game      | Media Poster 7 | Media Title 7 | 0        | 2025-02-13 |
	Then The status code should be 404
	And The response should be "User not found"

Scenario: Post a backlog but the media doesn't exist
	When I call PostBacklog with the backlog model
		| Id | UserId | MediaId | MediaType | MediaPoster    | MediaTitle    | Category | AddedDate  |
		| 16 | 1      | 8       | Game      | Media Poster 8 | Media Title 8 | 0        | 2025-02-13 |
	Then The status code should be 404
	And The response should be "Media not found"
	
Scenario: Delete a backlog
	When I call DeleteBacklog with the media id 1 and user id 3
	Then The status code should be 200
	And The response should be "Media Title 1 removed from Test 3 backlog"

Scenario: Delete a backlog that doesn't exist
	When I call DeleteBacklog with the media id 7 and user id 4
	Then The status code should be 404
	And The response should be "Backlog not found"

Scenario: Update a backlog to state Backlog
	When I call UpdateBacklogState with the id 2 and new state Backlog
	Then The status code should be 200
	And The response should be "Backlog 2 updated to Backlog state"

Scenario: Update a backlog to state InProgress
	When I call UpdateBacklogState with the id 1 and new state InProgress
	Then The status code should be 200
	And The response should be "Backlog 1 updated to InProgress state"

Scenario: Update a backlog to state Finished
	When I call UpdateBacklogState with the id 1 and new state Finished
	Then The status code should be 200
	And The response should be "Backlog 1 updated to Finished state"

Scenario: Update a backlog that doesn't exist
	When I call UpdateBacklogState with the id 16 and new state Finished
	Then The status code should be 404
	And The response should be "Backlog not found"

Scenario: Get a users backlog status that is true
	When I call GetUserBacklogStatus with the media id 1 and user id 1
	Then The status code should be 200
	And The response should be true

Scenario: Get a users backlog status that is false
	When I call GetUserBacklogStatus with the media id 4 and user id 1
	Then The status code should be 200
	And The response should be false
