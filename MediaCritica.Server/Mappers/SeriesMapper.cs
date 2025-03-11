using AutoMapper;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class SeriesMapper(IMappers mapper)
    {
        private readonly IMappers _mapper = mapper;

        public Series MapSeries(SeriesModel seriesModel)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Media, Series>());
            var mapper = config.CreateMapper();

            Media media = _mapper.MediaMapper.MapMedia(seriesModel);
            Series series = mapper.Map<Series>(media);

            series.TotalSeasons = int.Parse(seriesModel.totalSeasons);
            series.Seasons = seriesModel.Seasons.Select(season => _mapper.SeasonMapper.MapSeason(season, series.Id)).ToList();

            return series;
        }

        public SeriesModel MapSeriesModel(Series series)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<MediaModel, SeriesModel>());
            var mapper = config.CreateMapper();

            MediaModel mediaModel = _mapper.MediaMapper.MapMediaModel(series);
            SeriesModel seriesModel = mapper.Map<SeriesModel>(mediaModel);

            seriesModel.totalSeasons = series.TotalSeasons.ToString();
            seriesModel.Seasons = series.Seasons.Select(_mapper.SeasonMapper.MapSeasonModel).ToList();

            return seriesModel;
        }
    }
}
