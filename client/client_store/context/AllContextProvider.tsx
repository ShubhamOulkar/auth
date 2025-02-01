import React, { PropsWithChildren } from "react";
import NotificationProvider from "../notification context/NotificationContextProvider";
import FaProvider from "../2fa context/2FaProvider";

function AllContextProvider({ children }: PropsWithChildren) {
  return (
    <NotificationProvider>
      <FaProvider>{children}</FaProvider>
    </NotificationProvider>
  );
}

export default AllContextProvider;
