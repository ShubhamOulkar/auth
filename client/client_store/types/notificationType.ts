import React from "react";
import { UserType } from "./userType";

export type NotificationType = {
  success?: boolean;
  msg?: string;
  redirect?: string | null;
  err_msg?: string;
  err_code?: number;
  user?: UserType;
};

export type NotificationContextType = {
  notification: NotificationType | undefined;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >;
  msg: string;
};

export type CLientErrorType = {
  success: boolean;
  err_msg: string;
  redirect?: string | null;
  user?: UserType;
};
