using System.Globalization;
using System.Reflection;
using System.Resources;
using FluentValidation;
using Footynet.Localization;
using Footynet.Model;
using Footynet.Validators;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace Footynet.Tests.Localization;

public class SharedResourceTests
{
    private static readonly ResourceManager Resources =
        new("Footynet.Model.Resources.SharedResource", typeof(SharedResource).Assembly);

    // Every const string in AppMessages and its nested classes
    private static List<string> AllKeys() =>
        typeof(AppMessages).GetNestedTypes()
            .SelectMany(t => t.GetFields(BindingFlags.Public | BindingFlags.Static))
            .Where(f => f.IsLiteral && f.FieldType == typeof(string))
            .Select(f => (string)f.GetRawConstantValue()!)
            .ToList();

    private static IStringLocalizer<SharedResource> CreateLocalizer()
    {
        var factory = new ResourceManagerStringLocalizerFactory(
            Options.Create(new LocalizationOptions { ResourcesPath = "Resources" }),
            NullLoggerFactory.Instance);
        return new StringLocalizer<SharedResource>(factory);
    }

    private static T WithCulture<T>(string culture, Func<T> action)
    {
        var previous = CultureInfo.CurrentUICulture;
        CultureInfo.CurrentUICulture = new CultureInfo(culture);
        try { return action(); }
        finally { CultureInfo.CurrentUICulture = previous; }
    }

    [Theory]
    [InlineData("hr", "Pogrešna lozinka")]
    [InlineData("en", "Wrong password")]
    public void Localizer_TranslatesKeyForRequestCulture(string culture, string expected)
    {
        var localizer = CreateLocalizer();

        Assert.Equal(expected, WithCulture(culture, () => localizer[AppMessages.Auth.WrongPassword].Value));
    }

    [Fact]
    public void Get_FormatsArgumentsInRequestedLanguage()
    {
        Assert.Equal("Nova poruka od: NK Primjer", SharedResource.Get(AppMessages.Email.NewMessageSubject, "hr", "NK Primjer"));
        Assert.Equal("New message from NK Primjer", SharedResource.Get(AppMessages.Email.NewMessageSubject, "en", "NK Primjer"));
    }

    [Theory]
    [InlineData("")]   // SharedResource.resx (English)
    [InlineData("hr")] // SharedResource.hr.resx
    public void EveryKey_HasTextInEachResourceFile(string culture)
    {
        // tryParents: false, so a missing Croatian text can't silently fall back to English
        var set = Resources.GetResourceSet(CultureInfo.GetCultureInfo(culture), createIfNotExists: true, tryParents: false)!;

        var missing = AllKeys().Where(k => string.IsNullOrWhiteSpace(set.GetString(k))).ToList();

        Assert.True(missing.Count == 0, $"Missing texts in '{culture}': " + string.Join(", ", missing));
    }

    [Fact]
    public void KeysAreUnique()
    {
        var keys = AllKeys();
        Assert.Equal(keys.Count, keys.Distinct().Count());
    }

    // Fails when a validator uses WithMessage("some text") instead of an AppMessages key
    [Fact]
    public void EveryValidatorMessage_IsAKnownKey()
    {
        var keys = AllKeys().ToHashSet();
        var validatorTypes = typeof(LoginDtoValidator).Assembly.GetTypes()
            .Where(t => !t.IsAbstract && typeof(IValidator).IsAssignableFrom(t));

        var messages = validatorTypes
            .Select(t => (IEnumerable<IValidationRule>)Activator.CreateInstance(t)!)
            .SelectMany(rules => rules)
            .SelectMany(rule => rule.Components)
            // SetValidator(...) has no message of its own; the nested validator is checked separately
            .Where(c => c.Validator is not FluentValidation.Validators.IChildValidatorAdaptor)
            .Select(c => c.GetUnformattedErrorMessage())
            .Distinct()
            .ToList();

        Assert.NotEmpty(messages);
        var unknown = messages.Where(m => !keys.Contains(m)).ToList();
        Assert.True(unknown.Count == 0, "Validator messages that are not AppMessages keys: " + string.Join(", ", unknown));
    }
}
