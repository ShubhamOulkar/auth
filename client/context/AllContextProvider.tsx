import React, { PropsWithChildren } from "react";
import AuthProvider from "../auth context/AuthProvider";
import NotificationProvider from "../notification context/NotificationContextProvider";
import FaProvider from "../2fa context/2FaProvider";

function AllContextProvider({ children }: PropsWithChildren) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <FaProvider>{children}</FaProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default AllContextProvider;
