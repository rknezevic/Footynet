namespace Footynet.Localization;

// Catalogue of every user-facing text the backend produces. Code only ever references these keys;
// the actual wording lives in Resources/SharedResource.resx (English) and SharedResource.hr.resx (Croatian).
// The key is also returned to the frontend as the error "code", so it can react to specific errors
// without comparing message text. Keys are stable: rename the text in the .resx files, not the key.
public static class AppMessages
{
    public static class General
    {
        public const string Unexpected = "General.Unexpected";
        public const string ValidationFailed = "General.ValidationFailed";
        public const string NotAuthorized = "General.NotAuthorized";
        public const string UnknownUser = "General.UnknownUser";
        public const string LocationNotConfigured = "General.LocationNotConfigured";
    }

    public static class Auth
    {
        public const string EmailTaken = "Auth.EmailTaken";
        public const string AdminRegistrationNotAllowed = "Auth.AdminRegistrationNotAllowed";
        public const string InvalidRole = "Auth.InvalidRole";
        public const string UnknownEmail = "Auth.UnknownEmail";
        public const string WrongPassword = "Auth.WrongPassword";
        public const string AccountDeactivated = "Auth.AccountDeactivated";
        public const string EmailNotConfirmed = "Auth.EmailNotConfirmed";
        public const string InvalidConfirmationLink = "Auth.InvalidConfirmationLink";
    }

    public static class Club
    {
        public const string NotFound = "Club.NotFound";
        public const string ProfileNotFound = "Club.ProfileNotFound";
        public const string AlreadyApproved = "Club.AlreadyApproved";
        public const string NotPending = "Club.NotPending";
        public const string PendingApproval = "Club.PendingApproval";
    }

    public static class Player
    {
        public const string NotFound = "Player.NotFound";
        public const string ProfileNotFound = "Player.ProfileNotFound";
    }

    public static class JobAd
    {
        public const string NotFound = "JobAd.NotFound";
        public const string NotFoundOrUnauthorized = "JobAd.NotFoundOrUnauthorized";
        public const string NotOpen = "JobAd.NotOpen";
    }

    public static class Application
    {
        public const string NotFound = "Application.NotFound";
    }

    public static class User
    {
        public const string NotFound = "User.NotFound";
        public const string AlreadyActive = "User.AlreadyActive";
        public const string AlreadyDeactivated = "User.AlreadyDeactivated";
        public const string CannotDeactivateSelf = "User.CannotDeactivateSelf";
    }

    public static class Messaging
    {
        public const string NotConnected = "Messaging.NotConnected";
        // Automatic message to the player when a club accepts the application; {0} = job ad title
        public const string ApplicationAccepted = "Messaging.ApplicationAccepted";
    }

    public static class Validation
    {
        public const string EmailRequired = "Validation.EmailRequired";
        public const string InvalidEmail = "Validation.InvalidEmail";
        public const string PasswordRequired = "Validation.PasswordRequired";
        public const string PasswordTooShort = "Validation.PasswordTooShort";
        public const string InvalidRole = "Validation.InvalidRole";
        public const string FirstNameRequired = "Validation.FirstNameRequired";
        public const string FirstNameTooLong = "Validation.FirstNameTooLong";
        public const string LastNameRequired = "Validation.LastNameRequired";
        public const string LastNameTooLong = "Validation.LastNameTooLong";
        public const string AgeRequired = "Validation.AgeRequired";
        public const string AgeOutOfRange = "Validation.AgeOutOfRange";
        public const string CityRequired = "Validation.CityRequired";
        public const string CityTooLong = "Validation.CityTooLong";
        public const string ClubNameRequired = "Validation.ClubNameRequired";
        public const string ClubNameTooLong = "Validation.ClubNameTooLong";
        public const string LeagueRequired = "Validation.LeagueRequired";
        public const string InvalidPhone = "Validation.InvalidPhone";
        public const string TitleRequired = "Validation.TitleRequired";
        public const string TitleTooLong = "Validation.TitleTooLong";
        public const string DescriptionRequired = "Validation.DescriptionRequired";
        public const string DescriptionTooLong = "Validation.DescriptionTooLong";
        public const string CoverLetterTooLong = "Validation.CoverLetterTooLong";
        public const string InvalidPosition = "Validation.InvalidPosition";
        public const string InvalidFootType = "Validation.InvalidFootType";
        public const string InvalidAvailability = "Validation.InvalidAvailability";
        public const string TooManyClubs = "Validation.TooManyClubs";
        public const string YearOutOfRange = "Validation.YearOutOfRange";
        public const string EndYearBeforeStart = "Validation.EndYearBeforeStart";
        public const string JobAdRequired = "Validation.JobAdRequired";
        public const string ReceiverRequired = "Validation.ReceiverRequired";
        public const string MessageRequired = "Validation.MessageRequired";
        public const string MessageTooLong = "Validation.MessageTooLong";
    }

    public static class Email
    {
        // {0} = recipient's first name / club name
        public const string Greeting = "Email.Greeting";
        public const string VerificationSubject = "Email.Verification.Subject";
        public const string VerificationIntro = "Email.Verification.Intro";
        public const string VerificationButton = "Email.Verification.Button";
        public const string VerificationFooter = "Email.Verification.Footer";
        // {0} = sender name
        public const string NewMessageSubject = "Email.NewMessage.Subject";
        public const string NewMessageIntro = "Email.NewMessage.Intro";
        public const string NewMessageButton = "Email.NewMessage.Button";
        public const string NewMessageFooter = "Email.NewMessage.Footer";
    }
}
