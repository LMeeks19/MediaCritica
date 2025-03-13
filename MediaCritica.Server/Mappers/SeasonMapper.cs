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
            };
        }

        public SeasonModel MapSeasonModel(Season season)
        {
            var seasonModel = new SeasonModel()
            {
                SeriesId = season.SeriesId,
                Season = season.SeasonNo.ToString(),
                Title = season.Title,
                Episodes = season.Episodes == null ? [] : season.Episodes.Select(episode => _episodeMapper.MapEpisodeSummaryModel(episode!)).ToList()
            };
            return seasonModel;
        }
    }
}
