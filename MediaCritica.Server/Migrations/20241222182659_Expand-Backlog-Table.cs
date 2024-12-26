using MediaCritica.Server.Enums;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    /// <inheritdoc />
    public partial class ExpandBacklogTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AddedDate",
                table: "Backlogs",
                type: "datetime2",
                nullable: false,
                defaultValue: DateTime.UtcNow);

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "Backlogs",
                type: "int",
                nullable: false,
                defaultValue: BacklogCategoryType.Backlog);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedDate",
                table: "Backlogs");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Backlogs");
        }
    }
}
