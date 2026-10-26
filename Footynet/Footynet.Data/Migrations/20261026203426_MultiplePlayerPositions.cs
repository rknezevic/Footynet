using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footynet.Data.Migrations
{
    /// <inheritdoc />
    public partial class MultiplePlayerPositions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlayerPositions",
                columns: table => new
                {
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerPositions", x => new { x.PlayerId, x.Position });
                    table.ForeignKey(
                        name: "FK_PlayerPositions_Users_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Keep existing data: the old main/secondary position become the player's first/second position.
            // The old values (0-3) already mean Goalkeeper/CenterBack/CentralMidfielder/Striker in the new enum.
            migrationBuilder.Sql("""
                INSERT INTO "PlayerPositions" ("PlayerId", "Position", "SortOrder")
                SELECT "Id", "PrimaryPosition", 0 FROM "Users"
                WHERE "UserType" = 'Player' AND "PrimaryPosition" IS NOT NULL;

                INSERT INTO "PlayerPositions" ("PlayerId", "Position", "SortOrder")
                SELECT "Id", "SecondaryPosition", 1 FROM "Users"
                WHERE "UserType" = 'Player' AND "SecondaryPosition" IS NOT NULL
                  AND "SecondaryPosition" IS DISTINCT FROM "PrimaryPosition";
                """);

            migrationBuilder.DropColumn(
                name: "PrimaryPosition",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecondaryPosition",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlayerPositions");

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
        }
    }
}
