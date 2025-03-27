using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class ReviewControllerSteps
    {
        [When(@"I call GetReview with id (\d+)")]
        public async void WhenICallGetReviewWithId(int id)
        {
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.GetReview(id);
        }

        [When(@"I call GetUserReviews with the user id (\d+)")]
        public async void WhenICallGetUserReviewsWithUserId(int userId)
        {
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.GetUserReviews(userId, 0);
        }

        [When(@"I call GetMediaReviews with the media id (.*)")]
        public async void WhenICallGetMediaReviewsWithMediaId(string mediaId)
        {
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.GetMediaReviews(mediaId, 0, 10);
        }

        [When(@"I call PostReview with the following data")]
        public async void WhenICallPostReviewWithTheFollowingData(Table table)
        {
            var review = table.Rows[0].CreateInstance<ReviewModel>();
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.PostReview(review);
        }

        [When(@"I call UpdateReview with the following data")]
        public async void WhenICallUpdateReviewWithTheFollowingData(Table table)
        {
            var updatedDetails = table.Rows[0].CreateInstance<UpdateReviewModel>();
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.UpdateReview(updatedDetails);
        }

        [When(@"I call delete review with id (\d+)")]
        public async void WhenICallDeleteReviewWithId(int id)
        {
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.DeleteReview(id);
        }

        [When(@"I call GetUserReviewStatus with media id (.*) and user id (\d+)")]
        public async void WhenICallGetUserReviewStatusWithMediaIdAndUserId(string mediaId, int userId)
        {
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.GetUserReviewStatus(mediaId, userId);
        }

        [When(@"I call ReportReview with the following data")]
        public async void WhenICallReportReviewWithTheFollowingData(Table table)
        {
            var reportModel = table.Rows[0].CreateInstance<ReportModel>();
            GlobalSteps._response = await GlobalSteps._controller.ReviewController.ReportReview(reportModel);
        }

        [Then(@"The ReviewModel should be")]
        public void ThenTheReviewModelShouldBe(Table table)
        {
            var expectedReviewModel = table.Rows.First().CreateInstance<ReviewModel>();
            expectedReviewModel.MediaSeriesId = expectedReviewModel.MediaSeriesId == "<null>" ? null : expectedReviewModel.MediaSeriesId;
            expectedReviewModel.MediaSeriesTitle = expectedReviewModel.MediaSeriesTitle == "<null>" ? null : expectedReviewModel.MediaSeriesTitle;
            expectedReviewModel.MediaEpisode = expectedReviewModel.MediaEpisode == "<null>" ? null : expectedReviewModel.MediaEpisode;
            Assert.IsNotNull(expectedReviewModel);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualReviewModel = result.Value as ReviewModel;
            Assert.IsNotNull(actualReviewModel);

            Assert.AreEqual(expectedReviewModel.Id, actualReviewModel!.Id);
            Assert.AreEqual(expectedReviewModel.Title, actualReviewModel!.Title);
            Assert.AreEqual(expectedReviewModel.Description, actualReviewModel!.Description);
            Assert.AreEqual(expectedReviewModel.Rating, actualReviewModel!.Rating);
            Assert.AreEqual(expectedReviewModel.Date, actualReviewModel!.Date);
            Assert.AreEqual(expectedReviewModel.Likes, actualReviewModel!.Likes);
            Assert.AreEqual(expectedReviewModel.Dislikes, actualReviewModel!.Dislikes);
            Assert.AreEqual(expectedReviewModel.ReviewerId, actualReviewModel!.ReviewerId);
            Assert.AreEqual(expectedReviewModel.ReviewerName, actualReviewModel!.ReviewerName);
            Assert.AreEqual(expectedReviewModel.MediaId, actualReviewModel!.MediaId);
            Assert.AreEqual(expectedReviewModel.MediaTitle, actualReviewModel!.MediaTitle);
            Assert.AreEqual(expectedReviewModel.MediaType, actualReviewModel!.MediaType);
            Assert.AreEqual(expectedReviewModel.MediaPoster, actualReviewModel!.MediaPoster);
            Assert.AreEqual(expectedReviewModel.MediaSeriesId, actualReviewModel!.MediaSeriesId);
            Assert.AreEqual(expectedReviewModel.MediaSeriesTitle, actualReviewModel!.MediaSeriesTitle);
            Assert.AreEqual(expectedReviewModel.MediaEpisode, actualReviewModel!.MediaEpisode);
        }

        [Then(@"The response should be (\d+)")]
        public void ThenTheResponseShouldBe(int expectedId)
        {
            var result = (OkObjectResult)GlobalSteps._response;
            Assert.AreEqual(new { Id = expectedId }, result.Value);
        }
    }
}
