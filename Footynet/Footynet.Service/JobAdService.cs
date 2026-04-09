using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;

namespace Footynet.Service
{
    public class JobAdService : IJobAdService
    {
        private readonly IJobAdRepository _jobAdRepository;
        public JobAdService(IJobAdRepository jobAdRepository)
        {
            _jobAdRepository = jobAdRepository;
        }

        public async Task <ClubJobAdDto> CreateJobAdAsync(CreateJobAdDto dto, Guid clubId)
        {
            var jobAd = new JobAd
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                ClubId = clubId,
                RequiredPosition = dto.RequiredPosition,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                AdStatus = AdStatusType.Open

            };
            var created = await _jobAdRepository.CreateAsync(jobAd);
            return MapToClubDto(created);
        }

        public async Task<ClubJobAdDto> UpdateJobAdAsync(Guid id, CreateJobAdDto dto, Guid clubId)
        {
            var jobAd = await _jobAdRepository.GetByIdAsync(id);
            if (jobAd == null || jobAd.ClubId != clubId)
                throw new InvalidOperationException("Job ad not found or unauthorized");

            jobAd.Title = dto.Title;
            jobAd.Description = dto.Description;
            jobAd.RequiredPosition = dto.RequiredPosition;
            jobAd.UpdatedAt = DateTime.UtcNow;

            var updated = await _jobAdRepository.UpdateAsync(jobAd);
            return MapToClubDto(updated);
        }

        public async Task CloseJobAdAsync(Guid id, Guid clubId)
        {
            var jobAd = await _jobAdRepository.GetByIdAsync(id);
            if (jobAd == null || jobAd.ClubId != clubId)
                throw new InvalidOperationException("Job ad not found or unauthorized");

            jobAd.AdStatus = AdStatusType.Closed;
            jobAd.UpdatedAt = DateTime.UtcNow;

            await _jobAdRepository.UpdateAsync(jobAd);
        }

        public async Task ReopenJobAdAsync(Guid id, Guid clubId)
        {
            var jobAd = await _jobAdRepository.GetByIdAsync(id);
            if (jobAd == null || jobAd.ClubId != clubId)
                throw new InvalidOperationException("Job ad not found or unauthorized");

            jobAd.AdStatus = AdStatusType.Open;
            jobAd.UpdatedAt = DateTime.UtcNow;

            await _jobAdRepository.UpdateAsync(jobAd);
        }

        public async Task<IEnumerable<JobAdDto>> GetAllAsync(int page = 1, int pageSize = 10, PositionType? position = null, Guid? leagueId = null, Guid? countyId = null, string? searchTerm = null, Guid? excludePlayerId = null, bool sortDescending = true)
        {
            return await _jobAdRepository.GetAllAsync(page, pageSize, position, leagueId, countyId, searchTerm, excludePlayerId, sortDescending);
        }

        public async Task<JobAd?> GetByIdAsync(Guid id)
        {
            return await _jobAdRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<ClubJobAdDto>> GetByClubAsync(Guid clubId)
        {
            var ads = await _jobAdRepository.GetAdsByClubAsync(clubId);
            return ads.Select(MapToClubDto);
        }

        private static ClubJobAdDto MapToClubDto(JobAd ad) => new()
        {
            Id = ad.Id,
            Title = ad.Title,
            Description = ad.Description,
            RequiredPosition = ad.RequiredPosition.ToString(),
            CreatedAt = ad.CreatedAt,
            UpdatedAt = ad.UpdatedAt,
            AdStatus = ad.AdStatus.ToString()
        };
    }
}
