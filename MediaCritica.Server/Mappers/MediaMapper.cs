using MediaCritica.Server.Models;
using MediaCritica.Server.Models.Media_Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class MediaMapper(RatingMapper ratingMapper, ReviewMapper reviewMapper)
    {
        private readonly RatingMapper _ratingMapper = ratingMapper;
        private readonly ReviewMapper _reviewMapper = reviewMapper;

        public Media MapMedia(MediaModel mediaModel)
        {
            var media = new Media()
            {
                Id = mediaModel.imdbID,
                Actors = mediaModel.Actors,
                Awards = mediaModel.Awards,
                Countries = mediaModel.Country,
                Directors = mediaModel.Director,
                Genres = mediaModel.Genre,
                ImdbRating = mediaModel.imdbRating != "N/A" ? double.Parse(mediaModel.imdbRating) : null,
                ImdbVotes = mediaModel.imdbVotes != "N/A" ? int.Parse(mediaModel.imdbVotes.Replace(",", "")) : null,
                Languages = mediaModel.Language,
                Metascore = mediaModel.Metascore != "N/A" ? int.Parse(mediaModel.Metascore) : null,
                Plot = mediaModel.Plot,
                Poster = mediaModel.Poster,
                Rated = mediaModel.Rated,
                Ratings = mediaModel.Ratings != null ? mediaModel.Ratings.Select(_ratingMapper.MapRating).ToList() : [],
                Released = mediaModel.Released == "N/A" ? null : DateTime.Parse(mediaModel.Released),
                Runtime = mediaModel.Runtime,
                Title = mediaModel.Title,
                Type = mediaModel.Type,
                Writers = mediaModel.Writer,
                Year = mediaModel.Year,
            };

            return media;
        }

        public MediaModel MapMediaModel(Media media)
        {
            var mediaModel = new MediaModel()
            {
                Id = media.Id,
                Actors = media.Actors,
                Awards = media.Awards,
                Country = media.Countries,
                Director = media.Directors,
                Genre = media.Genres,
                imdbRating = media.ImdbRating.ToString(),
                imdbVotes = media.ImdbVotes.ToString(),
                Language = media.Languages,
                Metascore = media.Metascore.ToString(),
                Plot = media.Plot,
                Poster = media.Poster,
                Rated = media.Rated,
                Ratings = media.Ratings.Select(_ratingMapper.MapRatingModel).ToList(),
                Released = media.Released != null ? ((DateTime)media.Released).ToLongDateString() : "N/A",
                Runtime = media.Runtime,
                Title = media.Title,
                Type = media.Type,
                Writer = media.Writers,
                Year = media.Year,
                Reviews = media.Reviews
                    .OrderByDescending(review => review.Date)
                    .Take(10)
                    .Select(_reviewMapper.MapReviewSummaryModel)
                    .ToList(),
            };

            return mediaModel;
        }

        public MediaSummaryModel MapMediaSummaryModel(Media media)
        {
            var mediaSummaryModel = new MediaSummaryModel()
            {
                Id = media.Id,
                Title = media.Title,
                Type = media.Type,
                Poster = media.Poster,
                Genre = media.Genres,
                Released = media.Released,
                ImdbRating = media.ImdbRating,
            };

            return mediaSummaryModel;
        }
    }
}
