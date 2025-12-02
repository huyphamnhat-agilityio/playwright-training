export type ApiErrorResponse = {
  data: {
    [key: string]: {
      code: string;
      message: string;
    };
  };
  message: string;
  status: number;
};
