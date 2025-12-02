export const USER_CREATION_TEST_DATA = [
  {
    caseId: "Case 1",
    description: "Email: testuser@example.com, Password: testpassword",
    email: "testuser@example.com",
    password: "testpassword",
    passwordConfirm: "testpassword",
  },
  {
    caseId: "Case 2",
    description: "Email: testuser2@example.com, Password: testpassword",
    email: "testuser2@example.com",
    password: "testpassword",
    passwordConfirm: "testpassword",
  },
];

export const USER_INVALID_FORM_TEST_DATA = [
  {
    caseId: "Case 1",
    description: "Email: (empty), Password: (empty), Password Confirm: (empty)",
    email: "",
    password: "",
    passwordConfirm: "",
  },
  {
    caseId: "Case 2",
    description:
      "Email: testuser@example.com, Password: (empty), Password Confirm: (empty)",
    email: "testuser@example.com",
    password: "",
    passwordConfirm: "",
  },
  {
    caseId: "Case 3",
    description:
      "Email: testuser@example.com, Password: test, Password Confirm: (empty)",
    email: "testuser@example.com",
    password: "test",
    passwordConfirm: "",
  },
  {
    caseId: "Case 4",
    description:
      "Email: testuser@example.com, Password: (empty), Password Confirm: test",
    email: "testuser@example.com",
    password: "",
    passwordConfirm: "test",
  },
];

export const USER_WRONG_VALUE_TEST_DATA = [
  {
    caseId: "Case 1",
    description:
      "Email: wronguser@example.com, Password: 123456, Password Confirm: 123456",
    email: "wronguser@example.com",
    password: "123456",
    passwordConfirm: "123456",
    expectedError: "Must be at least 8 character(s).",
  },
  {
    caseId: "Case 2",
    description:
      "Email: erroruser1@example.com, Password: 12345678, Password Confirm: 123456789",
    email: "erroruser1@example.com",
    password: "12345678",
    passwordConfirm: "123456789",
    expectedError: "Values don't match.",
  },
];
