import logoutHandler from "../handlers/logoutHandler";
import {
  useNotificationContext,
  use2FaContext,
  useAuthContext,
} from "../context/customUseContextExporters";
import { useNavigate } from "react-router";
import { LogoutHandlerType } from "../types/LogoutHandlerType";
import { localStorageName } from "../env";

function MotherBtn({ btnName }: { btnName: string }) {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { setNotification } = useNotificationContext();
  const { setFa, reset2FaContext } = use2FaContext();

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response: LogoutHandlerType = await logoutHandler(btnName);

    // set notification
    setNotification(response);

    if (response.success) {
      // delete local storage
      localStorage.removeItem(localStorageName);

      // set auth context false
      setAuth(false);

      // disable two factor auth
      setFa(false);

      // reset 2Fa context
      reset2FaContext();

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
