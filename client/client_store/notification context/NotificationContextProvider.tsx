import { PropsWithChildren, useState, useEffect } from "react";
import NotificationContext from "./createNotificationContext";
import { NotificationType } from "../types/notificationType";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notification, setNotification] = useState<
    NotificationType | undefined
  >(undefined);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let msg: string;
    if (notification?.err_code || notification?.err_msg) {
      msg = `${notification?.err_code || "server error:"}: ${
        notification?.err_msg
      }`;
    } else {
      msg = `${notification?.msg}`;
    }
    setMsg(msg);
  }, [notification]);

  return (
    <>
      <NotificationContext.Provider
        value={{ notification, setNotification, msg }}
      >
        {children}
      </NotificationContext.Provider>
    </>
  );
};

export default NotificationProvider;
