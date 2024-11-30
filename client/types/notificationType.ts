export type NotificationType = {
  success: boolean;
  msg?: string;
  redirect: string;
  err_msg?: string;
  err_code?: number;
};

export type NotificationContextType = {
  notification: NotificationType | undefined;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >;
};
