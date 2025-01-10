import React, { PropsWithChildren, useState } from "react";
import NotificationContext from "./createNotificationContext";
import { NotificationType } from "../types/notificationType";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notification, setNotification] = useState<
    NotificationType | undefined
  >(undefined);

  return (
    <>
      <NotificationContext.Provider value={{ notification, setNotification }}>
        {children}
      </NotificationContext.Provider>
    </>
  );
};

export default NotificationProvider;
