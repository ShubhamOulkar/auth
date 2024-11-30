import React, { useEffect } from "react";
import useNotificationContext from "../notification context/useNotificationContexxt";

function getMessage(notification) {
  if (notification?.err_code || notification?.err_msg) {
    return `${notification?.err_code || "client error:"}: ${
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
    setTimeout(() => {
      setNotification(undefined);
    }, 10000);
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
