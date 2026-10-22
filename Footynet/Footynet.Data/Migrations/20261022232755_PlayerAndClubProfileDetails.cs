using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footynet.Data.Migrations
{
    /// <inheritdoc />
    public partial class PlayerAndClubProfileDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Availability",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Users",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrimaryPosition",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SecondaryPosition",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PlayerCareerEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FromYear = table.Column<int>(type: "integer", nullable: true),
                    ToYear = table.Column<int>(type: "integer", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerCareerEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerCareerEntries_Users_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerCareerEntries_PlayerId",
                table: "PlayerCareerEntries",
                column: "PlayerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlayerCareerEntries");

            migrationBuilder.DropColumn(
                name: "Availability",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PrimaryPosition",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecondaryPosition",
                table: "Users");
        }
    }
}
