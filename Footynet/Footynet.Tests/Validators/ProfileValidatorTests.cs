using FluentValidation.TestHelper;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Validators;

namespace Footynet.Tests.Validators;

public class ProfileValidatorTests
{
    private static UpdatePlayerProfileDto ValidPlayer() => new()
    {
        FirstName = "Ivan",
        LastName = "Horvat",
        Age = 22,
        City = "Split",
        PrimaryPosition = PositionType.Midfielder,
        Availability = AvailabilityStatus.LookingForClub,
        Career = [new CareerEntryDto { ClubName = "NK Primjer", FromYear = 2018, ToYear = 2021 }]
    };

    [Fact]
    public void ValidPlayerProfile_Passes()
    {
        new UpdatePlayerProfileDtoValidator().TestValidate(ValidPlayer()).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void CareerEntryWithoutYears_Passes()
    {
        var entry = new CareerEntryDto { ClubName = "NK Primjer" };

        new CareerEntryDtoValidator().TestValidate(entry).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void CareerEntryEndingBeforeStart_Fails()
    {
        var entry = new CareerEntryDto { ClubName = "NK Primjer", FromYear = 2020, ToYear = 2018 };

        new CareerEntryDtoValidator().TestValidate(entry).ShouldHaveValidationErrorFor("ToYear");
    }

    [Fact]
    public void CareerEntryWithoutClubName_Fails()
    {
        var dto = ValidPlayer();
        dto.Career = [new CareerEntryDto { ClubName = "" }];

        new UpdatePlayerProfileDtoValidator().TestValidate(dto).ShouldHaveValidationErrorFor("Career[0].ClubName");
    }

    [Fact]
    public void MoreThan20Clubs_Fails()
    {
        var dto = ValidPlayer();
        dto.Career = Enumerable.Range(0, 21).Select(i => new CareerEntryDto { ClubName = $"Klub {i}" }).ToList();

        new UpdatePlayerProfileDtoValidator().TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Career);
    }

    [Theory]
    [InlineData("+385 91 123 4567", true)]
    [InlineData("021/123-456", true)]
    [InlineData("", true)]
    [InlineData("nazovi me", false)]
    public void ClubPhone_IsValidated(string phone, bool valid)
    {
        var dto = new UpdateClubProfileDto { Name = "NK Primjer", LeagueId = Guid.NewGuid(), Phone = phone };

        var result = new UpdateClubProfileDtoValidator().TestValidate(dto);

        if (valid) result.ShouldNotHaveValidationErrorFor(x => x.Phone);
        else result.ShouldHaveValidationErrorFor(x => x.Phone);
    }
}
