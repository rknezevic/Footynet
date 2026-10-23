using FluentValidation;
using Footynet.DTOs;
using Footynet.Localization;

namespace Footynet.Validators;

public class UpdatePlayerProfileDtoValidator : AbstractValidator<UpdatePlayerProfileDto>
{
    public UpdatePlayerProfileDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage(AppMessages.Validation.FirstNameRequired)
            .MaximumLength(50).WithMessage(AppMessages.Validation.FirstNameTooLong);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage(AppMessages.Validation.LastNameRequired)
            .MaximumLength(50).WithMessage(AppMessages.Validation.LastNameTooLong);

        RuleFor(x => x.Age)
            .InclusiveBetween(16, 50).WithMessage(AppMessages.Validation.AgeOutOfRange);

        RuleFor(x => x.City)
            .NotEmpty().WithMessage(AppMessages.Validation.CityRequired)
            .MaximumLength(100).WithMessage(AppMessages.Validation.CityTooLong);

        RuleFor(x => x.PrefeeredFootType)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidFootType);

        RuleFor(x => x.PrimaryPosition)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidPosition)
            .When(x => x.PrimaryPosition != null);

        RuleFor(x => x.SecondaryPosition)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidPosition)
            .When(x => x.SecondaryPosition != null);

        RuleFor(x => x.Availability)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidAvailability);

        RuleFor(x => x.Career)
            .Must(c => c.Count <= 20).WithMessage(AppMessages.Validation.TooManyClubs);

        RuleForEach(x => x.Career).SetValidator(new CareerEntryDtoValidator());
    }
}

public class CareerEntryDtoValidator : AbstractValidator<CareerEntryDto>
{
    public CareerEntryDtoValidator()
    {
        var currentYear = DateTime.UtcNow.Year;

        RuleFor(x => x.ClubName)
            .NotEmpty().WithMessage(AppMessages.Validation.ClubNameRequired)
            .MaximumLength(100).WithMessage(AppMessages.Validation.ClubNameTooLong);

        RuleFor(x => x.FromYear)
            .InclusiveBetween(1950, currentYear).WithMessage(AppMessages.Validation.YearOutOfRange)
            .When(x => x.FromYear != null);

        RuleFor(x => x.ToYear)
            .InclusiveBetween(1950, currentYear).WithMessage(AppMessages.Validation.YearOutOfRange)
            .When(x => x.ToYear != null);

        RuleFor(x => x)
            .Must(x => x.FromYear == null || x.ToYear == null || x.FromYear <= x.ToYear)
            .WithMessage(AppMessages.Validation.EndYearBeforeStart)
            .WithName("ToYear");
    }
}

public class CreateApplicationDtoValidator : AbstractValidator<CreateApplicationDto>
{
    public CreateApplicationDtoValidator()
    {
        RuleFor(x => x.JobAdId)
            .NotEqual(Guid.Empty).WithMessage(AppMessages.Validation.JobAdRequired);

        RuleFor(x => x.CoverLetter)
            .MaximumLength(2000).WithMessage(AppMessages.Validation.CoverLetterTooLong)
            .When(x => x.CoverLetter != null);
    }
}
