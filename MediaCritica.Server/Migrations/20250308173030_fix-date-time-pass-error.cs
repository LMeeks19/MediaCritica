using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixdatetimepasserror : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFullyPopulated",
                table: "Media");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Released",
                table: "Media",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "Released",
                table: "Media",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFullyPopulated",
                table: "Media",
                type: "bit",
                nullable: true);
        }
    }
}
