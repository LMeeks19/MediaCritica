using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class SeasonMapper(EpisodeMapper episodeMapper)
    {
        private readonly EpisodeMapper _episodeMapper = episodeMapper;

        public Season MapSeason(SeasonModel seasonModel, string seriesId)
        {
            return new Season()
            {
                SeriesId = seriesId,
                SeasonNo = int.Parse(seasonModel.Season),
                Title = seasonModel.Title,
                Episodes = seasonModel.Episodes.Select(episode => new Episode()
                {
                    Id = episode.imdbID,
                    EpisodeNo = int.Parse(episode.Episode),
                    SeasonNo = int.Parse(seasonModel.Season),
                    Released = episode.Released == "N/A" ? null : DateTime.Parse(episode.Released),
                    Title = episode.Title,
                    ImdbRating = episode.imdbRating == "N/A" ? null : double.Parse(episode.imdbRating),
                    Type = MediaType.Episode,
                }).ToList()
            };
        }

        public SeasonModel MapSeasonModel(Season season)
        {
            var seasonModel = new SeasonModel()
            {
                Season = season.SeasonNo.ToString(),
                Title = season.Title,
                Episodes = season.Episodes == null ? [] : season.Episodes.Select(episode => _episodeMapper.MapEpisodeSummaryModel(episode!)).ToList()
            };
            return seasonModel;
        }
    }
}
