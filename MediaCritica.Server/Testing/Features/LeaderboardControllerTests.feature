Feature: LeaderboardControllerTests

TODO

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following media
		| Id | Actors    | Awards  | Countries   | Directors              | Genres            | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type    | Writers  | Year | ImdbRating | ImdbVotes |
		| 1  | Actor 1,2 | Award 1 | USA, UK | Director 1, Director 2 | Action, Drama     | English   | 85        | A great plot | Media Poster 1 | PG-13 | 2020-02-03 | 120 min | Media Title 1 | Movie   | Writer 1 | 2020 | 8.5        | 1500      |
		| 2  | Actor 1,2 | Award 1 | USA, UK | Director 5, Director 1 | Action, Adventure | English   | 85        | A great plot | Media Poster 2 | PG-13 | 2020-02-03 | 120 min | Media Title 2 | Series  | Writer 1 | 2020 | 8.5        | 1500      |
		| 3  | Actor 1,2 | Award 1 | USA, UK | Director 2, Director 7 | Comedy, Drama     | English   | 85        | A great plot | Media Poster 3 | PG-13 | 2020-02-03 | 120 min | Media Title 3 | Game    | Writer 1 | 2020 | 8.5        | 1500      |
		| 4  | Actor 1,2 | Award 1 | USA, UK | Director 6, Director 2 | Thriller, Action  | English   | 85        | A great plot | Media Poster 4 | PG-13 | 2020-02-03 | 120 min | Media Title 4 | Episode | Writer 1 | 2020 | 8.5        | 1500      |
		| 5  | Actor 1,2 | Award 1 | USA, UK | Director 8, Director 4 | Drama, Romance    | English   | 85        | A great plot | Media Poster 5 | PG-13 | 2020-02-03 | 120 min | Media Title 5 | Series  | Writer 1 | 2020 | 8.5        | 1500      |
		| 6  | Actor 1,2 | Award 1 | USA, UK | Director 1, Director 7 | Fantasy, Action   | English   | 85        | A great plot | Media Poster 6 | PG-13 | 2020-02-03 | 120 min | Media Title 6 | Movie   | Writer 1 | 2020 | 8.5        | 1500      |
		| 7  | Actor 1,2 | Award 1 | USA, UK | Director 4, Director 8 | Horror, Thriller  | English   | 85        | A great plot | Media Poster 7 | PG-13 | 2020-02-03 | 120 min | Media Title 7 | Game    | Writer 1 | 2020 | 8.5        | 1500      |
	And I have the following reviews
		| Id | MediaId | MediaPoster    | MediaTitle    | MediaType | UserId | ReviewerName | Rating | Title    | Description    | Date       |
		| 1  | 1       | Media Poster 1 | Media Title 1 | Movie     | 1      | Test 1       | 4      | Title 1  | Description 1  | 2025-02-03 |
		| 2  | 2       | Media Poster 2 | Media Title 2 | Series    | 1      | Test 1       | 2      | Title 2  | Description 2  | 2025-02-27 |
		| 3  | 3       | Media Poster 3 | Media Title 3 | Game      | 1      | Test 1       | 1      | Title 3  | Description 3  | 2025-01-01 |
		| 4  | 4       | Media Poster 4 | Media Title 4 | Episode   | 1      | Test 1       | 4.5    | Title 4  | Description 4  | 2025-01-04 |
		| 5  | 5       | Media Poster 5 | Media Title 5 | Series    | 2      | Test 2       | 1.5    | Title 5  | Description 5  | 2025-01-04 |
		| 6  | 6       | Media Poster 6 | Media Title 6 | Movie     | 2      | Test 2       | 2      | Title 6  | Description 6  | 2024-01-04 |
		| 7  | 7       | Media Poster 7 | Media Title 7 | Game      | 3      | Test 3       | 2.5    | Title 7  | Description 7  | 2025-01-05 |
		| 8  | 1       | Media Poster 1 | Media Title 1 | Movie     | 2      | Test 2       | 3.5    | Title 8  | Description 8  | 2025-01-15 |
		| 9  | 2       | Media Poster 2 | Media Title 2 | Series    | 3      | Test 3       | 4      | Title 9  | Description 9  | 2025-02-10 |
		| 10 | 3       | Media Poster 3 | Media Title 3 | Game      | 4      | Test 4       | 2      | Title 10 | Description 10 | 2025-01-25 |
		| 11 | 4       | Media Poster 4 | Media Title 4 | Episode   | 1      | Test 1       | 3      | Title 11 | Description 11 | 2025-02-20 |
		| 12 | 5       | Media Poster 5 | Media Title 5 | Series    | 2      | Test 2       | 1      | Title 12 | Description 12 | 2024-12-15 |
		| 13 | 6       | Media Poster 6 | Media Title 6 | Movie     | 3      | Test 3       | 4.5    | Title 13 | Description 13 | 2025-02-03 |
		| 14 | 7       | Media Poster 7 | Media Title 7 | Game      | 4      | Test 4       | 5      | Title 14 | Description 14 | 2025-01-28 |
		| 15 | 1       | Media Poster 1 | Media Title 1 | Movie     | 1      | Test 1       | 3      | Title 15 | Description 15 | 2025-02-15 |
		| 16 | 2       | Media Poster 2 | Media Title 2 | Series    | 4      | Test 4       | 2.5    | Title 16 | Description 16 | 2025-01-18 |
		| 17 | 3       | Media Poster 3 | Media Title 3 | Game      | 1      | Test 1       | 4      | Title 17 | Description 17 | 2025-01-07 |
		| 18 | 4       | Media Poster 4 | Media Title 4 | Episode   | 3      | Test 3       | 1.5    | Title 18 | Description 18 | 2025-02-22 |
		| 19 | 5       | Media Poster 5 | Media Title 5 | Series    | 4      | Test 4       | 3.5    | Title 19 | Description 19 | 2025-02-08 |
		| 20 | 6       | Media Poster 6 | Media Title 6 | Movie     | 2      | Test 2       | 2      | Title 20 | Description 20 | 2025-01-10 |
		| 21 | 7       | Media Poster 7 | Media Title 7 | Game      | 1      | Test 1       | 1      | Title 21 | Description 21 | 2025-01-02 |
		| 22 | 1       | Media Poster 1 | Media Title 1 | Movie     | 4      | Test 4       | 4.5    | Title 22 | Description 22 | 2025-02-14 |
		| 23 | 2       | Media Poster 2 | Media Title 2 | Series    | 2      | Test 2       | 3      | Title 23 | Description 23 | 2025-01-20 |
		| 24 | 3       | Media Poster 3 | Media Title 3 | Game      | 3      | Test 3       | 5      | Title 24 | Description 24 | 2025-02-05 |
		| 25 | 4       | Media Poster 4 | Media Title 4 | Episode   | 1      | Test 1       | 2      | Title 25 | Description 25 | 2025-02-18 |
		| 26 | 5       | Media Poster 5 | Media Title 5 | Series    | 3      | Test 3       | 4      | Title 26 | Description 26 | 2024-11-12 |
		| 27 | 6       | Media Poster 6 | Media Title 6 | Movie     | 4      | Test 4       | 3.5    | Title 27 | Description 27 | 2025-02-06 |
		| 28 | 7       | Media Poster 7 | Media Title 7 | Game      | 2      | Test 2       | 2.5    | Title 28 | Description 28 | 2025-01-19 |
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
		| 1    | Test 1 | 5       | month     |
		| 2    | Test 3 | 4       | month     |
		| 3    | Test 4 | 3       | month     |

Scenario: Get user rankings for year
	When I call GetUserRankings for year
	Then The status code should be 200
	And The UserRankingModels reposne should be
		| Rank | Name   | Reviews | Timeframe |
		| 1    | Test 1 | 9       | year      |
		| 2    | Test 4 | 6       | year      |
		| 3    | Test 2 | 5       | year      |
		| 4    | Test 3 | 5       | year      |

Scenario: Get user rankings for all time
	When I call GetUserRankings for all-time
	Then The status code should be 200
	And The UserRankingModels reposne should be
		| Rank | Name   | Reviews | Timeframe |
		| 1    | Test 1 | 9       | all-time  |
		| 2    | Test 2 | 7       | all-time  |
		| 3    | Test 3 | 6       | all-time  |
		| 4    | Test 4 | 6       | all-time  |

Scenario: Get media trends for week
	When I call GetMediaTrends for week
	Then The status code should be 200
	And The MediaTrendModels reposne should be
		| AwardType         | Title         | Description                                     | TimeFrame |
		| Falling Star      | Media Title 4 | 3 fewer reviews than the previous week.         | week      |
		| Highest Rated     | Media Title 2 | An outstanding average rating of 2.0 this week! | week      |
		| Most Active Genre | Action        | Action is the most active genre this week!      | week      |
		| Most Reviewed     | Media Title 2 | 1 reviews this week!                            | week      |
		| Rising Star       | Media Title 2 | 1 more reviews than the previous week!          | week      |

Scenario: Get media trends for month
	When I call GetMediaTrends for month
	Then The status code should be 200
	And The MediaTrendModels reposne should be
		| AwardType          | Title         | Description                                                                         | TimeFrame |
		| Comeback           | Media Title 4 | A comeback with 3 reviews this month after a period of inactivity!                  | month     |
		| Director Spotlight | Director 7    | 3 reviews on their media with an average rating of 4.5!                             | month     |
		| Falling Star       | Media Title 7 | 3 fewer reviews than the previous month.                                            | month     |
		| Hidden Gem         | Media Title 3 | 1 reviews with an average rating of 5.0!                                            | month     |
		| Highest Rated      | Media Title 3 | An outstanding average rating of 5.0 this month!                                    | month     |
		| Most Abandoned     | Media Title 2 | 2 users either abandoned it early or never started it this month!                   | month     |
		| Most Active Genre  | Action        | Action is the most active genre this month!                                         | month     |
		| Most Backlogged    | Media Title 1 | Added to backlogs 3 times this month!                                               | month     |
		| Most Polarizing    | Media Title 2 | Media Title 2 sparked a lot of debate this month, with a variability score of 1.00! | month     |
		| Most Reviewed      | Media Title 4 | 3 reviews this month!                                                               | month     |
		| Most Unfinished    | Media Title 2 | 1 user didn't complete it this month!                                               | month     |
		| Rising Star        | Media Title 4 | 2 more reviews than the previous month!                                             | month     |
		| Sleeper Hit        | Media Title 4 | 3 reviews this month! More than its average of 1 per month                          | month     |

Scenario: Get media trends for year
	When I call GetMediaTrends for year
	Then The status code should be 200
	And The MediaTrendModels reposne should be		
		| AwardType         | Title         | Description                                                                        | TimeFrame |
		| Comeback          | Media Title 4 | A comeback with 4 reviews this year after a period of inactivity!                  | year      |
		| Highest Rated     | Media Title 1 | An outstanding average rating of 3.8 this year!                                    | year      |
		| Most Abandoned    | Media Title 2 | 2 users either abandoned it early or never started it this year!                   | year      |
		| Most Active Genre | Action        | Action is the most active genre this year!                                         | year      |
		| Most Backlogged   | Media Title 1 | Added to backlogs 3 times this year!                                               | year      |
		| Most Polarizing   | Media Title 3 | Media Title 3 sparked a lot of debate this year, with a variability score of 1.58! | year      |
		| Most Reviewed     | Media Title 4 | 4 reviews this year!                                                               | year      |
		| Most Unfinished   | Media Title 2 | 1 user didn't complete it this year!                                               | year      |
		| Rising Star       | Media Title 4 | 4 more reviews than the previous year!                                             | year      |
		| Sleeper Hit       | Media Title 4 | 4 reviews this year! More than its average of 0 per year                           | year      |

Scenario: Get media trends for all-time		
	When I call GetMediaTrends for all-time
	Then The status code should be 200
	And The MediaTrendModels reposne should be
      | AwardType         | Title         | Description                                                                                | TimeFrame |
      | Comeback          | Media Title 4 | A comeback with 4 reviews this all-time after a period of inactivity!                      | all-time  |
      | Highest Rated     | Media Title 1 | An outstanding average rating of 3.8 this all-time!                                        | all-time  |
      | Most Abandoned    | Media Title 2 | 2 users either abandoned it early or never started it this all-time!                       | all-time  |
      | Most Active Genre | Action        | Action is the most active genre this all-time!                                             | all-time  |
      | Most Anticipated  | Media Title 1 | Added to user backlogs 3 times ahead of its release on Monday, February 3rd this all-time! | all-time  |
      | Most Backlogged   | Media Title 1 | Added to backlogs 3 times this all-time!                                                   | all-time  |
      | Most Polarizing   | Media Title 3 | Media Title 3 sparked a lot of debate this all-time, with a variability score of 1.58!     | all-time  |
      | Most Reviewed     | Media Title 4 | 4 reviews this all-time!                                                                   | all-time  |
      | Most Unfinished   | Media Title 3 | 1 user didn't complete it this all-time!                                                   | all-time  |
      | Rising Star       | Media Title 4 | 4 more reviews than the previous all-time!                                                 | all-time  |
      | Sleeper Hit       | Media Title 4 | 4 reviews this all-time! More than its average of 0 per all-time                           | all-time  |