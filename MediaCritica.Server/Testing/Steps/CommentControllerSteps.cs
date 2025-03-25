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
            Assert.AreEqual(expectedCommentModel.CommenterName, actualCommentModel.CommenterName);
            Assert.AreEqual(expectedCommentModel.CommentedAt, actualCommentModel.CommentedAt);
            Assert.AreEqual(expectedCommentModel.IsDeleted, actualCommentModel.IsDeleted);
            Assert.AreEqual(expectedCommentModel.TotalChildren, actualCommentModel.TotalChildren);

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
                Assert.AreEqual(expectedCommentModel.CommenterName, actualCommentModel.CommenterName);
                Assert.AreEqual(expectedCommentModel.CommentedAt, actualCommentModel.CommentedAt);
                Assert.AreEqual(expectedCommentModel.IsDeleted, actualCommentModel.IsDeleted);
                Assert.AreEqual(expectedCommentModel.TotalChildren, actualCommentModel.TotalChildren);
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
    }
}
