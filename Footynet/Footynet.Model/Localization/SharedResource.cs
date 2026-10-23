using System.Globalization;
using System.Resources;

namespace Footynet.Model;

// Marker type for IStringLocalizer<SharedResource> (used inside HTTP requests, where the culture comes
// from the Accept-Language header). Texts live in Resources/SharedResource.resx (English, the fallback)
// and Resources/SharedResource.hr.resx. The namespace matches the assembly name so the localizer finds
// the embedded "Footynet.Model.Resources.SharedResource" resources.
public class SharedResource
{
    private static readonly ResourceManager Resources =
        new("Footynet.Model.Resources.SharedResource", typeof(SharedResource).Assembly);

    // For texts produced outside a request (e.g. emails), in a language chosen explicitly.
    // Unknown languages fall back to Croatian, the app's default; missing keys return the key itself.
    public static string Get(string key, string? language, params object[] args)
    {
        var culture = CultureInfo.GetCultureInfo(language == "en" ? "en" : "hr");
        var text = Resources.GetString(key, culture) ?? key;
        return args.Length > 0 ? string.Format(culture, text, args) : text;
    }
}
