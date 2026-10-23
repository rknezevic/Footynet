using FluentValidation;
using Footynet.DTOs;
using Footynet.Localization;

namespace Footynet.Validators;

public class CreateJobAdDtoValidator : AbstractValidator<CreateJobAdDto>
{
    public CreateJobAdDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(AppMessages.Validation.TitleRequired)
            .MaximumLength(100).WithMessage(AppMessages.Validation.TitleTooLong);

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage(AppMessages.Validation.DescriptionRequired)
            .MaximumLength(2000).WithMessage(AppMessages.Validation.DescriptionTooLong);

        RuleFor(x => x.RequiredPosition)
            .IsInEnum().WithMessage(AppMessages.Validation.InvalidPosition);
    }
}
