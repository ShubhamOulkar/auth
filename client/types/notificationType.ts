import React from "react";
export type NotificationType = {
  success?: boolean;
  msg?: string;
  redirect?: string;
  err_msg?: string;
  err_code?: number;
};

export type NotificationContextType = {
  notification: NotificationType | undefined;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >;
};

export type CLientErrorType = {
  success: boolean;
  err_msg: string;
};
