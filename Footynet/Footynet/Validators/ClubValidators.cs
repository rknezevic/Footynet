using FluentValidation;
using Footynet.DTOs;
using Footynet.Localization;

namespace Footynet.Validators;

public class UpdateClubProfileDtoValidator : AbstractValidator<UpdateClubProfileDto>
{
    public UpdateClubProfileDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(AppMessages.Validation.ClubNameRequired)
            .MaximumLength(100).WithMessage(AppMessages.Validation.ClubNameTooLong);

        RuleFor(x => x.LeagueId)
            .NotEqual(Guid.Empty).WithMessage(AppMessages.Validation.LeagueRequired);

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[0-9 ()/-]{6,30}$").WithMessage(AppMessages.Validation.InvalidPhone)
            .When(x => !string.IsNullOrWhiteSpace(x.Phone));
    }
}
