using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStaticUserFieldsOnTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorUsername",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "CommenterName",
                table: "Comments");

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Notifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AuthorId",
                table: "Notifications",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_AuthorId",
                table: "Notifications",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_AuthorId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AuthorId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Notifications");

            migrationBuilder.AddColumn<string>(
                name: "AuthorUsername",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CommenterName",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
