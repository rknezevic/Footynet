using FluentValidation;
using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Validators;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Invalid role");

        When(x => x.Role == RoleType.Player, () =>
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(50).WithMessage("First name must be under 50 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name must be under 50 characters");

            RuleFor(x => x.Age)
                .NotNull().WithMessage("Age is required")
                .InclusiveBetween(16, 50).WithMessage("Age must be between 16 and 50");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required");
        });

        When(x => x.Role == RoleType.Club, () =>
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Club name is required")
                .MaximumLength(100).WithMessage("Club name must be under 100 characters");

            RuleFor(x => x.LeagueId)
                .NotNull().WithMessage("League is required")
                .NotEqual(Guid.Empty).WithMessage("League is required");
        });
    }
}
