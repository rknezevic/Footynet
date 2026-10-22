using FluentValidation;
using Footynet.DTOs;

namespace Footynet.Validators;

public class UpdateClubProfileDtoValidator : AbstractValidator<UpdateClubProfileDto>
{
    public UpdateClubProfileDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Club name is required")
            .MaximumLength(100).WithMessage("Club name must be under 100 characters");

        RuleFor(x => x.LeagueId)
            .NotEqual(Guid.Empty).WithMessage("League is required");

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[0-9 ()/-]{6,30}$").WithMessage("Invalid phone number")
            .When(x => !string.IsNullOrWhiteSpace(x.Phone));
    }
}
