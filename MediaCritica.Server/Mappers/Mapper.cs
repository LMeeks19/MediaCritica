namespace MediaCritica.Server.Mappers
{
    public class Mapper(UserMapper usermapper, SeasonMapper seasonMapper, SeriesMapper seriesMapper, EpisodeMapper episodeMapper, GameMapper gameMapper, MovieMapper movieMapper, MediaMapper mediaMapper, RatingMapper ratingMapper, ReviewMapper reviewMapper, BacklogMapper backlogMapper) : IMapper
    {
        public UserMapper UserMapper { get; set; } = usermapper;
        public SeasonMapper SeasonMapper { get; } = seasonMapper;
        public SeriesMapper SeriesMapper { get; } = seriesMapper;
        public EpisodeMapper EpisodeMapper { get; } = episodeMapper;
        public GameMapper GameMapper { get; } = gameMapper;
        public MovieMapper MovieMapper { get; } = movieMapper;
        public MediaMapper MediaMapper { get; } = mediaMapper;
        public RatingMapper RatingMapper { get; } = ratingMapper;
        public ReviewMapper ReviewMapper { get; } = reviewMapper;
        public BacklogMapper BacklogMapper { get; } = backlogMapper;
    }
}
