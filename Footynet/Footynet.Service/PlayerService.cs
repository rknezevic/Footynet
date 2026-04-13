using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;

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

    public async Task<JobApplication> ApplyToJobAsync(Guid playerId, CreateApplicationDto dto)
    {
        var jobAd = await _jobAdRepository.GetByIdAsync(dto.JobAdId);
        if (jobAd == null)
            throw new InvalidOperationException("Job ad not found");

        if (jobAd.AdStatus != AdStatusType.Open)
            throw new InvalidOperationException("Job ad is not open for applications");

        var application = new JobApplication
        {
            Id = Guid.NewGuid(),
            PlayerId = playerId,
            JobAdId = dto.JobAdId,
            CoverLetter = dto.CoverLetter,
            AppliedAt = DateTime.UtcNow,
            Status = StatusType.Pending
        };

        return await _playerRepository.CreateApplicationAsync(application);
    }

    public async Task<PlayerProfileDto?> GetPlayerProfileAsync(Guid userId)
    {
        var player = await _playerRepository.GetByIdAsync(userId);
        if (player == null)
            return null;

        return new PlayerProfileDto
        {
            Id = player.Id,
            FirstName = player.FirstName,
            LastName = player.LastName,
            Age = player.Age,
            Description = player.Description ?? "",
            PrefeeredFootType = player.PrefeeredFootType,
            City = player.City,
            County = player.CountyName
        };
    }

    public async Task<PlayerProfileDto> UpdatePlayerProfileAsync(Guid userId, UpdatePlayerProfileDto dto)
    {
        var player = await _playerRepository.GetByIdAsync(userId);
        if (player == null)
            throw new InvalidOperationException("Player not found");

        player.FirstName = dto.FirstName;
        player.LastName = dto.LastName;
        player.Age = dto.Age;
        player.Description = dto.Description;
        player.PrefeeredFootType = dto.PrefeeredFootType;
        player.City = dto.City;
        player.CountyName = dto.County;

        await _playerRepository.UpdateAsync(player);

        return new PlayerProfileDto
        {
            Id = player.Id,
            FirstName = player.FirstName,
            LastName = player.LastName,
            Age = player.Age,
            Description = player.Description ?? "",
            PrefeeredFootType = player.PrefeeredFootType,
            City = player.City,
            County = player.CountyName
        };
    }

    public async Task<PaginatedResult<JobAdDto>> GetMyApplicationsAsync(Guid userId, int page = 1, int pageSize = 10)
    {
        var player = await _playerRepository.GetByIdAsync(userId);
        if (player == null)
            throw new InvalidOperationException("Player not found");

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
            throw new InvalidOperationException("Job application not found");
        }
        await _playerRepository.CancelApplicationAsync(application);
    }
    
    public async Task DeactivateAccountAsync(Guid playerId)
    {
        var player = await _playerRepository.GetByIdAsync(playerId);
        if (player == null)
            throw new InvalidOperationException("Player not found");

        await _playerRepository.DeactivateAccountAsync(playerId);
    }
}
