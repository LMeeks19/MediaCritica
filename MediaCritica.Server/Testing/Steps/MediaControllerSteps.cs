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
        // TODO

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

        [When(@"I call GetSeason with id (\d+)")]
        public async Task WhenICallGetSeasonWithId(string seriesId)
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
            Assert.AreEqual(expectedMediaSearchResultResponse.TotalResults, int.Parse(actualMediaSearchResultResponse.TotalResults));
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
                Assert.AreEqual(expectedMediaSummaryModel.Released, actualMediaSummaryModel.Released);
                Assert.AreEqual(expectedMediaSummaryModel.ImdbRating, actualMediaSummaryModel.ImdbRating);
            }
        }

        [Then(@"The MovieModel should be")]
        public void ThenTheMovieModelShouldBe(Table table)
        {
            throw new Exception("Method not implemented");
        }

        [Then(@"The SeriesModel should be")]
        public void ThenTheSeriesModelShouldBe(Table table)
        {
            throw new Exception("Method not implemented");
        }

        [Then(@"The SeasonModel should be")]
        public void ThenTheSeasonModelShouldBe(Table table)
        {
            throw new Exception("Method not implemented");
        }

        [Then(@"The GameModel should be")]
        public void ThenTheGameModelShouldBe(Table table)
        {
            throw new Exception("Method not implemented");
        }

        [Then(@"The EpisodeModel should be")]
        public void ThenTheEpisodeModelShouldBe(Table table)
        {
            throw new Exception("Method not implemented");
        }
    }
}
