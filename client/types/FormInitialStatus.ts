type InitialStatus = {
  success: boolean;
  data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  formSubmittedCount?: number;
};

export { InitialStatus };