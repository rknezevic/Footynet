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

        RuleFor(x => x.Password).NewPassword();

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage(AppMessages.Validation.PasswordsDoNotMatch);

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidRole);

        RuleFor(x => x.AcceptTerms)
            .Equal(true).WithMessage(AppMessages.Validation.TermsNotAccepted);

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

public class ForgotPasswordDtoValidator : AbstractValidator<ForgotPasswordDto>
{
    public ForgotPasswordDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(AppMessages.Validation.EmailRequired)
            .EmailAddress().WithMessage(AppMessages.Validation.InvalidEmail);
    }
}

public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
{
    public ResetPasswordDtoValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage(AppMessages.Auth.InvalidResetLink);

        RuleFor(x => x.Password).NewPassword();

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage(AppMessages.Validation.PasswordsDoNotMatch);
    }
}

public static class PasswordRules
{
    // Rules for a new password (registration and reset). Kept in sync with the checklist
    // on the frontend (footynet-frontend/lib/password.ts)
    public static IRuleBuilderOptions<T, string> NewPassword<T>(this IRuleBuilder<T, string> rule) => rule
        .NotEmpty().WithMessage(AppMessages.Validation.PasswordRequired)
        .MinimumLength(8).WithMessage(AppMessages.Validation.PasswordTooShort)
        .Matches("[A-Z]").WithMessage(AppMessages.Validation.PasswordNeedsUppercase)
        .Matches("[0-9]").WithMessage(AppMessages.Validation.PasswordNeedsDigit);
}
