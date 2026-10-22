using FluentValidation.TestHelper;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Validators;

namespace Footynet.Tests.Validators;

public class RegisterDtoValidatorTests
{
    private readonly RegisterDtoValidator _validator = new();

    private static RegisterDto ValidPlayer() => new()
    {
        Email = "igrac@example.com",
        Password = "Lozinka123",
        Role = RoleType.Player,
        FirstName = "Ivan",
        LastName = "Horvat",
        Age = 22,
        City = "Split"
    };

    private static RegisterDto ValidClub() => new()
    {
        Email = "klub@example.com",
        Password = "Lozinka123",
        Role = RoleType.Club,
        Name = "NK Primjer",
        LeagueId = Guid.NewGuid()
    };

    [Fact]
    public void ValidPlayer_PassesValidation()
    {
        _validator.TestValidate(ValidPlayer()).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void ValidClub_PassesValidation()
    {
        _validator.TestValidate(ValidClub()).ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData("nije-email")]
    public void InvalidEmail_Fails(string email)
    {
        var dto = ValidPlayer();
        dto.Email = email;

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void ShortPassword_Fails()
    {
        var dto = ValidPlayer();
        dto.Password = "123";

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Theory]
    [InlineData(15)]
    [InlineData(51)]
    public void PlayerAgeOutOfRange_Fails(int age)
    {
        var dto = ValidPlayer();
        dto.Age = age;

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Age);
    }

    [Fact]
    public void ClubWithoutLeague_Fails()
    {
        var dto = ValidClub();
        dto.LeagueId = null;

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.LeagueId);
    }

    [Fact]
    public void ClubDoesNotNeedPlayerFields()
    {
        var result = _validator.TestValidate(ValidClub());

        result.ShouldNotHaveValidationErrorFor(x => x.FirstName);
        result.ShouldNotHaveValidationErrorFor(x => x.Age);
    }
}
