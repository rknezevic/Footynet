using FluentValidation;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Localization;

namespace Footynet.Validators;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(AppMessages.Validation.EmailRequired)
            .EmailAddress().WithMessage(AppMessages.Validation.InvalidEmail);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(AppMessages.Validation.PasswordRequired);
    }
}

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(AppMessages.Validation.EmailRequired)
            .EmailAddress().WithMessage(AppMessages.Validation.InvalidEmail);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(AppMessages.Validation.PasswordRequired)
            .MinimumLength(6).WithMessage(AppMessages.Validation.PasswordTooShort);

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidRole);

        When(x => x.Role == RoleType.Player, () =>
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage(AppMessages.Validation.FirstNameRequired)
                .MaximumLength(50).WithMessage(AppMessages.Validation.FirstNameTooLong);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage(AppMessages.Validation.LastNameRequired)
                .MaximumLength(50).WithMessage(AppMessages.Validation.LastNameTooLong);

            RuleFor(x => x.Age)
                .NotNull().WithMessage(AppMessages.Validation.AgeRequired)
                .InclusiveBetween(16, 50).WithMessage(AppMessages.Validation.AgeOutOfRange);

            RuleFor(x => x.City)
                .NotEmpty().WithMessage(AppMessages.Validation.CityRequired);
        });

        When(x => x.Role == RoleType.Club, () =>
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage(AppMessages.Validation.ClubNameRequired)
                .MaximumLength(100).WithMessage(AppMessages.Validation.ClubNameTooLong);

            RuleFor(x => x.LeagueId)
                .NotNull().WithMessage(AppMessages.Validation.LeagueRequired)
                .NotEqual(Guid.Empty).WithMessage(AppMessages.Validation.LeagueRequired);
        });
    }
}
