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
        Positions = [PositionType.CentralMidfielder, PositionType.AttackingMidfielder],
        Availability = AvailabilityStatus.LookingForClub,
        Career = [new CareerEntryDto { ClubName = "NK Primjer", FromYear = 2018, ToYear = 2021 }]
    };

    [Fact]
    public void ValidPlayerProfile_Passes()
    {
        new UpdatePlayerProfileDtoValidator().TestValidate(ValidPlayer()).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void MoreThanFourPositions_Fails()
    {
        var dto = ValidPlayer();
        dto.Positions = [PositionType.RightBack, PositionType.CenterBack, PositionType.LeftBack, PositionType.DefensiveMidfielder, PositionType.CentralMidfielder];

        new UpdatePlayerProfileDtoValidator().TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Positions);
    }

    [Fact]
    public void DuplicatePositions_Fail()
    {
        var dto = ValidPlayer();
        dto.Positions = [PositionType.Striker, PositionType.Striker];

        new UpdatePlayerProfileDtoValidator().TestValidate(dto).ShouldHaveValidationErrorFor(x => x.Positions);
    }

    [Fact]
    public void UnknownPosition_Fails()
    {
        var dto = ValidPlayer();
        dto.Positions = [(PositionType)42];

        new UpdatePlayerProfileDtoValidator().TestValidate(dto).ShouldHaveValidationErrorFor("Positions[0]");
    }

    [Fact]
    public void PitchOrderListsEveryPositionOnce()
    {
        Assert.Equal(Enum.GetValues<PositionType>().OrderBy(p => p), Positions.PitchOrder.OrderBy(p => p));
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
