using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReviewerName",
                table: "Reviews",
                newName: "ReviewerUsername");

            migrationBuilder.RenameColumn(
                name: "AuthorName",
                table: "Notifications",
                newName: "AuthorUsername");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuthorUsername",
                table: "Notifications",
                newName: "AuthorName");

            migrationBuilder.RenameColumn(
                name: "ReviewerUsername",
                table: "Reviews",
                newName: "ReviewerName");
        }
    }
}
