using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class BacklogControllerSteps
    {
        [When(@"I call GetBacklog")]
        public async Task WhenICallGetBacklog()
        {
            GlobalSteps._response = await GlobalSteps._controller.BacklogController.GetBacklog();
        }

        [When(@"I call Get(Backlogged|InProgress|Finished)Backlog")]
        public async Task WhenICallGetTypeBacklog(string type)
        {
            GlobalSteps._response = await (type == "Backlogged" ?
                GlobalSteps._controller.BacklogController.GetBackloggedBacklog() : type == "InProgress" ?
                GlobalSteps._controller.BacklogController.GetInProgressBacklog() :
                GlobalSteps._controller.BacklogController.GetFinishedBacklog());
        }

        [When(@"I call PostBacklog with the backlog model")]
        public async Task WhenICallPostBacklogWithTheBacklogModel(Table table)
        {
            var backlogModel = table.CreateSet<BacklogModel>().First();
            GlobalSteps._response = await GlobalSteps._controller.BacklogController.PostBacklog(backlogModel);
        }

        [When(@"I call DeleteBacklog with the media id (.*)")]
        public async Task WhenICallDeleteBacklogWithTheMediaId(string mediaId)
        {
            GlobalSteps._response = await GlobalSteps._controller.BacklogController.DeleteBacklog(mediaId);
        }

        [When(@"I call UpdateBacklogState with the id (\d+) and new state (Backlog|InProgress|Finished)")]
        public async Task WhenICallUpdateBacklogWithTheIdAndNewState(int backlogId, BacklogCategoryType newState)
        {
            GlobalSteps._response = await GlobalSteps._controller.BacklogController.UpdateBacklogState(backlogId, newState);
        }

        [When(@"I call GetUserBacklogStatus with the media id (.*)")]
        public async Task WhenICallGetUserBacklogStatusWithTheMediaId(string mediaId)
        {
            GlobalSteps._response = await GlobalSteps._controller.BacklogController.GetUserBacklogStatus(mediaId);
        }

        [Then(@"The BacklokObjectModel should be")]
        public void ThenTheBacklogObjectModelShouldBe(Table table)
        {
            var row = table.Rows.First();
            var expectedBacklogObjectModel = new
            {
                BacklogCount = int.Parse(row["Backlog"]),
                TotalBacklogCount = int.Parse(row["TotalBacklogCount"]),
                InProgressCount = int.Parse(row["InProgress"]),
                TotalInProgressCount = int.Parse(row["TotalInProgressCount"]),
                FinishedCount = int.Parse(row["Finished"]),
                TotalFinishedCount = int.Parse(row["TotalFinishedCount"])
            };
            Assert.IsNotNull(expectedBacklogObjectModel);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualBacklogObjectModel = result.Value as BacklogObjectModel;
            Assert.IsNotNull(actualBacklogObjectModel);

            Assert.AreEqual(expectedBacklogObjectModel.BacklogCount, actualBacklogObjectModel.Backlog.Count);
            Assert.AreEqual(expectedBacklogObjectModel.TotalBacklogCount, actualBacklogObjectModel.TotalBacklogCount);
            Assert.AreEqual(expectedBacklogObjectModel.InProgressCount, actualBacklogObjectModel.InProgress.Count);
            Assert.AreEqual(expectedBacklogObjectModel.TotalInProgressCount, actualBacklogObjectModel.TotalInProgressCount);
            Assert.AreEqual(expectedBacklogObjectModel.FinishedCount, actualBacklogObjectModel.Finished.Count);
            Assert.AreEqual(expectedBacklogObjectModel.TotalFinishedCount, actualBacklogObjectModel.TotalFinishedCount);
        }

        [Then(@"The (Backlogged|InProgress|Finished) backlogs should be")]
        public void ThenTheBacklogsShouldBe(string type, Table table)
        {
            var expectedBacklogs = table.CreateSet<BacklogModel>().ToList();

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            List<BacklogModel>? actualBacklogModels;
            if (result.Value is BacklogObjectModel backlogObjectModel)
                actualBacklogModels = type == "Backlogged" ? backlogObjectModel.Backlog : type == "InProgress" ? backlogObjectModel.InProgress : backlogObjectModel.Finished;
            else
                actualBacklogModels = result.Value as List<BacklogModel>;

            Assert.AreEqual(expectedBacklogs.Count, actualBacklogModels.Count);

            for (var i = 0; i < expectedBacklogs.Count; i++)
            {
                var expectedBacklogModel = expectedBacklogs[i];
                var actualBacklogModel = actualBacklogModels[i];

                Assert.AreEqual(expectedBacklogModel.Id, actualBacklogModel.Id);
                Assert.AreEqual(expectedBacklogModel.UserId, actualBacklogModel.UserId);
                Assert.AreEqual(expectedBacklogModel.MediaId, actualBacklogModel.MediaId);
                Assert.AreEqual(expectedBacklogModel.MediaType, actualBacklogModel.MediaType);
                Assert.AreEqual(expectedBacklogModel.MediaPoster, actualBacklogModel.MediaPoster);
                Assert.AreEqual(expectedBacklogModel.MediaTitle, actualBacklogModel.MediaTitle);
                Assert.AreEqual(expectedBacklogModel.Category, actualBacklogModel.Category);
                Assert.AreEqual(expectedBacklogModel.AddedDate, actualBacklogModel.AddedDate);
            }
        }
    }
}