export const getErrorMessage = (errorRes: any) => {
  let message = 'An unknown error occurred';

  if (!errorRes.error || !errorRes.error.error) {
    return message;
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      return 'This email is already in use';
    case 'EMAIL_NOT_FOUND':
      return 'This email does not exist';
    case 'INVALID_PASSWORD':
      return 'This password is not correct';
    default:
      return 'An unknown error occurred';
  }
};
