using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footynet.Data.Migrations
{
    /// <inheritdoc />
    public partial class UniqueLowercaseEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Existing emails to the normalized form (User.NormalizeEmail). An address that differs from
            // another account only in letter case is left as it is, so creating the index cannot fail.
            // Such pairs are found with: SELECT lower("Email") FROM "Users" GROUP BY 1 HAVING count(*) > 1
            migrationBuilder.Sql(@"
                UPDATE ""Users"" u SET ""Email"" = lower(trim(u.""Email""))
                WHERE u.""Email"" <> lower(trim(u.""Email""))
                  AND NOT EXISTS (
                      SELECT 1 FROM ""Users"" o
                      WHERE o.""Id"" <> u.""Id"" AND lower(trim(o.""Email"")) = lower(trim(u.""Email"")));");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");
        }
    }
}
