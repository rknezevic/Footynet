using FluentValidation;
using Footynet.DTOs;

namespace Footynet.Validators;

public class CreateJobAdDtoValidator : AbstractValidator<CreateJobAdDto>
{
    public CreateJobAdDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title must be under 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description must be under 2000 characters");

        RuleFor(x => x.RequiredPosition)
            .IsInEnum().WithMessage("Invalid position");
    }
}
