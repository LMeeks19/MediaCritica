namespace MediaCritica.Server.Mappers
{
    public interface IMapper
    {
        SeasonMapper SeasonMapper { get; }
        SeriesMapper SeriesMapper { get; }
        EpisodeMapper EpisodeMapper { get; }
        GameMapper GameMapper { get; }
        MovieMapper MovieMapper { get; }
        MediaMapper MediaMapper { get; }
        RatingMapper RatingMapper { get; }
        ReviewMapper ReviewMapper { get; }
        BacklogMapper BacklogMapper { get; }

    }
}
