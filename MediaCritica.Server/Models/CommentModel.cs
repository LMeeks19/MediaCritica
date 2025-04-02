namespace MediaCritica.Server.Models
{
    public class CommentModel
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int ReviewId { get; set; }
        public string? Content { get; set; }
        public int? CommenterId { get; set; }
        public string? CommenterName { get; set; }
        public DateTime? CommentedAt { get; set; }
        public List<CommentModel> Replies { get; set; } = [];
        public int TotalReplies { get; set; }
        public bool IsDeleted { get; set; }
    }
}
