using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Objects
{
    public class Comment
    {
        public int Id { get; set; }
        public int ReviewId { get; set; }
        public int? ParentId { get; set; }
        public string Content { get; set; }
        public int CommenterId { get; set; }
        public DateTime CommentedAt { get; set; }
        public ContentStatus Status { get; set; } = ContentStatus.Active;


        public virtual Review Review { get; set; }
        public virtual Comment Parent { get; set; }
        public virtual User Commenter { get; set; }
        public virtual List<Comment> Replies { get; set; }
        public virtual List<Report> Reports { get; set; }
    }
}
