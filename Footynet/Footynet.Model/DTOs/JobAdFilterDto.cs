namespace Footynet.DTOs
{
    public class JobAdFilterDto
    {
        public Guid? PositionId { get; set; }
        public Guid? LeagueId { get; set; }
        public Guid? CountyId { get; set; }    
        public string? SearchTerm { get; set; } 
    }

}
