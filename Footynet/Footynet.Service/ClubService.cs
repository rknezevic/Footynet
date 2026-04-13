using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;

namespace Footynet.Service;

public class ClubService : IClubService
{
    private readonly IJobApplicationRepository _applicationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IClubRepository _clubRepository;

    public ClubService(
        IJobApplicationRepository applicationRepository,
        IMessageRepository messageRepository,
        IClubRepository clubRepository)
    {
        _applicationRepository = applicationRepository;
        _messageRepository = messageRepository;
        _clubRepository = clubRepository;
    }

    public async Task<PaginatedResult<JobApplication>> GetJobApplicationsAsync(Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10)
    {
        var items = await _applicationRepository.GetApplicationsByJobAdAsync(jobAdId, status, orderByDateDesc, page, pageSize);
        var totalCount = await _applicationRepository.GetApplicationsCountAsync(jobAdId, status);
        return new PaginatedResult<JobApplication>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task AcceptApplicationAsync(Guid applicationId, Guid clubId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
            throw new InvalidOperationException("Application not found");

        if (application.JobAd.ClubId != clubId)
            throw new UnauthorizedAccessException("Not authorized");

        await _applicationRepository.UpdateStatusAsync(applicationId, StatusType.Accepted);

        var message = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = clubId,
            ReceiverId = application.PlayerId,
            Content = $"Congratulations! Your application for '{application.JobAd.Title}' has been accepted. Let's discuss further details.",
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        await _messageRepository.CreateAsync(message);
    }

    public async Task RejectApplicationAsync(Guid applicationId, Guid clubId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
            throw new InvalidOperationException("Application not found");

        if (application.JobAd.ClubId != clubId)
            throw new UnauthorizedAccessException("Not authorized");

        await _applicationRepository.UpdateStatusAsync(applicationId, StatusType.Rejected);
    }

    public async Task<int> GetApplicationCountAsync(Guid jobAdId)
    {
        var applications = await _applicationRepository.GetApplicationsByJobAdAsync(jobAdId);
        return applications.Count();
    }

    public async Task<ClubProfileDto?> GetClubProfileAsync(Guid clubId)
    {
        var club = await _clubRepository.GetByIdAsync(clubId);
        if (club == null)
            return null;

        return new ClubProfileDto
        {
            Id = club.Id,
            Name = club.Name,
            Description = club.Description ?? "",
            City = club.City,
            County = club.CountyName,
            LeagueName = club.League?.Name ?? "",
            LeagueId = club.LeagueId
        };
    }

    public async Task UpdateClubProfileAsync(Guid clubId, UpdateClubProfileDto dto)
    {
        var club = await _clubRepository.GetByIdAsync(clubId);
        if (club == null)
            throw new InvalidOperationException("Club not found");

        club.Name = dto.Name;
        club.Description = dto.Description;
        club.City = dto.City;
        club.CountyName = dto.County;
        club.LeagueId = dto.LeagueId;

        await _clubRepository.UpdateAsync(club);
    }

    public async Task DeactivateAccountAsync(Guid clubId)
    {
        var club = await _clubRepository.GetByIdAsync(clubId);
        if (club == null)
            throw new InvalidOperationException("Club not found");

        await _clubRepository.DeactivateAccountAsync(clubId);
    }
}
