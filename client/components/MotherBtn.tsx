import React from "react";
import logoutHandler from "../handlers/logoutHandler";
import useNotificationContext from "../notification context/useNotificationContexxt";
import { NotificationType } from "../types/notificationType";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../auth context/useAuthContext";

function MotherBtn({ btnName }: { btnName: string }) {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { setNotification } = useNotificationContext();

  const onSubmit = async (e: { preventDefault: () => void }) => {
    const response: NotificationType = await logoutHandler(e, btnName);

    // set notification
    setNotification(response);

    if (response.success) {
      // delete local storage
      localStorage.removeItem(import.meta.env.VITE_LOCALSTORAGE_NAME);

      // set auth context false
      setAuth(false);

      //navigate to redirect route provided by server
      //@ts-ignore
      navigate(response?.redirect);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <button className="logoutBtn" type="submit">
        {btnName}
      </button>
    </form>
  );
}

export default MotherBtn;
