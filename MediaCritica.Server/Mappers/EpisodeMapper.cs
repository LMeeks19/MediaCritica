using AutoMapper;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class EpisodeMapper(MediaMapper mediaMapper, ReviewMapper reviewMapper)
    {
        private readonly MediaMapper _mediaMapper = mediaMapper;
        private readonly ReviewMapper _reviewMapper = reviewMapper;

        public Episode MapEpisode(EpisodeModel episodeModel)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Media, Episode>());
            var mapper = config.CreateMapper();

            Media media = _mediaMapper.MapMedia(episodeModel);
            Episode episode = mapper.Map<Episode>(media);

            episode.EpisodeNo = int.Parse(episodeModel.Episode);
            episode.SeasonNo = int.Parse(episodeModel.Season);
            episode.SeasonId = episodeModel.SeasonId;
            episode.IsFullyPopulated = true;

            return episode;
        }

        public EpisodeModel MapEpisodeModel(Episode episode)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<MediaModel, EpisodeModel>());
            var mapper = config.CreateMapper();

            MediaModel mediaModel = _mediaMapper.MapMediaModel(episode);
            EpisodeModel episodeModel = mapper.Map<EpisodeModel>(mediaModel);

            episodeModel.Episode = episode.EpisodeNo.ToString();
            episodeModel.Season = episode.SeasonNo.ToString();
            episodeModel.SeasonId = episode.SeasonId;
            episodeModel.Reviews = episode.Reviews!.Select(_reviewMapper.MapReviewSummaryModel).ToList();

            return episodeModel;
        }

        public EpisodeSummaryModel MapEpisodeSummaryModel(Episode episode)
        {
            return new EpisodeSummaryModel()
            {
                Id = episode.Id,
                Episode = episode.EpisodeNo.ToString(),
                Title = episode.Title,
                Released = episode.Released.ToLongDateString(),
                imdbRating = episode.ImdbRating.ToString(),
            };
        }
    }
}
