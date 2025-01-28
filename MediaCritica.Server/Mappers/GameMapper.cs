using AutoMapper;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class GameMapper(MediaMapper mediaMapper)
    {
        private readonly MediaMapper _mediaMapper = mediaMapper;

        public Game MapGame(GameModel gameModel)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Media, Game>());
            var mapper = config.CreateMapper();

            Media media = _mediaMapper.MapMedia(gameModel);
            Game game = mapper.Map<Game>(media);

            game.BoxOffice = gameModel.BoxOffice;
            game.DVD = gameModel.DVD;
            game.Production = gameModel.Production;
            game.Website = gameModel.Website;

            return game;
        }

        public GameModel MapGameModel(Game game)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<MediaModel, GameModel>());
            var mapper = config.CreateMapper();

            MediaModel mediaModel = _mediaMapper.MapMediaModel(game);
            GameModel gameModel = mapper.Map<GameModel>(mediaModel);

            gameModel.BoxOffice = game.BoxOffice;
            gameModel.DVD = game.DVD;
            gameModel.Production = game.Production;
            gameModel.Website = game.Website;

            return gameModel;
        }
    }
}
