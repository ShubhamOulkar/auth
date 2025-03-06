import React, { Suspense, lazy, useEffect } from "react";
const NavBar = lazy(() => import("../components/NavigationBar"));
import SkeNav from "../components/skeleton/SkeNav";
import Notification from "../components/Notification";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { loadCatalog } from "../../i18n";
import useLangContext from "../lang context/useLangContext";

export default function Home({ Outlet }: { Outlet: React.JSX.Element }) {
  const { lang } = useLangContext();
  useEffect(() => {
    loadCatalog(lang);
  }, [lang]);
  return (
    <I18nProvider i18n={i18n}>
      <div className="home">
        <Notification />
        <Suspense fallback={<SkeNav />}>
          <NavBar />
        </Suspense>
        <main>{Outlet}</main>
      </div>
    </I18nProvider>
  );
}
