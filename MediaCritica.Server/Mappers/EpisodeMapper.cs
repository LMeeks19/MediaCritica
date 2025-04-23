using AutoMapper;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class EpisodeMapper(MediaMapper mediaMapper)
    {
        private readonly MediaMapper _mediaMapper = mediaMapper;
        public Episode MapEpisode(EpisodeModel episodeModel)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Media, Episode>());
            var mapper = config.CreateMapper();

            Media media = _mediaMapper.MapMedia(episodeModel);
            Episode episode = mapper.Map<Episode>(media);

            episode.EpisodeNo = int.Parse(episodeModel.Episode);
            episode.SeasonNo = int.Parse(episodeModel.Season);
            episode.SeasonId = episodeModel.SeasonId;

            return episode;
        }

        public EpisodeModel MapEpisodeModel(Episode episode, string timezone, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<MediaModel, EpisodeModel>());
            var mapper = config.CreateMapper();

            MediaModel mediaModel = _mediaMapper.MapMediaModel(episode, timezone, dateTimeProviderHelper);
            EpisodeModel episodeModel = mapper.Map<EpisodeModel>(mediaModel);

            episodeModel.Episode = episode.EpisodeNo.ToString();
            episodeModel.Season = episode.SeasonNo.ToString();
            episodeModel.SeasonId = episode.SeasonId;
            episodeModel.SeriesTitle = episode.Season.Title;
            episodeModel.SeriesId = episode.Season.SeriesId;

            return episodeModel;
        }

        public EpisodeSummaryModel MapEpisodeSummaryModel(Episode episode)
        {
            return new EpisodeSummaryModel()
            {
                Id = episode.Id,
                Episode = episode.EpisodeNo.ToString(),
                Title = episode.Title,
                Released = episode.Released != null ? ((DateTime)episode.Released).ToLongDateString() : "N/A",
                imdbRating = episode.ImdbRating.ToString(),
            };
        }
    }
}
