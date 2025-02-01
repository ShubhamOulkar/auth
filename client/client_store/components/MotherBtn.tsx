import logoutHandler from "../handlers/logoutHandler";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";

import { LogoutHandlerType } from "../types/LogoutHandlerType";
import { localStorageName } from "../env";

function MotherBtn({ btnName }: { btnName: string }) {
  const { setNotification } = useNotificationContext();
  const { reset2FaContext } = use2FaContext();

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response: LogoutHandlerType = await logoutHandler(btnName);

    // set notification
    setNotification(response);

    if (response.success) {
      // delete local storage
      localStorage.removeItem(localStorageName);

      // reset 2Fa context
      reset2FaContext();

      //navigate to redirect route provided by server
      //@ts-ignore
      window.location.assign(response?.redirect);
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
