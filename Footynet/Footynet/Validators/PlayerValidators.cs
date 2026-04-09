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

        RuleFor(x => x.CountyId)
            .NotEqual(Guid.Empty).WithMessage("County is required");

        RuleFor(x => x.PrefeeredFootType)
            .IsInEnum().WithMessage("Invalid preferred foot type");
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
