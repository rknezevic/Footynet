// Error codes returned by the API in { message, code }. They are the backend's AppMessages keys
// (Footynet.Model/Localization/AppMessages.cs); only the ones the frontend reacts to are listed here.
export const ErrorCodes = {
  emailNotConfirmed: 'Auth.EmailNotConfirmed',
} as const;
