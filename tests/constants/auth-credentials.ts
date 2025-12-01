export const INVALID_CREDENTIALS = [
  {
    caseId: "Case 1",
    description: "Email (empty), Password: invalid",
    email: "",
    password: "invalid",
  },
  {
    caseId: "Case 2",
    description: "Email: wrongcredential@example.com, Password: (empty)",
    email: "wrongcredential@example.com",
    password: "",
  },
  {
    caseId: "Case 3",
    description: "Email: (empty), Password: (empty)",
    email: "",
    password: "",
  },
];

export const WRONG_CREDENTIALS = [
  {
    caseId: "Case 1",
    description: "Email: notfounduser@example.com, Password: notfoundpassword",
    email: "notfounduser@example.com",
    password: "notfoundpassword",
  },
  {
    caseId: "Case 2",
    description: "Email: wrongcredential@example.com, Password: wrongpassword",
    email: "wrongcredential@example.com",
    password: "wrongpassword",
  },
];

export const VALID_CREDENTIALS = {
  email: process.env.TEST_EMAIL || "test@example.com",
  password: process.env.TEST_PASSWORD || "123456",
};
