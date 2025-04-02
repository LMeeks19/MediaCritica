namespace MediaCritica.Server.Mappers
{
    public class Mappers(UserMapper usermapper, SeasonMapper seasonMapper, SeriesMapper seriesMapper, EpisodeMapper episodeMapper, GameMapper gameMapper, MovieMapper movieMapper, MediaMapper mediaMapper, RatingMapper ratingMapper, ReviewMapper reviewMapper, BacklogMapper backlogMapper, CommentMapper commentMapper) : IMappers
    {
        public UserMapper UserMapper { get; set; } = usermapper;
        public SeasonMapper SeasonMapper { get; set; } = seasonMapper;
        public SeriesMapper SeriesMapper { get; set; } = seriesMapper;
        public EpisodeMapper EpisodeMapper { get; set; } = episodeMapper;
        public GameMapper GameMapper { get; set; } = gameMapper;
        public MovieMapper MovieMapper { get; set; } = movieMapper;
        public MediaMapper MediaMapper { get; set; } = mediaMapper;
        public RatingMapper RatingMapper { get; set; } = ratingMapper;
        public ReviewMapper ReviewMapper { get; set; } = reviewMapper;
        public BacklogMapper BacklogMapper { get; set; } = backlogMapper;
        public CommentMapper CommentMapper { get; set; } = commentMapper;
    }
}
