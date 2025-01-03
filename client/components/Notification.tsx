import React, { useEffect } from "react";
import useNotificationContext from "../notification context/useNotificationContexxt";
import { NotificationType } from "../types/notificationType";

function getMessage(notification: NotificationType | undefined) {
  if (notification?.err_code || notification?.err_msg) {
    return `${notification?.err_code || "server error:"}: ${
      notification?.err_msg
    }`;
  } else {
    return `${notification?.msg}`;
  }
}

function Notification() {
  const { notification, setNotification } = useNotificationContext();

  const message = getMessage(notification);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(undefined);
    }, 20000);

    return () => clearTimeout(timer);
  }, [notification]);

  if (notification === undefined) {
    return;
  }

  return (
    <>
      <p
        className={`notification ${
          notification?.success ? "greenNote" : "redNote"
        }`}
      >
        {message}
      </p>
    </>
  );
}

export default Notification;
