using FluentValidation;
using Footynet.Controllers;
using Footynet.Localization;

namespace Footynet.Validators;

public class CreateMessageDtoValidator : AbstractValidator<CreateMessageDto>
{
    public CreateMessageDtoValidator()
    {
        RuleFor(x => x.ReceiverId)
            .NotEqual(Guid.Empty).WithMessage(AppMessages.Validation.ReceiverRequired);

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage(AppMessages.Validation.MessageRequired)
            .MaximumLength(2000).WithMessage(AppMessages.Validation.MessageTooLong);
    }
}
