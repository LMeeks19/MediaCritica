﻿namespace MediaCritica.Server.Models
{
    public class UpdateReviewModel
    {
        public int ReviewId { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        public DateTime Date { get; set; }
    }
}
