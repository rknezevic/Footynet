using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;
using Footynet.Localization;
using Footynet.Model;
using Footynet.Exceptions;

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

    public async Task<PaginatedResult<ClubApplicationDto>> GetJobApplicationsAsync(Guid clubId, Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10)
    {
        // Filtering by clubId means a club only ever sees applications to its own job ads
        var items = await _applicationRepository.GetApplicationsByJobAdAsync(jobAdId, status, orderByDateDesc, page, pageSize, clubId);
        var totalCount = await _applicationRepository.GetApplicationsCountAsync(jobAdId, status, clubId);
        return new PaginatedResult<ClubApplicationDto>
        {
            Items = items.Select(a => new ClubApplicationDto
            {
                Id = a.Id,
                JobAdId = a.JobAdId,
                PlayerId = a.PlayerId,
                CoverLetter = a.CoverLetter,
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                Player = PlayerProfileDto.From(a.Player)
            }),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task AcceptApplicationAsync(Guid applicationId, Guid clubId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
            throw new InvalidOperationException(AppMessages.Application.NotFound);

        if (application.JobAd.ClubId != clubId)
            throw new ForbiddenException(AppMessages.General.NotAuthorized);

        await _applicationRepository.UpdateStatusAsync(applicationId, StatusType.Accepted);

        var message = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = clubId,
            ReceiverId = application.PlayerId,
            // Written in the player's language, since the player is the one reading it
            Content = SharedResource.Get(AppMessages.Messaging.ApplicationAccepted, application.Player.PreferredLanguage, application.JobAd.Title),
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        await _messageRepository.CreateAsync(message);
    }

    public async Task RejectApplicationAsync(Guid applicationId, Guid clubId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
            throw new InvalidOperationException(AppMessages.Application.NotFound);

        if (application.JobAd.ClubId != clubId)
            throw new ForbiddenException(AppMessages.General.NotAuthorized);

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
            LeagueId = club.LeagueId,
            Phone = club.Phone
        };
    }

    public async Task UpdateClubProfileAsync(Guid clubId, UpdateClubProfileDto dto)
    {
        var club = await _clubRepository.GetByIdAsync(clubId);
        if (club == null)
            throw new InvalidOperationException(AppMessages.Club.NotFound);

        club.Name = dto.Name;
        club.Description = dto.Description;
        club.City = dto.City;
        club.CountyName = dto.County;
        club.LeagueId = dto.LeagueId;
        club.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim();

        await _clubRepository.UpdateAsync(club);
    }

    public async Task DeactivateAccountAsync(Guid clubId)
    {
        var club = await _clubRepository.GetByIdAsync(clubId);
        if (club == null)
            throw new InvalidOperationException(AppMessages.Club.NotFound);

        await _clubRepository.DeactivateAccountAsync(clubId);
    }
}
