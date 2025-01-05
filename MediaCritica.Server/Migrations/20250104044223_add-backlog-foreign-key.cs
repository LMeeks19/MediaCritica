using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    /// <inheritdoc />
    public partial class addbacklogforeignkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MediaId",
                table: "Backlogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Backlogs_MediaId",
                table: "Backlogs",
                column: "MediaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Backlogs_Media_MediaId",
                table: "Backlogs",
                column: "MediaId",
                principalTable: "Media",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Backlogs_Media_MediaId",
                table: "Backlogs");

            migrationBuilder.DropIndex(
                name: "IX_Backlogs_MediaId",
                table: "Backlogs");

            migrationBuilder.AlterColumn<string>(
                name: "MediaId",
                table: "Backlogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
