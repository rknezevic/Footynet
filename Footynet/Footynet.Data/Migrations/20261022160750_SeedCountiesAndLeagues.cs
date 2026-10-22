using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Footynet.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedCountiesAndLeagues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leagues_Counties_CountyId",
                table: "Leagues");

            migrationBuilder.AlterColumn<Guid>(
                name: "CountyId",
                table: "Leagues",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "Leagues",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "Counties",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0001-000000000001"), "Zagrebačka županija" },
                    { new Guid("00000000-0000-0000-0001-000000000002"), "Krapinsko-zagorska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000003"), "Sisačko-moslavačka županija" },
                    { new Guid("00000000-0000-0000-0001-000000000004"), "Karlovačka županija" },
                    { new Guid("00000000-0000-0000-0001-000000000005"), "Varaždinska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000006"), "Koprivničko-križevačka županija" },
                    { new Guid("00000000-0000-0000-0001-000000000007"), "Bjelovarsko-bilogorska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000008"), "Primorsko-goranska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000009"), "Ličko-senjska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000010"), "Virovitičko-podravska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000011"), "Požeško-slavonska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000012"), "Brodsko-posavska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000013"), "Zadarska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000014"), "Osječko-baranjska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000015"), "Šibensko-kninska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000016"), "Vukovarsko-srijemska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000017"), "Splitsko-dalmatinska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000018"), "Istarska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000019"), "Dubrovačko-neretvanska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000020"), "Međimurska županija" },
                    { new Guid("00000000-0000-0000-0001-000000000021"), "Grad Zagreb" }
                });

            migrationBuilder.InsertData(
                table: "Leagues",
                columns: new[] { "Id", "CountyId", "Level", "Name" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0002-000000000001"), null, 4, "Treća NL – Istok" },
                    { new Guid("00000000-0000-0000-0002-000000000002"), null, 4, "Treća NL – Sjever" },
                    { new Guid("00000000-0000-0000-0002-000000000003"), null, 4, "Treća NL – Centar" },
                    { new Guid("00000000-0000-0000-0002-000000000004"), null, 4, "Treća NL – Zapad" },
                    { new Guid("00000000-0000-0000-0002-000000000005"), null, 4, "Treća NL – Jug" },
                    { new Guid("00000000-0000-0000-0002-000000000006"), null, 5, "MŽNL Osijek – Vinkovci" },
                    { new Guid("00000000-0000-0000-0002-000000000007"), null, 5, "MŽNL Slavonski Brod – Požega" },
                    { new Guid("00000000-0000-0000-0002-000000000013"), null, 5, "4. NL Središte Zagreb – podskupina A" },
                    { new Guid("00000000-0000-0000-0002-000000000014"), null, 5, "4. NL Središte Zagreb – podskupina B" },
                    { new Guid("00000000-0000-0000-0002-000000000015"), null, 5, "4. NL NS Rijeka" },
                    { new Guid("00000000-0000-0000-0002-000000000008"), new Guid("00000000-0000-0000-0001-000000000006"), 5, "Elitna ŽNL Koprivničko-križevačka" },
                    { new Guid("00000000-0000-0000-0002-000000000009"), new Guid("00000000-0000-0000-0001-000000000020"), 5, "Međimurska Premier liga" },
                    { new Guid("00000000-0000-0000-0002-000000000010"), new Guid("00000000-0000-0000-0001-000000000005"), 5, "Elitna ŽNL Varaždin" },
                    { new Guid("00000000-0000-0000-0002-000000000011"), new Guid("00000000-0000-0000-0001-000000000007"), 5, "1. ŽNL Bjelovarsko-bilogorska" },
                    { new Guid("00000000-0000-0000-0002-000000000012"), new Guid("00000000-0000-0000-0001-000000000010"), 5, "Premijer ŽNL Virovitičko-podravska" },
                    { new Guid("00000000-0000-0000-0002-000000000016"), new Guid("00000000-0000-0000-0001-000000000019"), 5, "1. ŽNL Dubrovačko-neretvanska" },
                    { new Guid("00000000-0000-0000-0002-000000000017"), new Guid("00000000-0000-0000-0001-000000000017"), 5, "1. ŽNL Splitsko-dalmatinska" },
                    { new Guid("00000000-0000-0000-0002-000000000018"), new Guid("00000000-0000-0000-0001-000000000015"), 5, "ŽNL Šibensko-kninska" },
                    { new Guid("00000000-0000-0000-0002-000000000019"), new Guid("00000000-0000-0000-0001-000000000013"), 5, "1. ŽNL Zadarska" },
                    { new Guid("00000000-0000-0000-0002-000000000020"), new Guid("00000000-0000-0000-0001-000000000012"), 6, "1. ŽNL Brodsko-posavska" },
                    { new Guid("00000000-0000-0000-0002-000000000021"), new Guid("00000000-0000-0000-0001-000000000014"), 6, "1. ŽNL Osječko-baranjska" },
                    { new Guid("00000000-0000-0000-0002-000000000022"), new Guid("00000000-0000-0000-0001-000000000011"), 6, "1. ŽNL Požeško-slavonska" },
                    { new Guid("00000000-0000-0000-0002-000000000023"), new Guid("00000000-0000-0000-0001-000000000016"), 6, "1. ŽNL Vukovarsko-srijemska" },
                    { new Guid("00000000-0000-0000-0002-000000000024"), new Guid("00000000-0000-0000-0001-000000000007"), 6, "2. ŽNL Bjelovarsko-bilogorska" },
                    { new Guid("00000000-0000-0000-0002-000000000025"), new Guid("00000000-0000-0000-0001-000000000006"), 6, "1. ŽNL Koprivničko-križevačka" },
                    { new Guid("00000000-0000-0000-0002-000000000026"), new Guid("00000000-0000-0000-0001-000000000020"), 6, "1. Međimurska liga" },
                    { new Guid("00000000-0000-0000-0002-000000000027"), new Guid("00000000-0000-0000-0001-000000000005"), 6, "1. ŽNL Varaždinska" },
                    { new Guid("00000000-0000-0000-0002-000000000028"), new Guid("00000000-0000-0000-0001-000000000010"), 6, "1. ŽNL Virovitičko-podravska" },
                    { new Guid("00000000-0000-0000-0002-000000000029"), new Guid("00000000-0000-0000-0001-000000000001"), 6, "Premier liga NS Zagrebačke županije" },
                    { new Guid("00000000-0000-0000-0002-000000000030"), new Guid("00000000-0000-0000-0001-000000000021"), 6, "1. Zagrebačka liga" },
                    { new Guid("00000000-0000-0000-0002-000000000031"), new Guid("00000000-0000-0000-0001-000000000004"), 6, "1. ŽNL Karlovačka" },
                    { new Guid("00000000-0000-0000-0002-000000000032"), new Guid("00000000-0000-0000-0001-000000000002"), 6, "1. ŽNL Krapinsko-zagorska" },
                    { new Guid("00000000-0000-0000-0002-000000000033"), new Guid("00000000-0000-0000-0001-000000000003"), 6, "1. ŽNL Sisačko-moslavačka" },
                    { new Guid("00000000-0000-0000-0002-000000000034"), new Guid("00000000-0000-0000-0001-000000000018"), 6, "Elitna liga NS Istarske županije" },
                    { new Guid("00000000-0000-0000-0002-000000000035"), new Guid("00000000-0000-0000-0001-000000000009"), 6, "ŽNL Ličko-senjska" },
                    { new Guid("00000000-0000-0000-0002-000000000036"), new Guid("00000000-0000-0000-0001-000000000008"), 6, "1. ŽNL Primorsko-goranska" },
                    { new Guid("00000000-0000-0000-0002-000000000037"), new Guid("00000000-0000-0000-0001-000000000019"), 6, "2. ŽNL Dubrovačko-neretvanska" },
                    { new Guid("00000000-0000-0000-0002-000000000038"), new Guid("00000000-0000-0000-0001-000000000017"), 6, "2. ŽNL Splitsko-dalmatinska" },
                    { new Guid("00000000-0000-0000-0002-000000000039"), new Guid("00000000-0000-0000-0001-000000000013"), 6, "2. ŽNL Zadarska" },
                    { new Guid("00000000-0000-0000-0002-000000000040"), new Guid("00000000-0000-0000-0001-000000000012"), 7, "2. ŽNL Brodsko-posavska – skupina Istok" },
                    { new Guid("00000000-0000-0000-0002-000000000041"), new Guid("00000000-0000-0000-0001-000000000012"), 7, "2. ŽNL Brodsko-posavska – skupina Zapad" },
                    { new Guid("00000000-0000-0000-0002-000000000042"), new Guid("00000000-0000-0000-0001-000000000014"), 7, "2. ŽNL Osječko-baranjska – Beli Manastir" },
                    { new Guid("00000000-0000-0000-0002-000000000043"), new Guid("00000000-0000-0000-0001-000000000014"), 7, "2. ŽNL Osječko-baranjska – Donji Miholjac" },
                    { new Guid("00000000-0000-0000-0002-000000000044"), new Guid("00000000-0000-0000-0001-000000000014"), 7, "2. ŽNL Osječko-baranjska – Đakovo" },
                    { new Guid("00000000-0000-0000-0002-000000000045"), new Guid("00000000-0000-0000-0001-000000000014"), 7, "2. ŽNL Osječko-baranjska – Našice" },
                    { new Guid("00000000-0000-0000-0002-000000000046"), new Guid("00000000-0000-0000-0001-000000000014"), 7, "2. ŽNL Osječko-baranjska – Osijek" },
                    { new Guid("00000000-0000-0000-0002-000000000047"), new Guid("00000000-0000-0000-0001-000000000014"), 7, "2. ŽNL Osječko-baranjska – Valpovo" },
                    { new Guid("00000000-0000-0000-0002-000000000048"), new Guid("00000000-0000-0000-0001-000000000011"), 7, "2. ŽNL Požeško-slavonska" },
                    { new Guid("00000000-0000-0000-0002-000000000049"), new Guid("00000000-0000-0000-0001-000000000016"), 7, "2. ŽNL Vukovarsko-srijemska – NS Vinkovci" },
                    { new Guid("00000000-0000-0000-0002-000000000050"), new Guid("00000000-0000-0000-0001-000000000016"), 7, "2. ŽNL Vukovarsko-srijemska – NS Vukovar" },
                    { new Guid("00000000-0000-0000-0002-000000000051"), new Guid("00000000-0000-0000-0001-000000000016"), 7, "2. ŽNL Vukovarsko-srijemska – NS Županja" },
                    { new Guid("00000000-0000-0000-0002-000000000052"), new Guid("00000000-0000-0000-0001-000000000007"), 7, "3. ŽNL Bjelovarsko-bilogorska – Skupina Sjever" },
                    { new Guid("00000000-0000-0000-0002-000000000053"), new Guid("00000000-0000-0000-0001-000000000007"), 7, "3. ŽNL Bjelovarsko-bilogorska – Skupina Jug" },
                    { new Guid("00000000-0000-0000-0002-000000000054"), new Guid("00000000-0000-0000-0001-000000000006"), 7, "2. ŽNL Koprivničko-križevačka" },
                    { new Guid("00000000-0000-0000-0002-000000000055"), new Guid("00000000-0000-0000-0001-000000000020"), 7, "2. Međimurska liga" },
                    { new Guid("00000000-0000-0000-0002-000000000056"), new Guid("00000000-0000-0000-0001-000000000005"), 7, "2. ŽNL Varaždinska" },
                    { new Guid("00000000-0000-0000-0002-000000000057"), new Guid("00000000-0000-0000-0001-000000000010"), 7, "2. ŽNL Virovitičko-podravska – Skupina Istok" },
                    { new Guid("00000000-0000-0000-0002-000000000058"), new Guid("00000000-0000-0000-0001-000000000010"), 7, "2. ŽNL Virovitičko-podravska – Skupina Zapad" },
                    { new Guid("00000000-0000-0000-0002-000000000059"), new Guid("00000000-0000-0000-0001-000000000001"), 7, "Jedinstvena Prva ŽNL Zagrebačka – Skupina Istok" },
                    { new Guid("00000000-0000-0000-0002-000000000060"), new Guid("00000000-0000-0000-0001-000000000001"), 7, "Jedinstvena Prva ŽNL Zagrebačka – Skupina Zapad" },
                    { new Guid("00000000-0000-0000-0002-000000000061"), new Guid("00000000-0000-0000-0001-000000000021"), 7, "2. Zagrebačka liga" },
                    { new Guid("00000000-0000-0000-0002-000000000062"), new Guid("00000000-0000-0000-0001-000000000004"), 7, "2. ŽNL Karlovačka" },
                    { new Guid("00000000-0000-0000-0002-000000000063"), new Guid("00000000-0000-0000-0001-000000000002"), 7, "2. ŽNL Krapinsko-zagorska" },
                    { new Guid("00000000-0000-0000-0002-000000000064"), new Guid("00000000-0000-0000-0001-000000000003"), 7, "2. ŽNL Sisačko-moslavačka – Kutina" },
                    { new Guid("00000000-0000-0000-0002-000000000065"), new Guid("00000000-0000-0000-0001-000000000003"), 7, "2. ŽNL Sisačko-moslavačka – Novska" },
                    { new Guid("00000000-0000-0000-0002-000000000066"), new Guid("00000000-0000-0000-0001-000000000003"), 7, "2. ŽNL Sisačko-moslavačka – Sisak" },
                    { new Guid("00000000-0000-0000-0002-000000000067"), new Guid("00000000-0000-0000-0001-000000000018"), 7, "1. ŽNL Istarska" },
                    { new Guid("00000000-0000-0000-0002-000000000068"), new Guid("00000000-0000-0000-0001-000000000008"), 7, "2. ŽNL Primorsko-goranska" },
                    { new Guid("00000000-0000-0000-0002-000000000069"), new Guid("00000000-0000-0000-0001-000000000017"), 7, "Hvarska nogometna liga" },
                    { new Guid("00000000-0000-0000-0002-000000000070"), new Guid("00000000-0000-0000-0001-000000000012"), 8, "3. ŽNL Brodsko-posavska – skupina Istok" },
                    { new Guid("00000000-0000-0000-0002-000000000071"), new Guid("00000000-0000-0000-0001-000000000012"), 8, "3. ŽNL Brodsko-posavska – skupina Zapad" },
                    { new Guid("00000000-0000-0000-0002-000000000072"), new Guid("00000000-0000-0000-0001-000000000014"), 8, "3. ŽNL Osječko-baranjska – Liga NS Beli Manastir (Baranjska liga)" },
                    { new Guid("00000000-0000-0000-0002-000000000073"), new Guid("00000000-0000-0000-0001-000000000014"), 8, "3. ŽNL Osječko-baranjska – Liga NS Đakovo" },
                    { new Guid("00000000-0000-0000-0002-000000000074"), new Guid("00000000-0000-0000-0001-000000000014"), 8, "3. ŽNL Osječko-baranjska – Liga NS Našice" },
                    { new Guid("00000000-0000-0000-0002-000000000075"), new Guid("00000000-0000-0000-0001-000000000014"), 8, "3. ŽNL Osječko-baranjska – Liga NS Osijek" },
                    { new Guid("00000000-0000-0000-0002-000000000076"), new Guid("00000000-0000-0000-0001-000000000014"), 8, "3. ŽNL Osječko-baranjska – Liga NS Valpovo" },
                    { new Guid("00000000-0000-0000-0002-000000000077"), new Guid("00000000-0000-0000-0001-000000000016"), 8, "3. ŽNL Vukovarsko-srijemska – NS Vinkovci" },
                    { new Guid("00000000-0000-0000-0002-000000000078"), new Guid("00000000-0000-0000-0001-000000000006"), 8, "3. ŽNL Koprivničko-križevačka" },
                    { new Guid("00000000-0000-0000-0002-000000000079"), new Guid("00000000-0000-0000-0001-000000000020"), 8, "3. Međimurska liga – Skupina A" },
                    { new Guid("00000000-0000-0000-0002-000000000080"), new Guid("00000000-0000-0000-0001-000000000020"), 8, "3. Međimurska liga – Skupina B" },
                    { new Guid("00000000-0000-0000-0002-000000000081"), new Guid("00000000-0000-0000-0001-000000000005"), 8, "3. ŽNL Varaždinska – Ludbreg" },
                    { new Guid("00000000-0000-0000-0002-000000000082"), new Guid("00000000-0000-0000-0001-000000000005"), 8, "3. ŽNL Varaždinska – Varaždin" },
                    { new Guid("00000000-0000-0000-0002-000000000083"), new Guid("00000000-0000-0000-0001-000000000001"), 8, "2. ŽNL Zagrebačka – Skupina Istok" },
                    { new Guid("00000000-0000-0000-0002-000000000084"), new Guid("00000000-0000-0000-0001-000000000001"), 8, "2. ŽNL Zagrebačka – Skupina Zapad" },
                    { new Guid("00000000-0000-0000-0002-000000000085"), new Guid("00000000-0000-0000-0001-000000000018"), 8, "2. ŽNL Istarska – Skupina Sjever" },
                    { new Guid("00000000-0000-0000-0002-000000000086"), new Guid("00000000-0000-0000-0001-000000000018"), 8, "2. ŽNL Istarska – Skupina Jug" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Leagues_Counties_CountyId",
                table: "Leagues",
                column: "CountyId",
                principalTable: "Counties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leagues_Counties_CountyId",
                table: "Leagues");

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000001"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000002"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000003"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000004"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000005"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000006"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000007"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000008"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000009"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000010"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000011"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000012"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000013"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000014"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000015"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000016"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000017"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000018"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000019"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000020"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000021"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000022"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000023"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000024"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000025"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000026"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000027"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000028"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000029"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000030"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000031"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000032"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000033"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000034"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000035"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000036"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000037"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000038"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000039"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000040"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000041"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000042"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000043"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000044"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000045"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000046"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000047"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000048"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000049"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000050"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000051"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000052"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000053"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000054"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000055"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000056"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000057"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000058"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000059"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000060"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000061"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000062"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000063"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000064"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000065"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000066"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000067"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000068"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000069"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000070"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000071"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000072"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000073"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000074"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000075"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000076"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000077"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000078"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000079"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000080"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000081"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000082"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000083"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000084"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000085"));

            migrationBuilder.DeleteData(
                table: "Leagues",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0002-000000000086"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000001"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000002"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000003"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000004"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000005"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000006"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000007"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000008"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000009"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000010"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000011"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000012"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000013"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000014"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000015"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000016"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000017"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000018"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000019"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000020"));

            migrationBuilder.DeleteData(
                table: "Counties",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0001-000000000021"));

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Leagues");

            migrationBuilder.AlterColumn<Guid>(
                name: "CountyId",
                table: "Leagues",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Leagues_Counties_CountyId",
                table: "Leagues",
                column: "CountyId",
                principalTable: "Counties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
