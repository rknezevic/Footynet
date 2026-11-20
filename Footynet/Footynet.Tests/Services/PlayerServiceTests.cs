using Footynet.DTOs;
using Footynet.Localization;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service;
using Moq;

namespace Footynet.Tests.Services;

public class PlayerServiceTests
{
    private readonly Mock<IPlayerRepository> _playerRepository = new();
    private readonly Mock<IJobAdRepository> _jobAdRepository = new();
    private readonly PlayerService _service;
    private readonly Guid _playerId = Guid.NewGuid();
    private readonly JobAd _openAd = new() { Id = Guid.NewGuid(), AdStatus = AdStatusType.Open };

    public PlayerServiceTests()
    {
        _jobAdRepository.Setup(r => r.GetByIdAsync(_openAd.Id)).ReturnsAsync(_openAd);
        _playerRepository.Setup(r => r.CreateApplicationAsync(It.IsAny<JobApplication>())).ReturnsAsync((JobApplication a) => a);
        _service = new PlayerService(_playerRepository.Object, _jobAdRepository.Object);
    }

    private CreateApplicationDto Apply(string? coverLetter = null) => new() { JobAdId = _openAd.Id, CoverLetter = coverLetter };

    [Fact]
    public async Task Apply_FirstTime_CreatesPendingApplication()
    {
        var result = await _service.ApplyToJobAsync(_playerId, Apply());

        Assert.Equal(nameof(StatusType.Pending), result.Status);
        _playerRepository.Verify(r => r.CreateApplicationAsync(It.IsAny<JobApplication>()), Times.Once);
    }

    [Theory]
    [InlineData(StatusType.Pending)]
    [InlineData(StatusType.Accepted)]
    [InlineData(StatusType.Rejected)]
    public async Task Apply_Again_IsRefusedWithMessage(StatusType existingStatus)
    {
        _playerRepository.Setup(r => r.GetApplicationForJobAdAsync(_playerId, _openAd.Id))
            .ReturnsAsync(new JobApplication { Id = Guid.NewGuid(), Status = existingStatus });

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ApplyToJobAsync(_playerId, Apply()));

        Assert.Equal(AppMessages.Application.AlreadyApplied, ex.Message);
        _playerRepository.Verify(r => r.CreateApplicationAsync(It.IsAny<JobApplication>()), Times.Never);
    }

    [Fact]
    public async Task Apply_AfterCancelling_ReopensTheSameApplication()
    {
        var cancelled = new JobApplication { Id = Guid.NewGuid(), PlayerId = _playerId, JobAdId = _openAd.Id, Status = StatusType.Cancelled, CoverLetter = "staro" };
        _playerRepository.Setup(r => r.GetApplicationForJobAdAsync(_playerId, _openAd.Id)).ReturnsAsync(cancelled);

        var result = await _service.ApplyToJobAsync(_playerId, Apply("novo"));

        Assert.Equal(cancelled.Id, result.Id);
        Assert.Equal(StatusType.Pending, cancelled.Status);
        Assert.Equal("novo", cancelled.CoverLetter);
        _playerRepository.Verify(r => r.UpdateApplicationAsync(cancelled), Times.Once);
        _playerRepository.Verify(r => r.CreateApplicationAsync(It.IsAny<JobApplication>()), Times.Never);
    }

    [Fact]
    public async Task Apply_ToClosedAd_IsRefused()
    {
        _openAd.AdStatus = AdStatusType.Closed;

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ApplyToJobAsync(_playerId, Apply()));

        Assert.Equal(AppMessages.JobAd.NotOpen, ex.Message);
    }
}
