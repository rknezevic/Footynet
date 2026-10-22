using FluentValidation;
using Footynet.DTOs;

namespace Footynet.Validators;

public class UpdatePlayerProfileDtoValidator : AbstractValidator<UpdatePlayerProfileDto>
{
    public UpdatePlayerProfileDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(50).WithMessage("First name must be under 50 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(50).WithMessage("Last name must be under 50 characters");

        RuleFor(x => x.Age)
            .InclusiveBetween(16, 50).WithMessage("Age must be between 16 and 50");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City must be under 100 characters");

        RuleFor(x => x.PrefeeredFootType)
            .IsInEnum().WithMessage("Invalid preferred foot type");

        RuleFor(x => x.PrimaryPosition)
            .IsInEnum().WithMessage("Invalid position")
            .When(x => x.PrimaryPosition != null);

        RuleFor(x => x.SecondaryPosition)
            .IsInEnum().WithMessage("Invalid position")
            .When(x => x.SecondaryPosition != null);

        RuleFor(x => x.Availability)
            .IsInEnum().WithMessage("Invalid availability status");

        RuleFor(x => x.Career)
            .Must(c => c.Count <= 20).WithMessage("You can add up to 20 clubs");

        RuleForEach(x => x.Career).SetValidator(new CareerEntryDtoValidator());
    }
}

public class CareerEntryDtoValidator : AbstractValidator<CareerEntryDto>
{
    public CareerEntryDtoValidator()
    {
        var currentYear = DateTime.UtcNow.Year;

        RuleFor(x => x.ClubName)
            .NotEmpty().WithMessage("Club name is required")
            .MaximumLength(100).WithMessage("Club name must be under 100 characters");

        RuleFor(x => x.FromYear)
            .InclusiveBetween(1950, currentYear).WithMessage("Year must be between 1950 and the current year")
            .When(x => x.FromYear != null);

        RuleFor(x => x.ToYear)
            .InclusiveBetween(1950, currentYear).WithMessage("Year must be between 1950 and the current year")
            .When(x => x.ToYear != null);

        RuleFor(x => x)
            .Must(x => x.FromYear == null || x.ToYear == null || x.FromYear <= x.ToYear)
            .WithMessage("End year cannot be before start year")
            .WithName("ToYear");
    }
}

public class CreateApplicationDtoValidator : AbstractValidator<CreateApplicationDto>
{
    public CreateApplicationDtoValidator()
    {
        RuleFor(x => x.JobAdId)
            .NotEqual(Guid.Empty).WithMessage("Job ad is required");

        RuleFor(x => x.CoverLetter)
            .MaximumLength(2000).WithMessage("Cover letter must be under 2000 characters")
            .When(x => x.CoverLetter != null);
    }
}
