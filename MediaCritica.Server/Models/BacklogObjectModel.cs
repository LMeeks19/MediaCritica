namespace MediaCritica.Server.Models
{
    public class BacklogObjectModel
    {
        public List<BacklogModel> Backlog { get; set; } = [];
        public int TotalBacklogCount { get; set; }

        public List<BacklogModel> InProgress { get; set; } = [];
        public int TotalInProgressCount { get; set; }

        public List<BacklogModel> Finished { get; set; } = [];
        public int TotalFinishedCount { get; set; }

    }
}
