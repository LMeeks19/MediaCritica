﻿namespace MediaCritica.Server.Models
{
    public class ReviewModel
    {
        public required string MediaId { get; set; }
        public required string MediaPoster { get; set; }
        public required string MediaTitle { get; set; }
        public required string MediaType { get; set; }
        public int? MediaSeason { get; set; }
        public int? MediaEpisode { get; set; }
        public string? MediaParentId { get; set; }
        public string? MediaParentTitle { get; set; }
        public required int ReviewerId { get; set; }
        public required double Rating { get; set; }
        public required string Description { get; set; }
    }
}