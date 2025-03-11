using AutoMapper;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class MovieMapper(IMappers mapper)
    {
        private readonly IMappers _mapper = mapper;

        public Movie MapMovie(MovieModel movieModel)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Media, Movie>());
            var mapper = config.CreateMapper();

            Media media = _mapper.MediaMapper.MapMedia(movieModel);
            Movie movie = mapper.Map<Movie>(media);

            movie.BoxOffice = movieModel.BoxOffice;
            movie.DVD = movieModel.DVD;
            movie.Production = movieModel.Production;
            movie.Website = movieModel.Website;

            return movie;
        }

        public MovieModel MapMovieModel(Movie movie)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<MediaModel, MovieModel>());
            var mapper = config.CreateMapper();

            MediaModel mediaModel = _mapper.MediaMapper.MapMediaModel(movie);
            MovieModel movieModel = mapper.Map<MovieModel>(mediaModel);

            movieModel.BoxOffice = movie.BoxOffice;
            movieModel.DVD = movie.DVD;
            movieModel.Production = movie.Production;
            movieModel.Website = movie.Website;

            return movieModel;
        }
    }
}
