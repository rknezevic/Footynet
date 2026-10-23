namespace Footynet.Exceptions;

// Thrown when an authenticated (or identified) user is not allowed to do something; mapped to 403.
// UnauthorizedAccessException maps to 401, which makes the frontend log the user out.
// Like all app exceptions, the message is an AppMessages key, e.g. AppMessages.Auth.EmailNotConfirmed.
public class ForbiddenException(string messageKey) : Exception(messageKey);
