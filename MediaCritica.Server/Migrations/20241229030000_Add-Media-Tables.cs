using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaEpisode",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "MediaParentId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "MediaParentTitle",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "MediaSeason",
                table: "Reviews");

            migrationBuilder.AlterColumn<string>(
                name: "MediaId",
                table: "Reviews",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Media",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Actors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Awards = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Countries = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Directors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Genres = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Languages = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Metascore = table.Column<int>(type: "int", nullable: true),
                    Plot = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Poster = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rated = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Released = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Runtime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Writers = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Year = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImdbRating = table.Column<double>(type: "float", nullable: true),
                    ImdbVotes = table.Column<int>(type: "int", nullable: true),
                    Discriminator = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    EpisodeNo = table.Column<int>(type: "int", nullable: true),
                    SeasonNo = table.Column<int>(type: "int", nullable: true),
                    SeasonId = table.Column<int>(type: "int", nullable: true),
                    BoxOffice = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DVD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Production = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalSeasons = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Media", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MediaId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Source = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ratings_Media_MediaId",
                        column: x => x.MediaId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SeriesId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SeasonNo = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seasons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Seasons_Media_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_MediaId",
                table: "Reviews",
                column: "MediaId");

            migrationBuilder.CreateIndex(
                name: "IX_Media_SeasonId",
                table: "Media",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_MediaId",
                table: "Ratings",
                column: "MediaId");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_SeriesId",
                table: "Seasons",
                column: "SeriesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Media_MediaId",
                table: "Reviews",
                column: "MediaId",
                principalTable: "Media",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Media_Seasons_SeasonId",
                table: "Media",
                column: "SeasonId",
                principalTable: "Seasons",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Media_MediaId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Media_Seasons_SeasonId",
                table: "Media");

            migrationBuilder.DropTable(
                name: "Ratings");

            migrationBuilder.DropTable(
                name: "Seasons");

            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_MediaId",
                table: "Reviews");

            migrationBuilder.AlterColumn<string>(
                name: "MediaId",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "MediaEpisode",
                table: "Reviews",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MediaParentId",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MediaParentTitle",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MediaSeason",
                table: "Reviews",
                type: "int",
                nullable: true);
        }
    }
}
