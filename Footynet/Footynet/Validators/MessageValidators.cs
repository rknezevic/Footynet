using FluentValidation;
using Footynet.Controllers;

namespace Footynet.Validators;

public class CreateMessageDtoValidator : AbstractValidator<CreateMessageDto>
{
    public CreateMessageDtoValidator()
    {
        RuleFor(x => x.ReceiverId)
            .NotEqual(Guid.Empty).WithMessage("Receiver is required");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Message content is required")
            .MaximumLength(2000).WithMessage("Message must be under 2000 characters");
    }
}
