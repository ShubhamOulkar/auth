import { createContext } from "react";
import { NotificationContextType } from "../types/notificationType";

const NotificationContext = createContext({} as NotificationContextType);

export default NotificationContext;
