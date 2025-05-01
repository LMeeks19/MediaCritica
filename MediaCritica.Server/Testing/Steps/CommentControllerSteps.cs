using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class CommentControllerSteps
    {
        [When(@"I call GetReviewComments with the review id (\d+)")]
        public async void WhenICallGetReviewCommentsWithTheReviewId(int reviewId)
        {
            GlobalSteps._response = await GlobalSteps._controller.CommentController.GetReviewComments(reviewId);
        }

        [When(@"I call GetCommentsRemainingChildren with the comment id (\d+) and offset (\d+)")]
        public async void WhenICallGetCommentsRemainingChildrenWithTheCommentIdAndOffset(int commentId, int offset)
        {
            GlobalSteps._response = await GlobalSteps._controller.CommentController.GetCommentsRemainingChildren(commentId, offset);
        }

        [When(@"I call PostComment with the following data")]
        public async void WhenICallPostCommentWithTheFollowingData(Table table)
        {
            var commentModel = table.Rows[0].CreateInstance<CommentModel>();
            GlobalSteps._response = await GlobalSteps._controller.CommentController.PostComment(commentModel);
        }

        [When(@"I call UpdateComment with the following data")]
        public async void WhenICallUpdateCommentWithTheFollowingData(Table table)
        {
            var updateCommentMocel = table.Rows[0].CreateInstance<UpdateCommentModel>();
            GlobalSteps._response = await GlobalSteps._controller.CommentController.UpdateComment(updateCommentMocel);
        }

        [When(@"I call DeleteComment with the comment id (\d+)")]
        public async void WhenICallDeleteCommentWithTheCommentId(int commentId)
        {
            GlobalSteps._response = await GlobalSteps._controller.CommentController.DeleteComment(commentId);
        }

        [When(@"I call ReportComment with the following data")]
        public async void WhenICallReportCommentWithTheFollowingData(Table table)
        {
            var reportModel = table.Rows[0].CreateInstance<ReportModel>();
            GlobalSteps._response = await GlobalSteps._controller.CommentController.ReportComment(reportModel);
        }

        [Then(@"The CommentModel should be")]
        public void ThenTheCommentModelShouldBe(Table table)
        {
            var expectedCommentModel = table.Rows[0].CreateInstance<CommentModel>();
            var actualCommentModel = (CommentModel)((OkObjectResult)GlobalSteps._response).Value;

            Assert.AreEqual(expectedCommentModel.Id, actualCommentModel.Id);
            Assert.AreEqual(expectedCommentModel.ParentId, actualCommentModel.ParentId);
            Assert.AreEqual(expectedCommentModel.ReviewId, actualCommentModel.ReviewId);
            Assert.AreEqual(expectedCommentModel.Content, actualCommentModel.Content);
            Assert.AreEqual(expectedCommentModel.CommenterId, actualCommentModel.CommenterId);
            Assert.AreEqual(expectedCommentModel.CommenterUsername, actualCommentModel.CommenterUsername);
            Assert.AreEqual(expectedCommentModel.CommentedAt, actualCommentModel.CommentedAt);
            Assert.AreEqual(expectedCommentModel.IsDeleted, actualCommentModel.IsDeleted);
            Assert.AreEqual(expectedCommentModel.TotalReplies, actualCommentModel.TotalReplies);

        }

        [Then(@"The CommentModels should be")]
        public void ThenTheCommentModelsShouldBe(Table table)
        {
            var expectedCommentModels = table.CreateSet<CommentModel>();
            var actualCommentModels = (List<CommentModel>)((OkObjectResult)GlobalSteps._response).Value;

            Assert.AreEqual(expectedCommentModels.Count(), actualCommentModels.Count);

            for (int i = 0; i < expectedCommentModels.Count(); i++)
            {
                var expectedCommentModel = expectedCommentModels.ElementAt(i);
                var actualCommentModel = actualCommentModels.ElementAt(i);

                Assert.AreEqual(expectedCommentModel.Id, actualCommentModel.Id);
                Assert.AreEqual(expectedCommentModel.ParentId, actualCommentModel.ParentId);
                Assert.AreEqual(expectedCommentModel.ReviewId, actualCommentModel.ReviewId);
                Assert.AreEqual(expectedCommentModel.Content, actualCommentModel.Content);
                Assert.AreEqual(expectedCommentModel.CommenterId, actualCommentModel.CommenterId);
                Assert.AreEqual(expectedCommentModel.CommenterUsername, actualCommentModel.CommenterUsername);
                Assert.AreEqual(expectedCommentModel.CommentedAt, actualCommentModel.CommentedAt);
                Assert.AreEqual(expectedCommentModel.IsDeleted, actualCommentModel.IsDeleted);
                Assert.AreEqual(expectedCommentModel.TotalReplies, actualCommentModel.TotalReplies);
            }
        }

        [Then(@"The children should be empty")]
        public void ThenTheChildrenShouldBeEmpty()
        {
            try
            {
                var actualCommentModel = (CommentModel)((OkObjectResult)GlobalSteps._response).Value;
                Assert.IsEmpty(actualCommentModel.Replies);
            }
            catch
            {
                var actualCommentModels = (List<CommentModel>)((OkObjectResult)GlobalSteps._response).Value;
                foreach (var actualCommentModel in actualCommentModels)
                {
                    Assert.IsEmpty(actualCommentModel.Replies);
                }
            }
        }

        [Then(@"The returned comments structure should match the expected hierarchy:")]
        public void ThenTheReturnedCommentsStructureShouldMatchTheExpectedHierarchy(Table table)
        {
            var expectedCommentModels = ParseExpectedCommentsFromTable(table);

            var actualCommentModels = (List<CommentModel>)((OkObjectResult)GlobalSteps._response).Value;

            ValidateCommentHierarchy(actualCommentModels, expectedCommentModels);
        }

        private static List<CommentModel> ParseExpectedCommentsFromTable(Table table)
        {
            var tableComments = table.Rows.Select(row => new CommentModel
            {
                Id = int.Parse(row["Id"]),
                ReviewId = int.Parse(row["ReviewId"]),
                ParentId = row["ParentId"] == "<null>" ? null : int.Parse(row["ParentId"]),
                Content = row["Content"],
                CommenterId = int.Parse(row["CommenterId"]),
                CommenterUsername = row["CommenterName"],
                CommentedAt = row["CommentedAt"],
                IsDeleted = bool.Parse(row["IsDeleted"]),
                Replies = [],
                TotalReplies = int.Parse(row["TotalReplies"])
            }).ToList();

            foreach (var comment in tableComments)
                comment.Replies = [.. tableComments.Where(c => c.ParentId == comment.Id)];

            return [.. tableComments.Where(c => c.ParentId == null)];
        }

        private static void ValidateCommentHierarchy(List<CommentModel> actual, List<CommentModel> expected)
        {
            Assert.AreEqual(expected.Count, actual.Count);

            for (int i = 0; i < expected.Count; i++)
            {
                var expectedComment = expected[i];
                var actualComment = actual[i];

                Assert.AreEqual(expectedComment.Id, actualComment.Id);
                Assert.AreEqual(expectedComment.ReviewId, actualComment.ReviewId);
                Assert.AreEqual(expectedComment.ParentId, actualComment.ParentId);
                Assert.AreEqual(expectedComment.Content, actualComment.Content);
                Assert.AreEqual(expectedComment.IsDeleted, actualComment.IsDeleted);

                // Recursively validate replies
                ValidateCommentHierarchy(actualComment.Replies, expectedComment.Replies);
            }
        }

    }
}
