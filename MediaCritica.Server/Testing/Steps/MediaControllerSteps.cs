using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using MediaCritica.Server.Models.Media_Models;
using MediaCritica.Server.Objects.Media_Objects;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class MediaControllerSteps
    {
        [When(@"I call GetMediaByExternalSearch with search term ""(.*)""")]
        public async Task WhenICallGetGetMediaByExternalSearchWithSearchTerm(string searchTerm)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetMediaByExternalSearch(searchTerm, 0);
        }

        [When(@"I call GetExploreMediaBySearch with search term ""(.*)""")]
        public async Task WhenICallGetExploreMediaBySearchWithSearchTerm(string searchTerm)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetExploreMediaBySearch(searchTerm);
        }

        [When(@"I call GetExploreMedia")]
        public async Task WhenICallGetExploreMedia()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetExploreMedia(0);
        }

        [When(@"I call GetBestOfPrevYear")]
        public async Task WhenICallGetBestOfPrevYear()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetBestOfPrevYear(0);
        }

        [When(@"I call GetBestOfCurYear")]
        public async Task WhenICallGetBestOfCurYear()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetBestOfCurYear(0);
        }

        [When(@"I call GetBestOfAllTime")]
        public async Task WhenICallGetBestOfAllTime()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetBestOfAllTime(0);
        }

        [When(@"I call GetUpcoming")]
        public async Task WhenICallGetUpcoming()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetUpcoming(0);
        }

        [When(@"I call GetLatest")]
        public async Task WhenICallGetLatest()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetLatest(0);
        }

        [When(@"I call GetSeasonalPicks")]
        public async Task WhenICallGetSeasonalPicks()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetSeasonalPicks(0);
        }

        [When(@"I call GetMostReviewed")]
        public async Task WhenICallGetMostReviewed()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetMostReviewed(0);
        }

        [When(@"I call GetRecentlyReviewed")]
        public async Task WhenICallGetRecentlyReviewed()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetRecentlyReviewed(0);
        }

        [When(@"I call GetMovie with id (\d+)")]
        public async Task WhenICallGetMovieWithId(string movieId)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetMovie(movieId);
        }

        [When(@"I call GetSeries with id (\d+)")]
        public async Task WhenICallGetSeriesWithId(string seriesId)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetSeries(seriesId);
        }

        [When(@"I call GetSeason with series id (\d+)")]
        public async Task WhenICallGetSeasonWithSeriesId(string seriesId)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetSeason(seriesId);
        }

        [When(@"I call GetGame with id (\d+)")]
        public async Task WhenICallGetGameWithId(string gameId)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetGame(gameId);
        }

        [When(@"I call GetEpisode with id (\d+)")]
        public async Task WhenICallGetEpisodeWithId(string episodeId)
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.GetEpisode(episodeId);
        }

        [When(@"I call SurpriseMe")]
        public async Task WhenICallSurpriseMe()
        {
            GlobalSteps._response = await GlobalSteps._controller.MediaController.SurpriseMe();
        }

        [Then(@"The response should exist in the database")]
        public void ThenTheResponseShouldExistInTheDatabase()
        {
            var okResult = GlobalSteps._response as OkObjectResult;
            Assert.IsNotNull(okResult);

            var randomMedia = okResult!.Value;
            Assert.IsNotNull(randomMedia);

            var mediaId = randomMedia!.GetType().GetProperty("Id")?.GetValue(randomMedia)?.ToString();
            Assert.IsNotNull(mediaId);

            Assert.IsTrue(GlobalSteps._dbContext.Media.Any(m => m.Id == mediaId));
        }

        [Then(@"The response should not be an episode")]
        public void ThenTheResponseShouldNotBeAnEpisode()
        {
            var okResult = GlobalSteps._response as OkObjectResult;
            Assert.IsNotNull(okResult);

            var randomMedia = okResult!.Value;
            Assert.IsNotNull(randomMedia);

            var mediaType = randomMedia!.GetType().GetProperty("Type")?.GetValue(randomMedia)?.ToString();
            Assert.IsNotNull(mediaType);

            Assert.IsTrue(mediaType != MediaType.Episode);
        }

        [Then(@"The MediaSearchResultResponse should be")]
        public void ThenTheMediaSearchResultResponseShouldBe(Table table)
        {
            var row = table.Rows.First();
            var expectedMediaSearchResultResponse = new
            {
                Response = row["Response"],
                SearchResults = int.Parse(row["Search"]),
                TotalResults = int.Parse(row["TotalResults"])
            };

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualMediaSearchResultResponse = result.Value as MediaSearchResultResponse;
            Assert.IsNotNull(actualMediaSearchResultResponse);

            Assert.AreEqual(expectedMediaSearchResultResponse.Response, actualMediaSearchResultResponse.Response);
            Assert.AreEqual(expectedMediaSearchResultResponse.SearchResults, actualMediaSearchResultResponse.Search.Count);
            Assert.AreEqual(expectedMediaSearchResultResponse.TotalResults, int.Parse(actualMediaSearchResultResponse.totalResults));
        }

        [Then(@"The MediaSearchModels should be")]
        public void ThenTheMediaSearchModelsShouldBe(Table table)
        {
            var expectedMediaSearchModels = table.CreateSet<MediaSearchModel>().ToList();

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualMediaSearchResultResponse = result.Value as MediaSearchResultResponse;
            Assert.IsNotNull(actualMediaSearchResultResponse);
            var actualMediaSearchModels = actualMediaSearchResultResponse.Search;


            Assert.AreEqual(expectedMediaSearchModels.Count, actualMediaSearchModels.Count);

            for (var i = 0; i < expectedMediaSearchModels.Count; i++)
            {
                var expectedMediaSearchModel = expectedMediaSearchModels[i];
                var actualMediaSearchModel = actualMediaSearchModels[i];

                Assert.AreEqual(expectedMediaSearchModel.Title, actualMediaSearchModel.Title);
                Assert.AreEqual(expectedMediaSearchModel.Poster, actualMediaSearchModel.Poster);
                Assert.AreEqual(expectedMediaSearchModel.Type, actualMediaSearchModel.Type);
                Assert.AreEqual(expectedMediaSearchModel.Year, actualMediaSearchModel.Year);
                Assert.AreEqual(expectedMediaSearchModel.imdbID, actualMediaSearchModel.imdbID);
            }
        }

        [Then(@"The MediaSummaryModelResponse should be")]
        public void ThenTheMediaSummaryModelResponseShouldBe(Table table)
        {
            var row = table.Rows.First();
            var expectedMediaSummaryModelResponse = new
            {
                TotalMediaCount = int.Parse(row["TotalMediaCount"]),
                MediaSummaryModelsCount = int.Parse(row["MediaSummaryModels"]),
            };

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualMediaSummaryModelResponse = result.Value as MediaSummaryModelResponse;
            Assert.IsNotNull(actualMediaSummaryModelResponse);

            Assert.AreEqual(expectedMediaSummaryModelResponse.TotalMediaCount, actualMediaSummaryModelResponse.TotalMediaCount);
            Assert.AreEqual(expectedMediaSummaryModelResponse.MediaSummaryModelsCount, actualMediaSummaryModelResponse.MediaSummaryModels.Count);
        }

        [Then(@"The MediaSummaryModels should be")]
        public void ThenTheMediaSummaryModelsShouldBe(Table table)
        {
            var expectedMediaSummaryModels = table.CreateSet<MediaSummaryModel>().ToList();

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualMediaSummaryResultResponse = result.Value as MediaSummaryModelResponse;
            Assert.IsNotNull(actualMediaSummaryResultResponse);
            var actualMediaSummaryModels = actualMediaSummaryResultResponse.MediaSummaryModels;

            Assert.AreEqual(expectedMediaSummaryModels.Count, actualMediaSummaryModels.Count);

            for (var i = 0; i < expectedMediaSummaryModels.Count; i++)
            {
                var expectedMediaSummaryModel = expectedMediaSummaryModels[i];
                var actualMediaSummaryModel = actualMediaSummaryModels[i];

                Assert.AreEqual(expectedMediaSummaryModel.Id, actualMediaSummaryModel.Id);
                Assert.AreEqual(expectedMediaSummaryModel.Title, actualMediaSummaryModel.Title);
                Assert.AreEqual(expectedMediaSummaryModel.Poster, actualMediaSummaryModel.Poster);
                Assert.AreEqual(expectedMediaSummaryModel.Type, actualMediaSummaryModel.Type);
                Assert.AreEqual(expectedMediaSummaryModel.Genre, actualMediaSummaryModel.Genre);
                Assert.AreEqual(expectedMediaSummaryModel.Released, actualMediaSummaryModel.Released);
                Assert.AreEqual(expectedMediaSummaryModel.ImdbRating, actualMediaSummaryModel.ImdbRating);
            }
        }

        [Then(@"The MovieModel should be")]
        public void ThenTheMovieModelShouldBe(Table table)
        {
            var expectedMovieModel = table.Rows.First().CreateInstance<MovieModel>();
            expectedMovieModel.Country = table.Rows.First()["Countries"];
            expectedMovieModel.Director = table.Rows.First()["Directors"];
            expectedMovieModel.Writer = table.Rows.First()["Writers"];
            expectedMovieModel.Genre = table.Rows.First()["Genres"];
            expectedMovieModel.Language = table.Rows.First()["Languages"];

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualMovieModel = result.Value as MovieModel;
            Assert.IsNotNull(actualMovieModel);

            Assert.IsTrue(AssertMediaModel(expectedMovieModel, actualMovieModel));

            Assert.AreEqual(expectedMovieModel.BoxOffice, actualMovieModel.BoxOffice);
            Assert.AreEqual(expectedMovieModel.DVD, actualMovieModel.DVD);
            Assert.AreEqual(expectedMovieModel.Production, actualMovieModel.Production);
            Assert.AreEqual(expectedMovieModel.Website, actualMovieModel.Website);
        }

        [Then(@"The SeriesModel should be")]
        public void ThenTheSeriesModelShouldBe(Table table)
        {
            var expectedSeriesModel = table.Rows.First().CreateInstance<SeriesModel>();
            expectedSeriesModel.Country = table.Rows.First()["Countries"];
            expectedSeriesModel.Director = table.Rows.First()["Directors"];
            expectedSeriesModel.Writer = table.Rows.First()["Writers"];
            expectedSeriesModel.Genre = table.Rows.First()["Genres"];
            expectedSeriesModel.Language = table.Rows.First()["Languages"];

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualSeriesModel = result.Value as SeriesModel;
            Assert.IsNotNull(actualSeriesModel);

            Assert.IsTrue(AssertMediaModel(expectedSeriesModel, actualSeriesModel));

            Assert.AreEqual(expectedSeriesModel.totalSeasons, actualSeriesModel.totalSeasons);
        }

        [Then(@"The SeasonModel should be")]
        public void ThenTheSeasonModelShouldBe(Table table)
        {
            var expectedSeasonModel = table.Rows.First().CreateInstance<SeasonModel>();

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualSeasonModel = result.Value as SeasonModel;
            Assert.IsNotNull(actualSeasonModel);

            Assert.AreEqual(expectedSeasonModel.Season, actualSeasonModel.Season);
            Assert.AreEqual(expectedSeasonModel.Title, actualSeasonModel.Title);
        }

        [Then(@"The GameModel should be")]
        public void ThenTheGameModelShouldBe(Table table)
        {
            var expectedGameModel = table.Rows.First().CreateInstance<GameModel>();
            expectedGameModel.Country = table.Rows.First()["Countries"];
            expectedGameModel.Director = table.Rows.First()["Directors"];
            expectedGameModel.Writer = table.Rows.First()["Writers"];
            expectedGameModel.Genre = table.Rows.First()["Genres"];
            expectedGameModel.Language = table.Rows.First()["Languages"];

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualGameModel = result.Value as GameModel;
            Assert.IsNotNull(actualGameModel);

            Assert.IsTrue(AssertMediaModel(expectedGameModel, actualGameModel));

            Assert.AreEqual(expectedGameModel.BoxOffice, actualGameModel.BoxOffice);
            Assert.AreEqual(expectedGameModel.DVD, actualGameModel.DVD);
            Assert.AreEqual(expectedGameModel.Production, actualGameModel.Production);
            Assert.AreEqual(expectedGameModel.Website, actualGameModel.Website);
        }

        [Then(@"The EpisodeModel should be")]
        public void ThenTheEpisodeModelShouldBe(Table table)
        {
            var expectedEpisodeModel = table.Rows.First().CreateInstance<EpisodeModel>();
            expectedEpisodeModel.Country = table.Rows.First()["Countries"];
            expectedEpisodeModel.Director = table.Rows.First()["Directors"];
            expectedEpisodeModel.Writer = table.Rows.First()["Writers"];
            expectedEpisodeModel.Genre = table.Rows.First()["Genres"];
            expectedEpisodeModel.Language = table.Rows.First()["Languages"];

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualEpisodeModel = result.Value as EpisodeModel;
            Assert.IsNotNull(actualEpisodeModel);

            Assert.IsTrue(AssertMediaModel(expectedEpisodeModel, actualEpisodeModel));

            Assert.AreEqual(expectedEpisodeModel.Episode, actualEpisodeModel.Episode);
            Assert.AreEqual(expectedEpisodeModel.Season, actualEpisodeModel.Season);
            Assert.AreEqual(expectedEpisodeModel.SeasonId, actualEpisodeModel.SeasonId);
            Assert.AreEqual(expectedEpisodeModel.SeriesTitle, actualEpisodeModel.SeriesTitle);
        }

        private static bool AssertMediaModel(MediaModel expectedMediaModel, MediaModel actualMediaModel)
        {
            try
            {
                Assert.AreEqual(expectedMediaModel.Id, actualMediaModel.Id);
                Assert.AreEqual(expectedMediaModel.Actors, actualMediaModel.Actors);
                Assert.AreEqual(expectedMediaModel.Awards, actualMediaModel.Awards);
                Assert.AreEqual(expectedMediaModel.Country, actualMediaModel.Country);
                Assert.AreEqual(expectedMediaModel.Director, actualMediaModel.Director);
                Assert.AreEqual(expectedMediaModel.Genre, actualMediaModel.Genre);
                Assert.AreEqual(expectedMediaModel.Language, actualMediaModel.Language);
                Assert.AreEqual(expectedMediaModel.Metascore, actualMediaModel.Metascore);
                Assert.AreEqual(expectedMediaModel.Plot, actualMediaModel.Plot);
                Assert.AreEqual(expectedMediaModel.Poster, actualMediaModel.Poster);
                Assert.AreEqual(expectedMediaModel.Rated, actualMediaModel.Rated);
                Assert.AreEqual(expectedMediaModel.Released, actualMediaModel.Released);
                Assert.AreEqual(expectedMediaModel.Runtime, actualMediaModel.Runtime);
                Assert.AreEqual(expectedMediaModel.Title, actualMediaModel.Title);
                Assert.AreEqual(expectedMediaModel.Type, actualMediaModel.Type);
                Assert.AreEqual(expectedMediaModel.Writer, actualMediaModel.Writer);
                Assert.AreEqual(expectedMediaModel.Year, actualMediaModel.Year);
                Assert.AreEqual(expectedMediaModel.imdbRating, actualMediaModel.imdbRating);
                Assert.AreEqual(expectedMediaModel.imdbVotes, actualMediaModel.imdbVotes);
                Assert.AreEqual(expectedMediaModel.imdbID, actualMediaModel.imdbID);

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
