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

export const USER_EDIT_TEST_DATA = [
  {
    caseId: "Case 1",
    description: "Edit user email and password",
    originalEmail: "testuseredit@example.com",
    originalPassword: "123456789",
    newEmail: "testuser1@example.com",
    newPassword: "12345678",
    newPasswordConfirm: "12345678",
  },
];

export const USER_EDIT_INVALID_TEST_DATA = [
  {
    caseId: "Case 1",
    description: "Email: (empty), Password: 12345678",
    originalEmail: "testuseredit1@example.com",
    originalPassword: "123456789",
    newEmail: "",
    newPassword: "12345678",
    newPasswordConfirm: "12345678",
  },
  {
    caseId: "Case 2",
    description:
      "Email: testuseredit2@example.com, Password: (empty), Password Confirm: 12345678",
    originalEmail: "testuseredit2@example.com",
    originalPassword: "123456789",
    newEmail: "testuseredit2@example.com",
    newPassword: "",
    newPasswordConfirm: "12345678",
  },
  {
    caseId: "Case 3",
    description:
      "Email: testuseredit3@example.com, Password: 12345678, Password Confirm: (empty)",
    originalEmail: "testuseredit3@example.com",
    originalPassword: "123456789",
    newEmail: "testuseredit3@example.com",
    newPassword: "12345678",
    newPasswordConfirm: "",
  },
];

export const USER_EDIT_WRONG_VALUE_TEST_DATA = [
  {
    caseId: "Case 1",
    description:
      "Email: testuseredit4@example.com, Password: 123456, Password Confirm: 123456",
    originalEmail: "testuseredit4@example.com",
    originalPassword: "123456789",
    newEmail: "testuseredit4@example.com",
    newPassword: "123456",
    newPasswordConfirm: "123456",
    expectedError: "Must be at least 8 character(s).",
  },
  {
    caseId: "Case 2",
    description:
      "Email: testuseredit5@example.com, Password: 123456789, Password Confirm: 12345678",
    originalEmail: "testuseredit5@example.com",
    originalPassword: "123456789",
    newEmail: "testuseredit5@example.com",
    newPassword: "123456789",
    newPasswordConfirm: "12345678",
    expectedError: "Values don't match.",
  },
];

export const USER_DELETE_TEST_DATA = [
  {
    email: "testdelete1@example.com",
    password: "123456789",
  },
  {
    email: "testdelete2@example.com",
    password: "123456789",
  },
];

export const USER_SORT_TEST_DATA = {
  testUsers: [
    { email: "charlie@example.com", password: "testpass123" },
    { email: "alice@example.com", password: "testpass123" },
    { email: "bob@example.com", password: "testpass123" },
  ],
  sortOptions: [
    { field: " email ", locator: "email" },
    { field: " username ", locator: "username" },
    { field: " created ", locator: "created" },
  ],
};
// export const USER_SORT_TEST_DATA = [
//   {
//     caseId: "Case 1",
//     description: "Sort users by email",
//     sortField: ,
//     sortLocator: "",
//     testUsers: ,
//   },
//   {
//     caseId: "Case 2",
//     description: "Sort users by username",
//     sortField: ",
//     sortLocator: "username",

//     testUsers: [
//       { email: "usersort3@example.com", password: "testpass123" },
//       { email: "usersort1@example.com", password: "testpass123" },
//       { email: "usersort2@example.com", password: "testpass123" },
//     ],
//   },
//   {
//     caseId: "Case 3",
//     description: "Sort users by created date",
//     sortField: "",
//     sortLocator: "created",
//     testUsers: [
//       { email: "newest@example.com", password: "testpass123" },
//       { email: "oldest@example.com", password: "testpass123" },
//       { email: "middle@example.com", password: "testpass123" },
//     ],
//   },
// ];
