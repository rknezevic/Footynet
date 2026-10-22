using System.Globalization;
using FluentValidation;
using Footynet.Validators;
using Footynet.WebApi;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace Footynet.Tests.Localization;

public class SharedResourceTests
{
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

    [Fact]
    public void Croatian_TranslatesMessage()
    {
        var localizer = CreateLocalizer();

        Assert.Equal("Pogrešna lozinka", WithCulture("hr", () => localizer["Wrong password"].Value));
    }

    [Fact]
    public void English_ReturnsOriginalMessage()
    {
        var localizer = CreateLocalizer();

        Assert.Equal("Wrong password", WithCulture("en", () => localizer["Wrong password"].Value));
    }

    // Fails when a validator gets a new WithMessage(...) without a Croatian entry in SharedResource.hr.resx
    [Fact]
    public void EveryValidatorMessage_HasCroatianTranslation()
    {
        var localizer = CreateLocalizer();
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
        var missing = WithCulture("hr", () => messages.Where(m => localizer[m].ResourceNotFound).ToList());
        Assert.True(missing.Count == 0, "Missing Croatian translations: " + string.Join(", ", missing));
    }
}
