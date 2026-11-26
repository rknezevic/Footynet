using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;
using Footynet.Localization;

namespace Footynet.Service;

public class PlayerService : IPlayerService
{
    private readonly IPlayerRepository _playerRepository;
    private readonly IJobAdRepository _jobAdRepository;

    public PlayerService(IPlayerRepository playerRepository, IJobAdRepository jobAdRepository)
    {
        _playerRepository = playerRepository;
        _jobAdRepository = jobAdRepository;
    }

    public async Task<JobApplicationResponseDto> ApplyToJobAsync(Guid playerId, CreateApplicationDto dto)
    {
        var jobAd = await _jobAdRepository.GetByIdAsync(dto.JobAdId);
        if (jobAd == null)
            throw new InvalidOperationException(AppMessages.JobAd.NotFound);

        if (jobAd.AdStatus != AdStatusType.Open)
            throw new InvalidOperationException(AppMessages.JobAd.NotOpen);

        // A player has at most one application per ad (unique index). Applying again after
        // cancelling reopens that application instead of adding a second one.
        var application = await _playerRepository.GetApplicationForJobAdAsync(playerId, dto.JobAdId);
        if (application != null && application.Status != StatusType.Cancelled)
            throw new InvalidOperationException(AppMessages.Application.AlreadyApplied);

        if (application != null)
        {
            application.Status = StatusType.Pending;
            application.CoverLetter = dto.CoverLetter;
            application.AppliedAt = DateTime.UtcNow;
            await _playerRepository.UpdateApplicationAsync(application);
        }
        else
        {
            application = await _playerRepository.CreateApplicationAsync(new JobApplication
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                JobAdId = dto.JobAdId,
                CoverLetter = dto.CoverLetter,
                AppliedAt = DateTime.UtcNow,
                Status = StatusType.Pending
            });
        }

        return new JobApplicationResponseDto
        {
            Id = application.Id,
            PlayerId = application.PlayerId,
            JobAdId = application.JobAdId,
            AppliedAt = application.AppliedAt,
            Status = application.Status.ToString()
        };
    }

    public async Task<PlayerProfileDto?> GetPlayerProfileAsync(Guid userId)
    {
        var player = await _playerRepository.GetByIdAsync(userId);
        if (player == null)
            return null;

        return PlayerProfileDto.From(player);
    }

    public async Task<PlayerProfileDto> UpdatePlayerProfileAsync(Guid userId, UpdatePlayerProfileDto dto)
    {
        var player = await _playerRepository.GetByIdAsync(userId);
        if (player == null)
            throw new InvalidOperationException(AppMessages.Player.NotFound);

        player.FirstName = dto.FirstName;
        player.LastName = dto.LastName;
        if (dto.DateOfBirth is { } born)
        {
            player.DateOfBirth = born;
            player.Age = Player.YearsBetween(born, DateOnly.FromDateTime(DateTime.UtcNow));
        }
        player.Description = dto.Description;
        player.PrefeeredFootType = dto.PrefeeredFootType;
        player.City = dto.City;
        player.CountyName = dto.County;
        player.Positions.Clear();
        foreach (var (position, index) in dto.Positions.Select((p, i) => (p, i)))
            player.Positions.Add(new PlayerPosition { Position = position, SortOrder = index });
        player.Availability = dto.Availability;

        // The career list is replaced as a whole; removed entries are deleted by EF (orphan removal)
        player.CareerEntries.Clear();
        foreach (var (entry, index) in dto.Career.Select((e, i) => (e, i)))
        {
            player.CareerEntries.Add(new PlayerCareerEntry
            {
                ClubName = entry.ClubName.Trim(),
                FromYear = entry.FromYear,
                ToYear = entry.ToYear,
                SortOrder = index
            });
        }

        await _playerRepository.UpdateAsync(player);

        return PlayerProfileDto.From(player);
    }

    public async Task<PaginatedResult<JobAdDto>> GetMyApplicationsAsync(Guid userId, int page = 1, int pageSize = 10)
    {
        var player = await _playerRepository.GetByIdAsync(userId);
        if (player == null)
            throw new InvalidOperationException(AppMessages.Player.NotFound);

        var items = await _playerRepository.GetPlayerApplicationsAsync(player.Id, page: page, pageSize: pageSize);
        var totalCount = await _playerRepository.GetPlayerApplicationsCountAsync(player.Id);
        return new PaginatedResult<JobAdDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task CancelApplicationAsync(Guid applicationId, Guid playerId)
    {
        var application = await _playerRepository.GetApplicationAsync(playerId, applicationId);
        if (application == null)
        {
            throw new InvalidOperationException(AppMessages.Application.NotFound);
        }
        await _playerRepository.CancelApplicationAsync(application);
    }
    
    public async Task DeactivateAccountAsync(Guid playerId)
    {
        var player = await _playerRepository.GetByIdAsync(playerId);
        if (player == null)
            throw new InvalidOperationException(AppMessages.Player.NotFound);

        await _playerRepository.DeactivateAccountAsync(playerId);
    }
}
