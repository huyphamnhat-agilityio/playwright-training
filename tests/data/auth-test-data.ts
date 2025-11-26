export const LOGIN_CREDENTIALS = {
  VALID: {
    username: "standard_user",
    password: "secret_sauce",
  },
  LOCKED_OUT: {
    username: "locked_out_user",
    password: "secret_sauce",
  },
} as const;

export const LOGIN_FAILURE_CASES = [
  {
    description: "wrong username and password",
    username: "standard_user2",
    password: "secret_sauce2",
    expectedError: "Username and password do not match",
  },
  {
    description: "empty username",
    username: "",
    password: "secret_sauce",
    expectedError: "Username is required",
  },
  {
    description: "empty password",
    username: "standard_user",
    password: "",
    expectedError: "Password is required",
  },
  {
    description: "empty username and password",
    username: "",
    password: "",
    expectedError: "Username is required",
  },
  {
    description: "locked out user",
    username: "locked_out_user",
    password: "secret_sauce",
    expectedError: "Sorry, this user has been locked out",
  },
] as const;
