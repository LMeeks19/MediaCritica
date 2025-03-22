namespace MediaCritica.Server.Objects
{
    public class Comment
    {
        public int Id { get; set; }
        public int ReviewId { get; set; }
        public int? ParentId { get; set; }
        public string Message { get; set; }
        public int? CommenterId { get; set; }
        public string CommenterName { get; set; }
        public DateTime CommentedAt { get; set; }
        public bool IsDeleted { get; set; }

        public virtual Review Review { get; set; }
        public virtual Comment Parent { get; set; }
        public virtual User Commenter { get; set; }
        public virtual List<Comment> Children { get; set; }

    }
}
