type FieldErrors =
  | {
      firstName?: string[] | undefined;
      lastName?: string[] | undefined;
      email?: string[] | undefined;
      password?: string[] | undefined;
      confirmPassword?: string[] | undefined;
    }
  | undefined;

export { FieldErrors };
