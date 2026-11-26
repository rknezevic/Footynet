using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footynet.Data.Migrations
{
    /// <inheritdoc />
    public partial class UnreadMessageEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MessageEmailsEnabled",
                table: "Users",
                type: "boolean",
                nullable: false,
                // Existing users get message emails, like new ones (User.MessageEmailsEnabled = true)
                defaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailNotifiedAt",
                table: "Messages",
                type: "timestamp with time zone",
                nullable: true);

            // Messages sent before this change count as already handled, so nobody gets emails about them
            migrationBuilder.Sql(@"UPDATE ""Messages"" SET ""EmailNotifiedAt"" = ""SentAt"";");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MessageEmailsEnabled",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EmailNotifiedAt",
                table: "Messages");
        }
    }
}
