using AutoMapper;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class SeriesMapper(MediaMapper mediaMapper, SeasonMapper seasonMapper)
    {
        private readonly MediaMapper _mediaMapper = mediaMapper;
        private readonly SeasonMapper _seasonMapper = seasonMapper;

        public Series MapSeries(SeriesModel seriesModel)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Media, Series>());
            var mapper = config.CreateMapper();

            Media media = _mediaMapper.MapMedia(seriesModel);
            Series series = mapper.Map<Series>(media);

            series.TotalSeasons = int.Parse(seriesModel.totalSeasons);
            series.Seasons = seriesModel.Seasons.Select(season => _seasonMapper.MapSeason(season, series.Id)).ToList();

            return series;
        }

        public SeriesModel MapSeriesModel(Series series)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<MediaModel, SeriesModel>());
            var mapper = config.CreateMapper();

            MediaModel mediaModel = _mediaMapper.MapMediaModel(series);
            SeriesModel seriesModel = mapper.Map<SeriesModel>(mediaModel);

            seriesModel.totalSeasons = series.TotalSeasons.ToString();
            seriesModel.Seasons = series.Seasons.Select(_seasonMapper.MapSeasonModel).ToList();

            return seriesModel;
        }
    }
}
