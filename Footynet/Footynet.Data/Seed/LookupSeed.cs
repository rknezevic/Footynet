using Footynet.Models;

namespace Footynet.Data.Seed;

// Lookup data seeded through migrations (HasData).
// IDs are fixed so migrations stay stable — never renumber existing entries, only append new ones.
public static class LookupSeed
{
    private static Guid CountyGuid(int n) => Guid.Parse($"00000000-0000-0000-0001-{n:D12}");
    private static Guid LeagueGuid(int n) => Guid.Parse($"00000000-0000-0000-0002-{n:D12}");

    public static readonly Guid ZagrebackaZupanija = CountyGuid(1);
    public static readonly Guid KrapinskoZagorska = CountyGuid(2);
    public static readonly Guid SisackoMoslavacka = CountyGuid(3);
    public static readonly Guid Karlovacka = CountyGuid(4);
    public static readonly Guid Varazdinska = CountyGuid(5);
    public static readonly Guid KoprivnickoKrizevacka = CountyGuid(6);
    public static readonly Guid BjelovarskoBilogorska = CountyGuid(7);
    public static readonly Guid PrimorskoGoranska = CountyGuid(8);
    public static readonly Guid LickoSenjska = CountyGuid(9);
    public static readonly Guid ViroviticoPodravska = CountyGuid(10);
    public static readonly Guid PozeskoSlavonska = CountyGuid(11);
    public static readonly Guid BrodskoPosavska = CountyGuid(12);
    public static readonly Guid Zadarska = CountyGuid(13);
    public static readonly Guid OsjeckoBaranjska = CountyGuid(14);
    public static readonly Guid SibenskoKninska = CountyGuid(15);
    public static readonly Guid VukovarskoSrijemska = CountyGuid(16);
    public static readonly Guid SplitskoDalmatinska = CountyGuid(17);
    public static readonly Guid Istarska = CountyGuid(18);
    public static readonly Guid DubrovackoNeretvanska = CountyGuid(19);
    public static readonly Guid Medimurska = CountyGuid(20);
    public static readonly Guid GradZagreb = CountyGuid(21);

    public static readonly County[] Counties =
    [
        new() { Id = ZagrebackaZupanija, Name = "Zagrebačka županija" },
        new() { Id = KrapinskoZagorska, Name = "Krapinsko-zagorska županija" },
        new() { Id = SisackoMoslavacka, Name = "Sisačko-moslavačka županija" },
        new() { Id = Karlovacka, Name = "Karlovačka županija" },
        new() { Id = Varazdinska, Name = "Varaždinska županija" },
        new() { Id = KoprivnickoKrizevacka, Name = "Koprivničko-križevačka županija" },
        new() { Id = BjelovarskoBilogorska, Name = "Bjelovarsko-bilogorska županija" },
        new() { Id = PrimorskoGoranska, Name = "Primorsko-goranska županija" },
        new() { Id = LickoSenjska, Name = "Ličko-senjska županija" },
        new() { Id = ViroviticoPodravska, Name = "Virovitičko-podravska županija" },
        new() { Id = PozeskoSlavonska, Name = "Požeško-slavonska županija" },
        new() { Id = BrodskoPosavska, Name = "Brodsko-posavska županija" },
        new() { Id = Zadarska, Name = "Zadarska županija" },
        new() { Id = OsjeckoBaranjska, Name = "Osječko-baranjska županija" },
        new() { Id = SibenskoKninska, Name = "Šibensko-kninska županija" },
        new() { Id = VukovarskoSrijemska, Name = "Vukovarsko-srijemska županija" },
        new() { Id = SplitskoDalmatinska, Name = "Splitsko-dalmatinska županija" },
        new() { Id = Istarska, Name = "Istarska županija" },
        new() { Id = DubrovackoNeretvanska, Name = "Dubrovačko-neretvanska županija" },
        new() { Id = Medimurska, Name = "Međimurska županija" },
        new() { Id = GradZagreb, Name = "Grad Zagreb" },
    ];

    private static League L(int n, int level, string name, Guid? countyId = null) =>
        new() { Id = LeagueGuid(n), Level = level, Name = name, CountyId = countyId };

    public static readonly League[] Leagues =
    [
        // 4. rang – Treća NL
        L(1, 4, "Treća NL – Istok"),
        L(2, 4, "Treća NL – Sjever"),
        L(3, 4, "Treća NL – Centar"),
        L(4, 4, "Treća NL – Zapad"),
        L(5, 4, "Treća NL – Jug"),

        // 5. rang
        L(6, 5, "MŽNL Osijek – Vinkovci"),
        L(7, 5, "MŽNL Slavonski Brod – Požega"),
        L(8, 5, "Elitna ŽNL Koprivničko-križevačka", KoprivnickoKrizevacka),
        L(9, 5, "Međimurska Premier liga", Medimurska),
        L(10, 5, "Elitna ŽNL Varaždin", Varazdinska),
        L(11, 5, "1. ŽNL Bjelovarsko-bilogorska", BjelovarskoBilogorska),
        L(12, 5, "Premijer ŽNL Virovitičko-podravska", ViroviticoPodravska),
        L(13, 5, "4. NL Središte Zagreb – podskupina A"),
        L(14, 5, "4. NL Središte Zagreb – podskupina B"),
        L(15, 5, "4. NL NS Rijeka"),
        L(16, 5, "1. ŽNL Dubrovačko-neretvanska", DubrovackoNeretvanska),
        L(17, 5, "1. ŽNL Splitsko-dalmatinska", SplitskoDalmatinska),
        L(18, 5, "ŽNL Šibensko-kninska", SibenskoKninska),
        L(19, 5, "1. ŽNL Zadarska", Zadarska),

        // 6. rang
        L(20, 6, "1. ŽNL Brodsko-posavska", BrodskoPosavska),
        L(21, 6, "1. ŽNL Osječko-baranjska", OsjeckoBaranjska),
        L(22, 6, "1. ŽNL Požeško-slavonska", PozeskoSlavonska),
        L(23, 6, "1. ŽNL Vukovarsko-srijemska", VukovarskoSrijemska),
        L(24, 6, "2. ŽNL Bjelovarsko-bilogorska", BjelovarskoBilogorska),
        L(25, 6, "1. ŽNL Koprivničko-križevačka", KoprivnickoKrizevacka),
        L(26, 6, "1. Međimurska liga", Medimurska),
        L(27, 6, "1. ŽNL Varaždinska", Varazdinska),
        L(28, 6, "1. ŽNL Virovitičko-podravska", ViroviticoPodravska),
        L(29, 6, "Premier liga NS Zagrebačke županije", ZagrebackaZupanija),
        L(30, 6, "1. Zagrebačka liga", GradZagreb),
        L(31, 6, "1. ŽNL Karlovačka", Karlovacka),
        L(32, 6, "1. ŽNL Krapinsko-zagorska", KrapinskoZagorska),
        L(33, 6, "1. ŽNL Sisačko-moslavačka", SisackoMoslavacka),
        L(34, 6, "Elitna liga NS Istarske županije", Istarska),
        L(35, 6, "ŽNL Ličko-senjska", LickoSenjska),
        L(36, 6, "1. ŽNL Primorsko-goranska", PrimorskoGoranska),
        L(37, 6, "2. ŽNL Dubrovačko-neretvanska", DubrovackoNeretvanska),
        L(38, 6, "2. ŽNL Splitsko-dalmatinska", SplitskoDalmatinska),
        L(39, 6, "2. ŽNL Zadarska", Zadarska),

        // 7. rang
        L(40, 7, "2. ŽNL Brodsko-posavska – skupina Istok", BrodskoPosavska),
        L(41, 7, "2. ŽNL Brodsko-posavska – skupina Zapad", BrodskoPosavska),
        L(42, 7, "2. ŽNL Osječko-baranjska – Beli Manastir", OsjeckoBaranjska),
        L(43, 7, "2. ŽNL Osječko-baranjska – Donji Miholjac", OsjeckoBaranjska),
        L(44, 7, "2. ŽNL Osječko-baranjska – Đakovo", OsjeckoBaranjska),
        L(45, 7, "2. ŽNL Osječko-baranjska – Našice", OsjeckoBaranjska),
        L(46, 7, "2. ŽNL Osječko-baranjska – Osijek", OsjeckoBaranjska),
        L(47, 7, "2. ŽNL Osječko-baranjska – Valpovo", OsjeckoBaranjska),
        L(48, 7, "2. ŽNL Požeško-slavonska", PozeskoSlavonska),
        L(49, 7, "2. ŽNL Vukovarsko-srijemska – NS Vinkovci", VukovarskoSrijemska),
        L(50, 7, "2. ŽNL Vukovarsko-srijemska – NS Vukovar", VukovarskoSrijemska),
        L(51, 7, "2. ŽNL Vukovarsko-srijemska – NS Županja", VukovarskoSrijemska),
        L(52, 7, "3. ŽNL Bjelovarsko-bilogorska – Skupina Sjever", BjelovarskoBilogorska),
        L(53, 7, "3. ŽNL Bjelovarsko-bilogorska – Skupina Jug", BjelovarskoBilogorska),
        L(54, 7, "2. ŽNL Koprivničko-križevačka", KoprivnickoKrizevacka),
        L(55, 7, "2. Međimurska liga", Medimurska),
        L(56, 7, "2. ŽNL Varaždinska", Varazdinska),
        L(57, 7, "2. ŽNL Virovitičko-podravska – Skupina Istok", ViroviticoPodravska),
        L(58, 7, "2. ŽNL Virovitičko-podravska – Skupina Zapad", ViroviticoPodravska),
        L(59, 7, "Jedinstvena Prva ŽNL Zagrebačka – Skupina Istok", ZagrebackaZupanija),
        L(60, 7, "Jedinstvena Prva ŽNL Zagrebačka – Skupina Zapad", ZagrebackaZupanija),
        L(61, 7, "2. Zagrebačka liga", GradZagreb),
        L(62, 7, "2. ŽNL Karlovačka", Karlovacka),
        L(63, 7, "2. ŽNL Krapinsko-zagorska", KrapinskoZagorska),
        L(64, 7, "2. ŽNL Sisačko-moslavačka – Kutina", SisackoMoslavacka),
        L(65, 7, "2. ŽNL Sisačko-moslavačka – Novska", SisackoMoslavacka),
        L(66, 7, "2. ŽNL Sisačko-moslavačka – Sisak", SisackoMoslavacka),
        L(67, 7, "1. ŽNL Istarska", Istarska),
        L(68, 7, "2. ŽNL Primorsko-goranska", PrimorskoGoranska),
        L(69, 7, "Hvarska nogometna liga", SplitskoDalmatinska),

        // 8. rang
        L(70, 8, "3. ŽNL Brodsko-posavska – skupina Istok", BrodskoPosavska),
        L(71, 8, "3. ŽNL Brodsko-posavska – skupina Zapad", BrodskoPosavska),
        L(72, 8, "3. ŽNL Osječko-baranjska – Liga NS Beli Manastir (Baranjska liga)", OsjeckoBaranjska),
        L(73, 8, "3. ŽNL Osječko-baranjska – Liga NS Đakovo", OsjeckoBaranjska),
        L(74, 8, "3. ŽNL Osječko-baranjska – Liga NS Našice", OsjeckoBaranjska),
        L(75, 8, "3. ŽNL Osječko-baranjska – Liga NS Osijek", OsjeckoBaranjska),
        L(76, 8, "3. ŽNL Osječko-baranjska – Liga NS Valpovo", OsjeckoBaranjska),
        L(77, 8, "3. ŽNL Vukovarsko-srijemska – NS Vinkovci", VukovarskoSrijemska),
        L(78, 8, "3. ŽNL Koprivničko-križevačka", KoprivnickoKrizevacka),
        L(79, 8, "3. Međimurska liga – Skupina A", Medimurska),
        L(80, 8, "3. Međimurska liga – Skupina B", Medimurska),
        L(81, 8, "3. ŽNL Varaždinska – Ludbreg", Varazdinska),
        L(82, 8, "3. ŽNL Varaždinska – Varaždin", Varazdinska),
        L(83, 8, "2. ŽNL Zagrebačka – Skupina Istok", ZagrebackaZupanija),
        L(84, 8, "2. ŽNL Zagrebačka – Skupina Zapad", ZagrebackaZupanija),
        L(85, 8, "2. ŽNL Istarska – Skupina Sjever", Istarska),
        L(86, 8, "2. ŽNL Istarska – Skupina Jug", Istarska),
    ];
}
