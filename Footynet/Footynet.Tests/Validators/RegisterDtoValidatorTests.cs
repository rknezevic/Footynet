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
        ConfirmPassword = "Lozinka123",
        Role = RoleType.Player,
        AcceptTerms = true,
        FirstName = "Ivan",
        LastName = "Horvat",
        Age = 22,
        City = "Split"
    };

    private static RegisterDto ValidClub() => new()
    {
        Email = "klub@example.com",
        Password = "Lozinka123",
        ConfirmPassword = "Lozinka123",
        Role = RoleType.Club,
        AcceptTerms = true,
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

    [Theory]
    [InlineData("Kratka1")]      // too short
    [InlineData("lozinka123")]   // no uppercase letter
    [InlineData("LozinkaBez")]   // no digit
    public void WeakPassword_Fails(string password)
    {
        var dto = ValidPlayer();
        dto.Password = password;
        dto.ConfirmPassword = password;

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void TermsNotAccepted_Fails()
    {
        var dto = ValidClub();
        dto.AcceptTerms = false;

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.AcceptTerms);
    }

    [Theory]
    [InlineData("Lozinka123", "Lozinka123", true)]
    [InlineData("lozinka123", "lozinka123", false)]   // same password rules as registration
    [InlineData("Lozinka123", "Lozinka124", false)]   // confirmation must match
    public void ResetPassword_UsesRegistrationRules(string password, string confirm, bool valid)
    {
        var result = new ResetPasswordDtoValidator().TestValidate(new ResetPasswordDto { Token = "t", Password = password, ConfirmPassword = confirm });

        Assert.Equal(valid, result.IsValid);
    }

    [Fact]
    public void MismatchedConfirmation_Fails()
    {
        var dto = ValidPlayer();
        dto.ConfirmPassword = "Lozinka124";

        _validator.TestValidate(dto).ShouldHaveValidationErrorFor(x => x.ConfirmPassword);
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
