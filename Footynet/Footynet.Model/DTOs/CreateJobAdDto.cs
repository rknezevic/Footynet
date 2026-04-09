using Footynet.Models;

namespace Footynet.DTOs
{
    public class CreateJobAdDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public PositionType RequiredPosition { get; set; }
    }

}
