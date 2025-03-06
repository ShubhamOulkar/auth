import React, { PropsWithChildren } from "react";
import NotificationProvider from "../notification context/NotificationContextProvider";
import FaProvider from "../2fa context/2FaProvider";
import LangProvider from "../lang context/LangProvider";
function AllContextProvider({ children }: PropsWithChildren) {
  return (
    <LangProvider>
      <NotificationProvider>
        <FaProvider>{children}</FaProvider>
      </NotificationProvider>
    </LangProvider>
  );
}

export default AllContextProvider;
