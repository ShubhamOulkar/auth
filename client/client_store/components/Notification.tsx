import { useEffect } from "react";
import useNotificationContext from "../notification context/useNotificationContexxt";

function Notification() {
  const { notification, setNotification, msg } = useNotificationContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(undefined);
    }, 20000);

    return () => clearTimeout(timer);
  }, [notification]);

  if (notification === undefined) {
    return <p className="notification"></p>;
  }

  return (
    <>
      <p
        className={`notification ${
          notification?.success ? "greenNote" : "redNote"
        }`}
      >
        {msg}
      </p>
    </>
  );
}

export default Notification;
