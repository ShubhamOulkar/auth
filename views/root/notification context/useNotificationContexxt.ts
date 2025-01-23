import NotificationContext from "./createNotificationContext";
import { useContext } from "react";

const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider."
    );
  }

  return context;
};

export default useNotificationContext;
