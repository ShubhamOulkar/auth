import React, { PropsWithChildren } from "react";
import AuthProvider from "../auth context/AuthProvider";
import NotificationProvider from "../notification context/NotificationContextProvider";
import FaProvider from "../2fa context/2FaProvider";
import { PictureProvider } from "../conf 2025 form generator/picture context/createPictureContext";

function AllContextProvider({ children }: PropsWithChildren) {
  return (
    <PictureProvider>
      <NotificationProvider>
        <AuthProvider>
          <FaProvider>{children}</FaProvider>
        </AuthProvider>
      </NotificationProvider>
    </PictureProvider>
  );
}

export default AllContextProvider;
