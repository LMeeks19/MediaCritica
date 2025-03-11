Feature: MediaControllerTests

Background: 
	Given I have the following users
		| Id | Forename | Surname | Email           | Password     | Joined     |
		| 1  | Test     | 1       | test1@email.com | Password123! | 2025-01-01 |
		| 2  | Test     | 2       | test2@email.com | Password456! | 2025-01-02 |
		| 3  | Test     | 3       | test3@email.com | Password789! | 2025-01-03 |
		| 4  | Test     | 4       | test4@email.com | Password012! | 2025-01-04 |
	And I have the following movies
		| Id | Actors           | Awards  | Countries | Directors              | Genres          | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type  | Writers  | Year | ImdbRating | ImdbVotes | BoxOffice    | DVD | Website | Production |
		| 1  | Actor 1, Actor 2 | Award 1 | USA, UK   | Director 1, Director 2 | Action, Drama   | English   | 85        | A great plot | Media Poster 1 | PG-13 | 2025-02-03 | 120 min | Media Title 1 | movie | Writer 1 | 2025 | 7.2        | 1500      | $300,000,000 |     |         |            |
		| 6  | Actor 1, Actor 9 | Award 1 | USA, UK   | Director 1, Director 7 | Fantasy, Action | English   | 85        | A great plot | Media Poster 6 | PG-13 | 2022-04-10 | 120 min | Media Title 6 | movie | Writer 1 | 2022 | 5          | 1500      | $800,000,000 |     |         |            |
	And I have the following series
		| Id | Actors           | Awards  | Countries | Directors              | Genres            | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type   | Writers  | Year | ImdbRating | ImdbVotes | TotalSeasons |
		| 2  | Actor 1, Actor 4 | Award 1 | USA, UK   | Director 5, Director 1 | Action, Adventure | English   | 85        | A great plot | Media Poster 2 | PG-13 | 2024-11-09 | 120 min | Media Title 2 | series | Writer 1 | 2024 | 9          | 1500      | 1            |
		| 5  | Actor 1, Actor 8 | Award 1 | USA, UK   | Director 8, Director 4 | Drama, Romance    | English   | 85        | A great plot | Media Poster 5 | PG-13 | 2025-01-01 | 120 min | Media Title 5 | series | Writer 1 | 2025 | 2          | 1500      | 1            |
	And I have the following seasons
		| Id | SeriesId | SeasonNo | Title         |
		| 1  | 2        | 1        | Media Title 2 |
		| 2  | 5        | 1        | Media Title 5 |
	And I have the following games
		| Id | Actors           | Awards  | Countries | Directors              | Genres           | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type | Writers  | Year | ImdbRating | ImdbVotes | BoxOffice | DVD | Website | Production |
		| 3  | Actor 1, Actor 5 | Award 1 | USA, UK   | Director 2, Director 7 | Comedy, Drama    | English   | 85        | A great plot | Media Poster 3 | PG-13 | 2024-06-21 | 120 min | Media Title 3 | game | Writer 1 | 2024 | 8.5        | 1500      |           |     |         |            |
		| 7  | Actor 1, Actor 3 | Award 1 | USA, UK   | Director 4, Director 8 | Horror, Thriller | English   | 85        | A great plot | Media Poster 7 | PG-13 | 2026-10-16 | 120 min | Media Title 7 | game | Writer 1 | 2026 | 3          | 1500      |           |     |         |            |
	And I have the following episodes
		| Id | Actors           | Awards  | Countries | Directors              | Genres           | Languages | Metascore | Plot         | Poster         | Rated | Released   | Runtime | Title         | Type    | Writers  | Year | ImdbRating | ImdbVotes | EpisodeNo | SeasonNo | SeasonId |
		| 4  | Actor 1, Actor 6 | Award 1 | USA, UK   | Director 6, Director 2 | Thriller, Action | English   | 85        | A great plot | Media Poster 4 | PG-13 | 2024-01-19 | 120 min | Media Title 4 | episode | Writer 1 | 2022 | 6          | 1500      | 1         | 1        | 1        |
	And I have the following reviews
		| Id | MediaId | MediaPoster    | MediaTitle    | MediaType | UserId | ReviewerName | Rating | Title        | Description        | Date       |
		| 1  | 1       | Media Poster 1 | Media Title 1 | movie     | 1      | Test 3       | 1      | Test Title 1 | Test Description 1 | 2025-02-04 |
		| 2  | 1       | Media Poster 1 | Media Title 1 | movie     | 2      | Test 3       | 2      | Test Title 2 | Test Description 2 | 2025-02-06 |
		| 3  | 1       | Media Poster 1 | Media Title 1 | movie     | 3      | Test 3       | 2      | Test Title 3 | Test Description 3 | 2024-02-08 |
		| 4  | 5       | Media Poster 5 | Media Title 5 | series    | 4      | Test 4       | 5      | Test Title 4 | Test Description 4 | 2025-02-26 |

Scenario: Get media by external search
	When I call GetMediaByExternalSearch with search term "Media Title 1"
	Then The status code should be 200
	And The MediaSearchResultResponse should be
		| Response | Search | TotalResults |
		| True     | 1      | 1            |
	And The MediaSearchModels should be
		| Poster         | Title         | Type  | Year | imdbID |
		| Media Poster 1 | Media Title 1 | movie | 2025 | 1      |

Scenario: Get media by external search that doesn't exist
	When I call GetMediaByExternalSearch with search term "Media Title 8"
	Then The status code should be 404
	And The response should be "No results found"

Scenario: Get explore media by search
	When I call GetExploreMediaBySearch with search term "Media Title 1"
	Then The status code should be 200
	And The MediaSummaryModels should be
		| Id | Title         | Type    | Poster         | Genre            | Released   | ImdbRating |
		| 1  | Media Title 1 | movie   | Media Poster 1 | Action, Drama    | 2025-02-03 | 7.2        |

Scenario: Get explore media 
	When I call GetExploreMedia
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 6               | 6                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type    | Poster         | Genre            | Released   | ImdbRating |
		| 1  | Media Title 1 | movie   | Media Poster 1 | Action, Drama    | 2025-02-03 | 7.2        |
		| 2  | Media Title 2 | series  | Media Poster 2 | Action, Adventur | 2024-11-09 | 9          |
		| 3  | Media Title 3 | game    | Media Poster 3 | Comedy, Drama    | 2024-06-21 | 8.5        |
		| 5  | Media Title 5 | series  | Media Poster 5 | Drama, Romance   | 2025-01-01 | 2          |
		| 6  | Media Title 6 | movie   | Media Poster 6 | Fantasy, Action  | 2022-04-10 | 5          |
		| 7  | Media Title 7 | game    | Media Poster 7 | Horror, Thriller | 2026-10-16 | 3          |

Scenario: Get best of previous year
	When I call GetBestOfPrevYear
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 2               | 2                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type    | Poster         | Genre            | Released   | ImdbRating |
		| 2  | Media Title 2 | series  | Media Poster 2 | Action, Adventur | 2024-11-09 | 9          |
		| 3  | Media Title 3 | game    | Media Poster 3 | Comedy, Drama    | 2024-06-21 | 8.5        |

Scenario: Get best of current year
	When I call GetBestOfCurYear
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 2               | 2                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type   | Poster         | Genre          | Released   | ImdbRating |
		| 1  | Media Title 1 | movie  | Media Poster 1 | Action, Drama  | 2025-02-03 | 7.2        |
		| 5  | Media Title 5 | series | Media Poster 5 | Drama, Romance | 2025-01-01 | 2          |

Scenario: Get best of all time
	When I call GetBestOfAllTime
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 5               | 5                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type    | Poster         | Genre            | Released   | ImdbRating |
		| 2  | Media Title 2 | series  | Media Poster 2 | Action, Adventur | 2024-11-09 | 9          |
		| 3  | Media Title 3 | game    | Media Poster 3 | Comedy, Drama    | 2024-06-21 | 8.5        |
		| 1  | Media Title 1 | movie   | Media Poster 1 | Action, Drama    | 2025-02-03 | 7.2        |
		| 6  | Media Title 6 | movie   | Media Poster 6 | Fantasy, Action  | 2022-04-10 | 5          |
		| 5  | Media Title 5 | series  | Media Poster 5 | Drama, Romance   | 2025-01-01 | 2          |

Scenario: Get upcomng
	When I call GetUpcoming
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 1               | 1                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type | Poster         | Genre            | Released   | ImdbRating |
		| 7  | Media Title 7 | game | Media Poster 7 | Horror, Thriller | 2026-10-16 | 3          |

Scenario: Get latest
	When I call GetLatest
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 5               | 5                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type    | Poster         | Genre            | Released   | ImdbRating |
		| 1  | Media Title 1 | movie   | Media Poster 1 | Action, Drama    | 2025-02-03 | 7.2        |
		| 5  | Media Title 5 | series  | Media Poster 5 | Drama, Romance   | 2025-01-01 | 2          |
		| 2  | Media Title 2 | series  | Media Poster 2 | Action, Adventur | 2024-11-09 | 9          |
		| 3  | Media Title 3 | game    | Media Poster 3 | Comedy, Drama    | 2024-06-21 | 8.5        |
		| 6  | Media Title 6 | movie   | Media Poster 6 | Fantasy, Action  | 2022-04-10 | 5          |

Scenario: Get seasonal picks
	When I call GetSeasonalPicks
	Then The status code should be 200	
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 1               | 1                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type  | Poster         | Genre           | Released   | ImdbRating |
		| 6  | Media Title 6 | movie | Media Poster 6 | Fantasy, Action | 2022-04-10 | 5          |

Scenario: Get most reviewed
	When I call GetMostReviewed
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 2               | 2                  |	
		And The MediaSummaryModels should be
		| Id | Title         | Type   | Poster         | Genre          | Released   | ImdbRating |
		| 1  | Media Title 1 | movie  | Media Poster 1 | Action, Drama  | 2025-02-03 | 7.2        |
		| 5  | Media Title 5 | series | Media Poster 5 | Drama, Romance | 2025-01-01 | 2          |

Scenario: Get recently reviewed
	When I call GetRecentlyReviewed
	Then The status code should be 200
	And The MediaSummaryModelResponse should be
		| TotalMediaCount | MediaSummaryModels |
		| 2               | 2                  |
	And The MediaSummaryModels should be
		| Id | Title         | Type   | Poster         | Genre          | Released   | ImdbRating |
		| 5  | Media Title 5 | series | Media Poster 5 | Drama, Romance | 2025-01-01 | 2          |
		| 1  | Media Title 1 | movie  | Media Poster 1 | Action, Drama  | 2025-02-03 | 7.2        |

Scenario: Get movie internally
	When I call GetMovie with id 1
	Then The status code should be 200
	And The MovieModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres        | Languages | Metascore | Plot         | Poster         | Rated | Released                 | Runtime | Title         | Type  | Writers  | Year | ImdbRating | ImdbVotes | BoxOffice    | DVD | Website | Production |
		| 1  | Actor 1, Actor 2 | Award 1 | USA, UK   | Director 1, Director 2 | Action, Drama | English   | 85        | A great plot | Media Poster 1 | PG-13 | Monday, February 3, 2025 | 120 min | Media Title 1 | movie | Writer 1 | 2025 | 7.2        | 1500      | $300,000,000 |     |         |            |

Scenario: Get series internally
	When I call GetSeries with id 2
	Then The status code should be 200
	And The SeriesModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres            | Languages | Metascore | Plot         | Poster         | Rated | Released                   | Runtime | Title         | Type   | Writers  | Year | ImdbRating | ImdbVotes | TotalSeasons |
		| 2  | Actor 1, Actor 4 | Award 1 | USA, UK   | Director 5, Director 1 | Action, Adventure | English   | 85        | A great plot | Media Poster 2 | PG-13 | Saturday, November 9, 2024 | 120 min | Media Title 2 | series | Writer 1 | 2024 | 9          | 1500      | 1            |

Scenario: Get season internally
	When I call GetSeason with series id 2
	Then The status code should be 200
	And The SeasonModel should be
		| Season | Title         |
		| 1      | Media Title 2 |

Scenario: Get game internally
	When I call GetGame with id 3
	Then The status code should be 200
	And The GameModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres        | Languages | Metascore | Plot         | Poster         | Rated | Released              | Runtime | Title         | Type | Writers  | Year | imdbRating | ImdbVotes | BoxOffice | DVD | Website | Production |
		| 3  | Actor 1, Actor 5 | Award 1 | USA, UK   | Director 2, Director 7 | Comedy, Drama | English   | 85        | A great plot | Media Poster 3 | PG-13 | Friday, June 21, 2024 | 120 min | Media Title 3 | game | Writer 1 | 2024 | 8.5        | 1500      |           |     |         |            |

Scenario: Get episode internally
	When I call GetEpisode with id 4
	Then The status code should be 200
	And The EpisodeModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres           | Languages | Metascore | Plot         | Poster         | Rated | Released                 | Runtime | Title         | Type    | Writers  | Year | ImdbRating | ImdbVotes | Episode | Season | SeasonId | SeriesTitle   |
		| 4  | Actor 1, Actor 6 | Award 1 | USA, UK   | Director 6, Director 2 | Thriller, Action | English   | 85        | A great plot | Media Poster 4 | PG-13 | Friday, January 19, 2024 | 120 min | Media Title 4 | episode | Writer 1 | 2022 | 6          | 1500      | 1       | 1      | 1        | Media Title 2 |

Scenario: Get movie externally
	When I call GetMovie with id 10
	Then The status code should be 200
	And The MovieModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres        | Languages | Metascore | Plot         | Poster          | Rated | Released                 | Runtime | Title          | Type  | Writers  | Year | ImdbRating | ImdbVotes | BoxOffice    | DVD | Website | Production |
		| 10 | Actor 1, Actor 2 | Award 1 | USA, UK   | Director 1, Director 2 | Action, Drama | English   | 85        | A great plot | Media Poster 10 | PG-13 | Monday, February 3, 2025 | 120 min | Media Title 10 | movie | Writer 1 | 2025 | 7.2        | 1500      | $300,000,000 |     |         |            |

Scenario: Get series externally
	When I call GetSeries with id 11
	Then The status code should be 200
	And The SeriesModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres            | Languages | Metascore | Plot         | Poster          | Rated | Released                   | Runtime | Title          | Type   | Writers  | Year | ImdbRating | ImdbVotes | TotalSeasons |
		| 11 | Actor 1, Actor 4 | Award 1 | USA, UK   | Director 5, Director 1 | Action, Adventure | English   | 85        | A great plot | Media Poster 11 | PG-13 | Saturday, November 9, 2024 | 120 min | Media Title 11 | series | Writer 1 | 2024 | 9          | 1500      | 1            |

Scenario: Get season externally
	When I call GetSeason with series id 11
	Then The status code should be 200
	And The SeasonModel should be
		| Season | Title          |
		| 1      | Media Title 11 |

Scenario: Get game externally
	When I call GetGame with id 12
	Then The status code should be 200
	And The GameModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres        | Languages | Metascore | Plot         | Poster          | Rated | Released              | Runtime | Title          | Type | Writers  | Year | imdbRating | ImdbVotes | BoxOffice | DVD | Website | Production |
		| 12 | Actor 1, Actor 5 | Award 1 | USA, UK   | Director 2, Director 7 | Comedy, Drama | English   | 85        | A great plot | Media Poster 12 | PG-13 | Friday, June 21, 2024 | 120 min | Media Title 12 | game | Writer 1 | 2024 | 8.5        | 1500      |           |     |         |            |

Scenario: Get episode externally
	When I call GetEpisode with id 13
	Then The status code should be 200
	And The EpisodeModel should be
		| Id | Actors           | Awards  | Countries | Directors              | Genres           | Languages | Metascore | Plot         | Poster          | Rated | Released                 | Runtime | Title          | Type    | Writers  | Year | imdbRating | ImdbVotes | Episode | Season | SeasonId | SeriesTitle   |
		| 13 | Actor 1, Actor 6 | Award 1 | USA, UK   | Director 6, Director 2 | Thriller, Action | English   | 85        | A great plot | Media Poster 13 | PG-13 | Friday, January 19, 2024 | 120 min | Media Title 13 | episode | Writer 1 | 2022 | 6          | 1500      | 2       | 1      | 1        | Media Title 2 |

Scenario: Get movie that doesn't exist
	When I call GetMovie with id 2
	Then The status code should be 404
	And The response should be "Movie not found"

Scenario: Get series that doesn't exist
	When I call GetSeries with id 3
	Then The status code should be 404
	And The response should be "Series not found"

Scenario: Get season that doesn't exist
	When I call GetSeason with series id 10
	Then The status code should be 404
	And The response should be "Season not found"

Scenario: Get game that doesn't exist
	When I call GetGame with id 4
	Then The status code should be 404
	And The response should be "Game not found"

Scenario: Get episode that doesn't exist
	When I call GetEpisode with id 1
	Then The status code should be 404
	And The response should be "Episode not found"
